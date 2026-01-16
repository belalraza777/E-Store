//Admin Verification Middleware

const verifyAdmin = (req, res, next) => {
    if (!req?.user) {
        return res.status(401).json({ 
            success: false,
            message: "Authentication required", 
            error: "Unauthorized" 
        });
    }

    // Verify user has admin role
    if (req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ 
            success: false,
            message: "Access denied. Admins only.",
            error: "Forbidden" 
        });
    }
};

export default verifyAdmin;