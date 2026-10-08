const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerUser, getUserByEmail } = require("../services/authService");

const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await registerUser(name, email, hashedPassword, phone);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const users = await getUserByEmail(email);
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];
        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: "customer" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Get admin from stored procedure
        const [rows] = await db.query(
            "CALL sp_admin_login(?)",
            [email]
        );

        const admins = rows[0];

        if (!admins || admins.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        const admin = admins[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        // For Lesson 4, every account in the admins table
        // is treated as an admin.
        const adminRole = "admin";

        // Create JWT
        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: adminRole
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Send response
        return res.status(200).json({
            success: true,
            message: "Admin login successful",

            token,

            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: adminRole
            }
        });

    } catch (error) {
        console.error("Admin Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    adminLogin
};