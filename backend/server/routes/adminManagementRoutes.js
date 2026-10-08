const express = require("express");

const {
    getAllAdmins,
    getAllRoles,
    assignRoleToAdmin,
    getAdminById,
    createAdmin,
    updateAdmin,
    updateAdminPassword,
    updateAdminStatus,
    deleteAdmin,
    getModulesWithPermissions,
    getAdminRolePermissions,
    syncRolePermissions,
    getRolePermissions
} = require("../controllers/adminController");

const adminAuthMiddleware =
    require("../middleware/adminAuthMiddleware");
const permissionMiddleware =
    require("../middleware/permissionMiddleware");

const router = express.Router();


// Get all admins
router.get(
    "/admins",
    adminAuthMiddleware,
    permissionMiddleware("admins.view"),
    getAllAdmins
);

// Get all roles
router.get(
    "/roles",
    adminAuthMiddleware,
    permissionMiddleware("admins.view"),
    getAllRoles
);

// Assign role to admin
router.put(
    "/admins/:id/role",
    adminAuthMiddleware,
    permissionMiddleware("admins.edit"),
    assignRoleToAdmin
);


// Get single admin
router.get(
    "/admins/:id",
    adminAuthMiddleware,
    getAdminById
);


// Create admin
router.post(
    "/admins",
    adminAuthMiddleware,
    permissionMiddleware("admins.add"),
    createAdmin
);


// Update admin
router.put(
    "/admins/:id",
    adminAuthMiddleware,
    permissionMiddleware("admins.edit"),
    updateAdmin
);


// Update password
router.put(
    "/admins/:id/password",
    adminAuthMiddleware,
    updateAdminPassword
);


// Activate / deactivate
router.put(
    "/admins/:id/status",
    adminAuthMiddleware,
    permissionMiddleware("admins.edit"),
    updateAdminStatus
);


// Delete admin
router.delete(
    "/admins/:id",
    adminAuthMiddleware,
    permissionMiddleware("admins.delete"),
    deleteAdmin
);

// Get modules + permissions
router.get(
    "/permissions/modules",
    adminAuthMiddleware,
    getModulesWithPermissions
);

// Get permissions of admin
router.get(
    "/admins/:id/permissions",
    adminAuthMiddleware,
    getAdminRolePermissions
);

// Update role permissions
router.put(
    "/roles/:roleId/permissions",
    adminAuthMiddleware,
    syncRolePermissions
);

router.get(
    "/roles/:roleId/permissions",
    adminAuthMiddleware,
    getRolePermissions
);


module.exports = router;