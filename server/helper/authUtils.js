import bcrypt from "bcrypt";

// Centralized JWT cookie setter
export function setAuthCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
    });
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
