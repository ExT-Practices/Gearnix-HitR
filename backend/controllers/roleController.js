const db = require("../config/db");

const updateRolePermissions = async (req, res) => {
    try {
        const roleId = req.params.id;
        const { permissionIds } = req.body;

        if (!Array.isArray(permissionIds)) {
            return res.status(400).json({
                success: false,
                message: "permissionIds must be an array"
            });
        }

        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // Delete existing permissions for this role
            await connection.query("DELETE FROM role_permissions WHERE role_id = ?", [roleId]);

            // Insert new permissions if any
            if (permissionIds.length > 0) {
                // Filter out invalid permission IDs
                const [validPermissions] = await connection.query(
                    "SELECT id FROM permissions WHERE id IN (?)",
                    [permissionIds]
                );
                
                const validIds = validPermissions.map(p => p.id);

                if (validIds.length > 0) {
                    const values = validIds.map(permId => [roleId, permId]);
                    await connection.query("INSERT INTO role_permissions (role_id, permission_id) VALUES ?", [values]);
                }
            }

            await connection.commit();

            return res.status(200).json({
                success: true,
                message: "Role permissions updated successfully"
            });
        } catch (error) {
            await connection.rollback();
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    success: false,
                    message: "One or more permission IDs are invalid"
                });
            }
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error("Update Role Permissions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getRolePermissions = async (req, res) => {
    try {
        const roleId = req.params.id;
        const [permissions] = await db.query(
            "SELECT permission_id FROM role_permissions WHERE role_id = ?",
            [roleId]
        );
        return res.status(200).json({ success: true, data: permissions });
    } catch (error) {
        console.error("Get Role Permissions Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const getRoles = async (req, res) => {
    try {
        const [roles] = await db.query("SELECT * FROM roles ORDER BY id DESC");
        return res.status(200).json({ success: true, data: roles });
    } catch (error) {
        console.error("Get Roles Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const createRole = async (req, res) => {
    try {
        const { name, slug } = req.body;
        if (!name || !slug) {
            return res.status(400).json({ success: false, message: "Name and slug are required" });
        }
        const [result] = await db.query("INSERT INTO roles (name, slug, status) VALUES (?, ?, 'active')", [name, slug]);
        return res.status(201).json({ success: true, message: "Role created successfully", data: { id: result.insertId, name, slug, status: 'active' } });
    } catch (error) {
        console.error("Create Role Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const roleId = req.params.id;
        const { name, slug } = req.body;
        await db.query("UPDATE roles SET name = ?, slug = ? WHERE id = ?", [name, slug, roleId]);
        return res.status(200).json({ success: true, message: "Role updated successfully" });
    } catch (error) {
        console.error("Update Role Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const deleteRole = async (req, res) => {
    try {
        const roleId = req.params.id;
        await db.query("DELETE FROM roles WHERE id = ?", [roleId]);
        return res.status(200).json({ success: true, message: "Role deleted successfully" });
    } catch (error) {
        console.error("Delete Role Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    updateRolePermissions,
    getRolePermissions
};
