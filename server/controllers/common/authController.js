import * as authService from "../../services/authService.js";

// ================= Login =================

export const loginUser = async (req, res, next) => {
        const { email, password } = req.body;

        const result = await authService.loginLogic(email, password);

        return res.status(result.statusCode).json(result);

};

// ================= Register =================

export const registerUser = async (req, res, next) => {
        const result = await authService.registerLogic(req.body);
        return res.status(result.statusCode).json(result);
};

// ================= Logout =================

export const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
            process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    });

    return res.status(200).json({
        success: true,
        message: "Logout Successfully!",
    });
};

// ================= Check User =================

export const checkUser = async (req, res, next) => {
    
        let token = req.cookies?.token;

        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        const result = await authService.checkUserLogic(token);

        return res.status(result.statusCode).json(result);

};

// ================= Reset Password =================

export const resetPassword = async (req, res, next) => {
    
        const { oldPassword, newPassword } = req.body;

        const result = await authService.resetPasswordLogic(
            req.user.id,
            oldPassword,
            newPassword
        );

        return res.status(result.statusCode).json(result);
};

export default {
    loginUser,
    registerUser,
    logoutUser,
    checkUser,
    resetPassword,
};