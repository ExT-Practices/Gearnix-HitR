const bcrypt = require("bcryptjs");

const adminProfileService = require("../services/adminProfileService");
const db = require("../../config/db");

const getAdminProfile = async (req, res) => {
    try {
        const adminId = req.admin.id;

        const result =
            await adminProfileService.getAdminProfile(
                adminId
            );

        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result[0]
        });
    } catch (error) {
        console.error("Get admin profile error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.admin.id;

        const {
            name,
            email,
            phone
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const result =
            await adminProfileService.updateAdminProfile(
                adminId,
                name,
                email,
                phone
            );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: result
        });
    } catch (error) {
        console.error("Update admin profile error:", error);

        return res.status(500).json({
            success: false,
            message: error.sqlMessage || error.message
        });
    }
};

const changeAdminPassword = async (req, res) => {
    try {
        const adminId = req.admin.id;

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must contain at least 6 characters"
            });
        }

        const [adminResult] = await db.query(
            "SELECT password FROM admins WHERE id = ?",
            [adminId]
        );

        if (
            !adminResult ||
            adminResult.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const isPasswordValid =
            await bcrypt.compare(
                currentPassword,
                adminResult[0].password
            );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        const result =
            await adminProfileService.changeAdminPassword(
                adminId,
                hashedPassword
            );

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
            data: result
        });
    } catch (error) {
        console.error("Change password error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword
};