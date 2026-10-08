const db = require("../../config/db");

const getAdminProfile = async (adminId) => {
    const [result] = await db.query(
        "CALL sp_get_admin_profile(?)",
        [adminId]
    );

    return result[0];
};

const updateAdminProfile = async (
    adminId,
    name,
    email,
    phone
) => {
    const [result] = await db.query(
        "CALL sp_update_admin_profile(?, ?, ?, ?)",
        [
            adminId,
            name,
            email,
            phone
        ]
    );

    return result[0];
};

const changeAdminPassword = async (
    adminId,
    newPassword
) => {
    const [result] = await db.query(
        "CALL sp_change_admin_password(?, ?)",
        [
            adminId,
            newPassword
        ]
    );

    return result[0];
};

module.exports = {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword
};