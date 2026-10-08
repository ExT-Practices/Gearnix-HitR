const jwt = require("jsonwebtoken");

const customerAuthMiddleware = (
    req,
    res,
    next
) => {
    try {

        const authHeader =
            req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required",
            });
        }

        const token =
            authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid authorization",
            });
        }

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        if (
            decoded.role !== "customer"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Customer access required",
            });
        }

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired token",
        });
    }
};


module.exports =
    customerAuthMiddleware;