const jwt = require("jsonwebtoken");

const token = jwt.sign(
    {
        id: admin.id,
        email: admin.email,
        type: "admin"
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    }
);