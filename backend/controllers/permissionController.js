const db = require("../config/db");

const getModules = async (req, res) => {
    try {
        const [modules] = await db.query("SELECT * FROM modules WHERE status = 'active' ORDER BY id ASC");
        const [permissions] = await db.query("SELECT * FROM permissions");

        const modulesWithPermissions = modules.map(module => {
            return {
                ...module,
                permissions: permissions.filter(p => p.module_id === module.id)
            };
        });

        return res.status(200).json({
            success: true,
            data: modulesWithPermissions
        });
    } catch (error) {
        console.error("Get Modules Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getModules
};
