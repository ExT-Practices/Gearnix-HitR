const express = require("express");
const {
    register,
    login,
    adminLogin
} = require("../controllers/authController");

const {
    authMiddleware
} = require("../middleware/authMiddleware");

const router = express.Router();

// Customer register
router.post("/register", register);

// Customer login
router.post("/login", login);

// Admin login
router.post("/admin/login", adminLogin);

// Protected profile
router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "Protected profile API",
        user: req.user
    });
});

module.exports = router;