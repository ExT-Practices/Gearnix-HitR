const db = require("../config/db");

const getAdminByEmail = async (email) => {
    const [result] = await db.query(
        `
        SELECT
            id,
            name,
            email,
            password,
            status
        FROM admins
        WHERE email = ?
        LIMIT 1
        `,
        [email]
    );

    return result;
};

module.exports = {
    getAdminByEmail
};