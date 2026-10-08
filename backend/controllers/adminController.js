const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

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

        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role || "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role || "admin"
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

const getAllAdmins = async (req, res) => {
    try {
        const [admins] = await db.query(
            "SELECT id, name, email, role, status, created_at, updated_at FROM admins ORDER BY created_at DESC"
        );

        return res.status(200).json({
            success: true,
            message: "Admins retrieved successfully",
            data: admins
        });
    } catch (error) {
        console.error("Get All Admins Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }

        // Check if email already exists
        const [existing] = await db.query(
            "SELECT id FROM admins WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: {
                id: result.insertId,
                name,
                email
            }
        });
    } catch (error) {
        console.error("Create Admin Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getAdminPermissions = async (req, res) => {
    try {
        const adminId = req.params.id;

        const [rows] = await db.query(`
            SELECT DISTINCT p.permission_key 
            FROM admin_roles ar
            JOIN role_permissions rp ON ar.role_id = rp.role_id
            JOIN permissions p ON rp.permission_id = p.id
            WHERE ar.admin_id = ?
        `, [adminId]);

        const permissions = rows.map(row => row.permission_key);

        return res.status(200).json({
            success: true,
            message: "Admin permissions retrieved successfully",
            data: permissions
        });
    } catch (error) {
        console.error("Get Admin Permissions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    adminLogin,
    getAllAdmins,
    createAdmin,
    getAdminPermissions
};
