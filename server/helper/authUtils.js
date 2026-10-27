import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_MS = 15 * 60 * 1000; // 15 minutes
const REFRESH_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Same options are used for setting and clearing cookies
const cookieOptions = (path) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path,
});

// Only the SHA-256 hash of refresh token is stored in DB
export function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

// Access token (15 min)
export function generateAccessToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

// Refresh token (7 days) + session object to store in user.refreshSessions
export function generateRefreshToken(userId) {
    const jti = crypto.randomUUID(); // unique session ID
    const token = jwt.sign({ id: userId, jti }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    return {
        token,
        session: { jti, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + REFRESH_MS) },
    };
}

// Returns payload, or null if token is invalid/expired
export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
        return null;
    }
}

export function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
        return null;
    }
}

// Centralized auth cookie setter
export function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie("accessToken", accessToken, { ...cookieOptions("/"), maxAge: ACCESS_MS });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions("/api/v1/auth"), maxAge: REFRESH_MS });
}

export function clearAuthCookies(res) {
    res.clearCookie("accessToken", cookieOptions("/"));
    res.clearCookie("refreshToken", cookieOptions("/api/v1/auth"));
}

// Password hashing
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// Password comparison
export async function comparePassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}