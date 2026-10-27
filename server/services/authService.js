import User from "../models/userModel.js";
import { sendEmail } from "../config/email.js";
import {
    hashToken,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    hashPassword,
    comparePassword,
} from "../helper/authUtils.js";

// Remove password from response
const sanitizeUser = (user) => {
    user.passwordHash = undefined;
    return user;
};

// Create a new refresh session for this device (max 10 devices) and return both tokens
export const createSessionLogic = async (user) => {
    const accessToken = generateAccessToken(user);
    const { token: refreshToken, session } = generateRefreshToken(user._id);

    await User.updateOne(
        { _id: user._id },
        { $push: { refreshSessions: session } }
    );

    return { accessToken, refreshToken };
};

// ================= Login =================

export const loginLogic = async (email, password) => {
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
        return {
            success: false,
            statusCode: 400,
            message: "User not exist!",
            error: "Authentication Failed",
        };
    }
    // Account created with OAuth
    if (user.provider !== "local") {
        return {
            success: false,
            statusCode: 400,
            message: `This account was created using ${user.provider}. Please sign in with ${user.provider}.`,
            error: "Authentication Failed",
        };
    }

    const matchPassword = await comparePassword(password, user.passwordHash);

    if (!matchPassword) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid credentials!",
            error: "Authentication Failed",
        };
    }

    sanitizeUser(user);

    const { accessToken, refreshToken } = await createSessionLogic(user);

    return {
        success: true,
        statusCode: 200,
        message: "Welcome Back!",
        data: user,
        accessToken,
        refreshToken,
    };
};

// ================= Register =================

export const registerLogic = async ({
    name,
    email,
    phone,
    password,
}) => {
    const existingUser = await User.findOne({
        $or: [{ email }, { name }, { phone }],
    });

    if (existingUser) {
        if (existingUser.email === email) {
            return {
                success: false,
                statusCode: 400,
                message: "Email is already in use.",
                error: "Authentication Failed",
            };
        }

        if (existingUser.phone === phone) {
            return {
                success: false,
                statusCode: 400,
                message: "Phone number is already in use.",
                error: "Authentication Failed",
            };
        }
    }

    const hash = await hashPassword(password);

    const user = await User.create({
        name,
        email,
        phone,
        passwordHash: hash,
    });

    sanitizeUser(user);

    const { accessToken, refreshToken } = await createSessionLogic(user);

    await sendEmail(
        user.email,
        "Welcome to E-Store!",
        `Hi ${user.name},

Your account has been created successfully.

Thank you for joining E-Store!

- E-Store Team`
    );

    return {
        success: true,
        statusCode: 201,
        message: "Account Created Successfully!",
        data: user,
        accessToken,
        refreshToken,
    };
};

// ================= Refresh =================

export const refreshLogic = async (token) => {
    const invalid = {
        success: false,
        statusCode: 401,
        message: "Invalid or expired refresh token",
    };

    if (!token) return invalid;

    const payload = verifyRefreshToken(token);

    if (!payload) return invalid;

    const user = await User.findById(payload.id);

    if (!user || user.isBlocked) return invalid;

    const { token: refreshToken, session } = generateRefreshToken(user._id);

    // Is device ka session: same jti + same token hash + expire nahi hua
    const sessionMatch = {
        jti: payload.jti,
        tokenHash: hashToken(token),
        expiresAt: { $gt: new Date() },
    };

    // Sirf wahi ek session naye session se replace karo
    const result = await User.updateOne(
        { _id: user._id, refreshSessions: { $elemMatch: sessionMatch } },
        { $set: { "refreshSessions.$": session } }
    );

    // Kuch replace nahi hua = session nahi mila, expire ho gaya, ya token pehle use ho chuka (replay)
    if (result.modifiedCount === 0) return invalid;

    return {
        success: true,
        statusCode: 200,
        message: "Token refreshed",
        accessToken: generateAccessToken(user),
        refreshToken,
    };
};

// ================= Logout =================

export const logoutLogic = async (token) => {
    const payload = token ? verifyRefreshToken(token) : null;

    // Revoke only this device's session
    if (payload) {
        await User.updateOne(
            { _id: payload.id },
            { $pull: { refreshSessions: { jti: payload.jti } } }
        );
    }

    return {
        success: true,
        statusCode: 200,
        message: "Logout Successfully!",
    };
};

// ================= Check User =================

export const checkUserLogic = async (token) => {
    if (!token) {
        return {
            success: false,
            statusCode: 401,
            message: "No token provided",
        };
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
        return {
            success: false,
            statusCode: 401,
            message: "Invalid token",
        };
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        return {
            success: false,
            statusCode: 401,
            message: "User not found",
        };
    }

    return {
        success: true,
        statusCode: 200,
        message: "Authenticated",
        data: user,
    };
};

// ================= Reset Password =================

export const resetPasswordLogic = async (
    userId,
    oldPassword,
    newPassword
) => {
    const user = await User.findById(userId).select("+passwordHash");

    if (!user) {
        return {
            success: false,
            statusCode: 404,
            message: "User not found",
        };
    }

    if (user.provider !== "local") {
        return {
            success: false,
            statusCode: 400,
            message: `This account uses ${user.provider} sign-in. You can't change a password unless you create one first.`,
        };
    }

    const matchPassword = await comparePassword(
        oldPassword,
        user.passwordHash
    );

    if (!matchPassword) {
        return {
            success: false,
            statusCode: 401,
            message: "Wrong Password",
            error: "Wrong Password",
        };
    }

    user.passwordHash = await hashPassword(newPassword);

    await user.save();

    // Revoke all refresh sessions after successful password change
    await User.updateOne({ _id: user._id }, { $set: { refreshSessions: [] } });

    await sendEmail(
        user.email,
        "Password Changed - E-Store",
        `Hi ${user.name},

Your password has been changed successfully.

If you did not perform this action, please contact support immediately.

- E-Store Team`
    );

    return {
        success: true,
        statusCode: 200,
        message: "Password Changed Successfully",
        data: "password changed",
    };
};