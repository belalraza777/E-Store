import * as authService from "../../services/authService.js";
import { setAuthCookies, clearAuthCookies } from "../../helper/authUtils.js";

// ================= Login =================

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    const result = await authService.loginLogic(email, password);

    if (result.success) {
        setAuthCookies(res, result.accessToken, result.refreshToken);
    }

    return res.status(result.statusCode).json({
        success: result.success,
        statusCode: result.statusCode,
        message: result.message,
        data: result.data,
    });
};

// ================= Register =================

export const registerUser = async (req, res, next) => {
    const result = await authService.registerLogic(req.body);

    if (result.success) {
        setAuthCookies(res, result.accessToken, result.refreshToken);
    }

    return res.status(result.statusCode).json({
        success: result.success,
        statusCode: result.statusCode,
        message: result.message,
        data: result.data,
    });
};

// ================= Refresh =================

export const refreshToken = async (req, res, next) => {
    const result = await authService.refreshLogic(req.cookies?.refreshToken);

    if (result.success) {
        setAuthCookies(res, result.accessToken, result.refreshToken);
    } else {
        clearAuthCookies(res);
    }

    return res.status(result.statusCode).json({
        success: result.success,
        statusCode: result.statusCode,
        message: result.message,
    });
};

// ================= Logout =================

export const logoutUser = async (req, res, next) => {
    const result = await authService.logoutLogic(req.cookies?.refreshToken);

    clearAuthCookies(res);

    return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
    });
};

// ================= Check User =================

export const checkUser = async (req, res, next) => {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    const result = await authService.checkUserLogic(token);

    return res.status(result.statusCode).json({
        success: result.success,
        statusCode: result.statusCode,
        message: result.message,
        data: result.data,
    });
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
    refreshToken,
    logoutUser,
    checkUser,
    resetPassword,
};