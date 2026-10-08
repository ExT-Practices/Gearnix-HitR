const express = require("express");
const jwt = require("jsonwebtoken");

const adminAuth = require("../middleware/adminAuth");
const dashboardController = require("../controllers/dashboardController");
const adminController = require("../controllers/adminController");

const router = express.Router();

// ======================================
// Admin Login
// POST /api/admin/login
// ======================================

router.post(
    "/login",
    adminController.adminLogin
);

// ======================================
// Get All Admins
// GET /api/admin/admins
// ======================================

router.get(
    "/admins",
    adminAuth,
    adminController.getAllAdmins
);

router.post(
    "/admins",
    adminAuth,
    adminController.createAdmin
);

router.get(
    "/admins/:id/permissions",
    adminAuth,
    adminController.getAdminPermissions
);

// ======================================
// Dashboard Stats
// GET /api/admin/dashboard/stats
// ======================================

router.get(
    "/dashboard/stats",
    adminAuth,
    dashboardController.getDashboardStats
);

// ======================================
// Admin Profile
// GET /api/admin/profile
// ======================================

router.get("/profile", (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        return res.json({
            success: true,
            message: "Admin profile API",
            admin: {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            }
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
});

const adminService = require("../server/services/adminService");

router.put("/profile", adminAuth, async (req, res) => {
    try {
        const adminId = req.admin.id;
        const { name, email, phone, password } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        // We use adminService to update the admin. Since the database only accepts name/email for sp_update_admin, 
        // the adminService handles those, and then separately handles password if provided. 
        // We will pass roleId as null here because a user shouldn't be updating their own role.
        const result = await adminService.updateAdmin(adminId, name, email, phone, password, null);

        return res.json({
            success: true,
            message: "Profile updated successfully",
            data: result
        });

    } catch (error) {
        console.error("Update admin profile error:", error);
        return res.status(500).json({
            success: false,
            message: error.sqlMessage || error.message || "Failed to update profile"
        });
    }
});

// ======================================
// Admin Orders
// GET /api/admin/orders
// ======================================
const orderController = require("../controllers/orderController");

router.get(
    "/orders",
    adminAuth,
    orderController.getAdminOrders
);

router.get(
    "/orders/:id",
    adminAuth,
    orderController.getAdminOrderDetails
);

router.put(
    "/orders/:id/status",
    adminAuth,
    orderController.updateAdminOrderStatus
);

// ======================================
// Admin Payments
// GET /api/admin/payments
// ======================================
const paymentController = require("../controllers/paymentController");

router.get(
    "/payments",
    adminAuth,
    paymentController.getAdminPayments
);

// ======================================
// Admin Permissions & Modules
// GET /api/admin/permissions/modules
// ======================================
const permissionController = require("../controllers/permissionController");

router.get(
    "/permissions/modules",
    adminAuth,
    permissionController.getModules
);

// ======================================
// Admin Roles
// PUT /api/admin/roles/:id/permissions
// ======================================
const roleController = require("../controllers/roleController");

router.get(
    "/roles",
    adminAuth,
    roleController.getRoles
);

router.post(
    "/roles",
    adminAuth,
    roleController.createRole
);

router.put(
    "/roles/:id",
    adminAuth,
    roleController.updateRole
);

router.delete(
    "/roles/:id",
    adminAuth,
    roleController.deleteRole
);

router.get(
    "/roles/:id/permissions",
    adminAuth,
    roleController.getRolePermissions
);

router.put(
    "/roles/:id/permissions",
    adminAuth,
    roleController.updateRolePermissions
);

module.exports = router;