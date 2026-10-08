// const jwt = require("jsonwebtoken");

// const adminAuth = (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Authorization token required"
//             });
//         }

//         const token = authHeader.startsWith("Bearer ")
//             ? authHeader.split(" ")[1]
//             : null;

//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid authorization format"
//             });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         if (!decoded || decoded.role !== "admin") {
//             return res.status(403).json({
//                 success: false,
//                 message: "Admin access required"
//             });
//         }

//         req.admin = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: "Invalid or expired token"
//         });
//     }
// };

// module.exports = adminAuth;

const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded || decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        req.admin = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = adminAuth;
