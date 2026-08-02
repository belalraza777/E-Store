import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/email.js";

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "5d",
        }
    );
};

// Remove password from response
const sanitizeUser = (user) => {
    user.passwordHash = undefined;
    return user;
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

    const matchPassword = await bcrypt.compare(password, user.passwordHash);

    if (!matchPassword) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid credentials!",
            error: "Authentication Failed",
        };
    }

    sanitizeUser(user);

    return {
        success: true,
        statusCode: 200,
        message: "Welcome Back!",
        data: user,
        token: generateToken(user),
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

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        phone,
        passwordHash: hash,
    });

    sanitizeUser(user);

    const token = generateToken(user);

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
        token,
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
    
    const matchPassword = await bcrypt.compare(
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

    user.passwordHash = await bcrypt.hash(newPassword, 10);

    await user.save();

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