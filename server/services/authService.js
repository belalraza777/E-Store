import User from "../../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../config/email.js";

// Service for user login
export const loginLogic = async (email, password) => {
    // Finding user by email
    const user = await User.findOne({ email }).select("+passwordHash");
    // If user does not exist, return error
    if (!user) {
        return { success: false, statusCode: 400, message: "User not exist!", error: "Authentication Failed" };
    }
    // Comparing password with hashed password
    const matchPassword = await bcrypt.compare(password, user.passwordHash);
    // If password does not match, return error
    if (!matchPassword) {
        return { success: false, statusCode: 400, message: "Invalid credentials!", error: "Authentication Failed" };
    }
    // Remove sensitive field before responding
    user.passwordHash = undefined;

    // Generating JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "5d" });

    return { success: true, data: { user, token } };
};

// Service for user registration
export const registerLogic = async ({ name, email, phone, password }) => {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { name }, { phone }] });
    if (existingUser) {
        if (existingUser.email === email) {
            return { success: false, statusCode: 400, message: "Email is already in use.", error: "Authentication Failed" };
        }
        if (existingUser.phone === phone) {
            return { success: false, statusCode: 400, message: "Phone number is already in use.", error: "Authentication Failed" };
        }
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // Creating a new user
    const newUser = new User({ name, email, phone, passwordHash: hash });
    // Saving the new user to the database
    const user = await newUser.save();
    //remove passwordHash from response
    user.passwordHash = undefined;
    // Generating JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "5d" });

    // Send registration email (non‑critical, done after token generation)
    await sendEmail(
        user.email,
        "Welcome to E-Store!",
        `Hi ${user.name},\n\nYour account has been created successfully.\n\nThank you for joining E-Store!\n\n- E-Store Team`
    );

    return { success: true, statusCode: 201, data: { user, token } };
};

// Service to check user login status and role
export const checkUserLogic = async (token) => {
    // If no token, return unauthorized
    if (!token) {
        return { authenticated: false, statusCode: 401, message: "No token provided" };
    }

    //Verifying Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return { authenticated: false, statusCode: 401, message: "Invalid token" };
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        return { authenticated: false, statusCode: 401, message: "User not found" };
    }

    return { authenticated: true, message: "Authenticated", data: user };
};

// Service to reset user password
export const resetPasswordLogic = async (userId, oldPassword, newPassword) => {
    // Finding user by ID
    const user = await User.findById(userId).select("+passwordHash");
    // If user not found, return error
    if (!user) {
        return { success: false, statusCode: 404, message: "User not found" };
    }
    // Comparing old password with hashed password
    const matchPassword = await bcrypt.compare(oldPassword, user.passwordHash);
    // If password does not match, return error
    if (!matchPassword) {
        return { success: false, statusCode: 401, message: "Wrong Password", error: "Wrong Password" };
    }
    // Hashing the new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    // Updating user's password hash
    user.passwordHash = hash;
    // Saving the updated user data
    await user.save();
    // Send password reset email
    await sendEmail(
        user.email,
        "Password Changed - E-Store",
        `Hi ${user.name},\n\nYour password has been changed successfully. If you did not perform this action, please contact support immediately.\n\n- E-Store Team`
    );

    return { success: true, statusCode: 201, data: "password changed" };
};

