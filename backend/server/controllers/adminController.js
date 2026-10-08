const bcrypt = require("bcryptjs");
const adminService = require("../services/adminService");



// Get all admins
const getAllAdmins = async (req, res) => {

    try {

        const admins =
            await adminService.getAllAdmins();

        res.json({
            success: true,
            data: admins
        });

    } catch (error) {

        console.error(
            "Get admins error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to get admins"
        });
    }
};


const getAllRoles = async (req, res) => {

    try {

        const roles =
            await adminService.getAllRoles();

        res.status(200).json({
            success: true,
            data: roles
        });

    } catch (error) {

        console.error(
            "Get roles error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to get roles"
        });
    }
};


const assignRoleToAdmin = async (req, res) => {

    try {

        const adminId =
            Number(req.params.id);

        const { roleId } = req.body;

        if (!roleId) {
            return res.status(400).json({
                success: false,
                message: "Role is required"
            });
        }

        const result =
            await adminService.assignRoleToAdmin(
                adminId,
                Number(roleId)
            );

        res.status(200).json({
            success: true,
            message:
                result.message ||
                "Role assigned successfully"
        });

    } catch (error) {

        console.error(
            "Assign role error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                error.sqlMessage ||
                "Failed to assign role"
        });
    }
};


// Get modules with permissions
const getModulesWithPermissions = async (req, res) => {

    try {

        const modules =
            await adminService
                .getModulesWithPermissions();


        res.json({
            success: true,
            data: modules
        });

    } catch (error) {

        console.error(
            "Get modules permissions error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to get modules and permissions"
        });
    }
};


const getAdminRolePermissions = async (req, res) => {

    try {

        const adminId =
            Number(req.params.id);


        const permissions =
            await adminService
                .getAdminRolePermissions(
                    adminId
                );


        res.json({
            success: true,
            data: permissions
        });

    } catch (error) {

        console.error(
            "Get admin permissions error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to get admin permissions"
        });
    }
};


const syncRolePermissions = async (req, res) => {

    try {

        const roleId =
            Number(req.params.roleId);

        const {
            permissionIds
        } = req.body;


        if (!Array.isArray(permissionIds)) {

            return res.status(400).json({
                success: false,
                message:
                    "permissionIds must be an array"
            });
        }


        const result =
            await adminService
                .syncRolePermissions(
                    roleId,
                    permissionIds
                );


        res.json({
            success: true,
            message:
                "Permissions updated successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Sync permissions error:",
            error
        );

        res.status(400).json({
            success: false,
            message:
                error.sqlMessage ||
                "Failed to update permissions"
        });
    }
};


// Get admin by ID
const getAdminById = async (req, res) => {

    try {

        const adminId =
            Number(req.params.id);

        const admin =
            await adminService.getAdminById(
                adminId
            );

        if (!admin.length) {

            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.json({
            success: true,
            data: admin[0]
        });

    } catch (error) {

        console.error(
            "Get admin error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to get admin"
        });
    }
};


// Create sub admin
const createAdmin = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            roleId
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await adminService.createAdmin(
            name,
            email,
            hashedPassword,
            phone,
            roleId
        );

        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: result
        });
    } catch (error) {
        console.error("Create admin error:", error);

        return res.status(500).json({
            success: false,
            message: error.sqlMessage || error.message
        });
    }
};




const createSubAdmin = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });
        }


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const result =
            await adminService.createSubAdmin(
                name,
                email,
                hashedPassword
            );


        res.status(201).json({
            success: true,
            message:
                "Sub admin created successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Create sub admin error:",
            error
        );

        res.status(400).json({
            success: false,
            message:
                error.sqlMessage ||
                "Failed to create sub admin"
        });
    }
};


// Update admin
const updateAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;

        const {
            name,
            email,
            phone,
            password,
            roleId
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        let hashedPassword = null;

        if (password && password.trim() !== "") {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must contain at least 6 characters"
                });
            }

            hashedPassword = await bcrypt.hash(password, 10);
        }

        const result = await adminService.updateAdmin(
            adminId,
            name,
            email,
            phone,
            hashedPassword,
            roleId
        );

        return res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: result
        });
    } catch (error) {
        console.error("Update admin error:", error);

        return res.status(500).json({
            success: false,
            message: error.sqlMessage || error.message
        });
    }
};


// Update password
const updateAdminPassword = async (req, res) => {

    try {

        const adminId =
            Number(req.params.id);

        const { password } = req.body;


        if (!password) {

            return res.status(400).json({
                success: false,
                message:
                    "Password is required"
            });
        }


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const result =
            await adminService.updateAdminPassword(
                adminId,
                hashedPassword
            );


        res.json({
            success: true,
            message:
                "Password updated successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Password update error:",
            error
        );

        res.status(400).json({
            success: false,
            message:
                error.sqlMessage ||
                "Failed to update password"
        });
    }
};


// Update status
const updateAdminStatus = async (req, res) => {

    try {

        const adminId =
            Number(req.params.id);

        const { status } = req.body;


        if (!["active", "inactive"].includes(status)) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid status"
            });
        }


        const result =
            await adminService.updateAdminStatus(
                adminId,
                status
            );


        res.json({
            success: true,
            message:
                "Admin status updated successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Status update error:",
            error
        );

        res.status(400).json({
            success: false,
            message:
                error.sqlMessage ||
                "Failed to update status"
        });
    }
};


// Delete admin
const deleteAdmin = async (req, res) => {

    try {

        const adminId =
            Number(req.params.id);


        const result =
            await adminService.deleteAdmin(
                adminId
            );


        res.json({
            success: true,
            message:
                "Admin deleted successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Delete admin error:",
            error
        );

        res.status(400).json({
            success: false,
            message:
                error.sqlMessage ||
                "Failed to delete admin"
        });
    }
};
const getRolePermissions = async (
    req,
    res
) => {

    try {

        const roleId =
            Number(req.params.roleId);

        const permissions =
            await adminService
                .getRolePermissions(roleId);

        res.json({
            success: true,
            data: permissions
        });

    } catch (error) {

        console.error(
            "Get role permissions error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to get role permissions"
        });
    }
};

module.exports = {
    getAllAdmins,
    getAllRoles,
    assignRoleToAdmin,
    getModulesWithPermissions,
    getAdminRolePermissions,
    syncRolePermissions,
    getAdminById,
    createAdmin,
    createSubAdmin,
    updateAdmin,
    updateAdminPassword,
    updateAdminStatus,
    deleteAdmin,


    // Existing...
    getRolePermissions,
};