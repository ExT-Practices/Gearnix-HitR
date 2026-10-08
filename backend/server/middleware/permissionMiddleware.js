const adminService =
    require("../services/adminService");


const permissionMiddleware = (
    permissionKey
) => {

    return async (req, res, next) => {

        try {

            if (!req.admin) {

                return res.status(401).json({
                    success: false,
                    message:
                        "Admin authentication required"
                });
            }


            const adminId =
                req.admin.id ||
                req.admin.adminId;


            if (!adminId) {

                return res.status(401).json({
                    success: false,
                    message:
                        "Admin ID not found in token"
                });
            }


            const permission =
                await adminService
                    .checkAdminPermission(
                        adminId,
                        permissionKey
                    );


            if (
                !permission ||
                Number(permission.has_permission) !== 1
            ) {

                return res.status(403).json({
                    success: false,
                    message:
                        `Permission denied: ${permissionKey}`
                });
            }


            next();

        } catch (error) {

            console.error(
                "Permission middleware error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to check permission"
            });
        }
    };
};


module.exports = permissionMiddleware;