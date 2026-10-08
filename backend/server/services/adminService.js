const db = require("../../config/db");


// Get all admins
const getAllAdmins = async () => {
    const [result] = await db.query(
        "CALL sp_get_all_admins()"
    );

    return result[0];
};


// Get all active roles
const getAllRoles = async () => {
    const [result] = await db.query(
        "CALL sp_get_all_roles()"
    );

    return result[0];
};


// Assign role to admin
const assignRoleToAdmin = async (
    adminId,
    roleId
) => {

    const [result] = await db.query(
        "CALL sp_assign_role_to_admin(?, ?)",
        [
            adminId,
            roleId
        ]
    );

    return result[0][0];
};


// Get admin by ID
const getAdminById = async (adminId) => {
    const [result] = await db.query(
        "CALL sp_get_admin_by_id(?)",
        [adminId]
    );

    return result[0];
};


// Create sub admin
const createSubAdmin = async (
    name,
    email,
    password
) => {

    const [result] = await db.query(
        "CALL sp_create_sub_admin(?, ?, ?)",
        [
            name,
            email,
            password
        ]
    );

    return result[0][0];
};


// Create admin
const createAdmin = async (
    name,
    email,
    password,
    phone,
    roleId
) => {
    const [result] = await db.query(
        "CALL sp_create_admin(?, ?, ?, ?, ?)",
        [
            name,
            email,
            password,
            phone,
            roleId || null
        ]
    );

    return result[0];
};


// Update admin
const updateAdmin = async (
    adminId,
    name,
    email,
    phone = null,
    password,
    roleId
) => {

    const [result] = await db.query(
        "CALL sp_update_admin(?, ?, ?)",
        [
            adminId,
            name,
            email
        ]
    );

    if (password) {
        await db.query(
            "CALL sp_update_admin_password(?, ?)",
            [adminId, password]
        );
    }

    if (roleId) {
        await db.query(
            "CALL sp_assign_role_to_admin(?, ?)",
            [adminId, roleId]
        );
    }

    return result[0];
};


// Update password
const updateAdminPassword = async (
    adminId,
    password
) => {

    const [result] = await db.query(
        "CALL sp_update_admin_password(?, ?)",
        [
            adminId,
            password
        ]
    );

    return result[0][0];
};


// Update status
const updateAdminStatus = async (
    adminId,
    status
) => {

    const [result] = await db.query(
        "CALL sp_update_admin_status(?, ?)",
        [
            adminId,
            status
        ]
    );

    return result[0][0];
};


// Delete admin
const deleteAdmin = async (adminId) => {

    const [result] = await db.query(
        "CALL sp_delete_admin(?)",
        [adminId]
    );

    return result[0][0];
};

// Get all modules and permissions
const getModulesWithPermissions = async () => {

    const [result] = await db.query(
        "CALL sp_get_modules_with_permissions()"
    );

    return result[0];
};


// Get admin permissions
const getAdminRolePermissions = async (adminId) => {

    const [result] = await db.query(
        "CALL sp_get_admin_role_permissions(?)",
        [adminId]
    );

    return result[0];
};


// Check admin permission
const checkAdminPermission = async (
    adminId,
    permissionKey
) => {
    const [result] = await db.query(
        "CALL sp_check_admin_permission(?, ?)",
        [
            adminId,
            permissionKey
        ]
    );

    return result[0][0];
};


// Assign one permission
const assignPermissionToRole = async (
    roleId,
    permissionId
) => {

    const [result] = await db.query(
        "CALL sp_assign_permission_to_role(?, ?)",
        [
            roleId,
            permissionId
        ]
    );

    return result[0][0];
};


// Remove one permission
const removePermissionFromRole = async (
    roleId,
    permissionId
) => {

    const [result] = await db.query(
        "CALL sp_remove_permission_from_role(?, ?)",
        [
            roleId,
            permissionId
        ]
    );

    return result[0][0];
};


// Sync all permissions
const syncRolePermissions = async (
    roleId,
    permissionIds
) => {

    const [result] = await db.query(
        "CALL sp_sync_role_permissions(?, ?)",
        [
            roleId,
            JSON.stringify(permissionIds)
        ]
    );

    return result[0][0];
};

const getRolePermissions = async (
    roleId
) => {

    const [result] = await db.query(
        "CALL sp_get_role_permissions(?)",
        [roleId]
    );

    return result[0];
};




module.exports = {
    getAllAdmins,
    getAllRoles,
    assignRoleToAdmin,
    getAdminById,
    createAdmin,
    createSubAdmin,
    updateAdmin,
    updateAdminPassword,
    updateAdminStatus,
    deleteAdmin,

    // Permission functions
    getModulesWithPermissions,
    getAdminRolePermissions,
    assignPermissionToRole,
    removePermissionFromRole,
    syncRolePermissions,

    // New function
    checkAdminPermission,

    // Existing functions...
    getRolePermissions,
};