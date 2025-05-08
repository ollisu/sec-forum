const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access token missing or invalid" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);  // Use backend secret

        req.user = decoded;  // Attach user info to the request object
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        res.status(401).json({ message: "Unauthorized" });
    }
};

// Middleware to require a specific user type (e.g., admin, regular user)
const requireType = (type) => (req, res, next) => {
    if (!req.user || req.user.type !== type) {  // Checking for 'type' instead of 'role'
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
};

module.exports = { verifyToken, requireType };
