import jwt from "jsonwebtoken";

const verifyAuth = (req, res, next) => {
    // Try to get token from cookie first, then Authorization header
    let token = req?.cookies?.accessToken;

    if (!token && req?.headers?.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "You must be logged in!",
            error: "Unauthorized"
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // 401 (pehle 403 tha) taaki client expired token pe refresh trigger kare
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
                error: "Unauthorized"
            });
        }
        req.user = user;
        next();
    });
};

export default verifyAuth;