const db = require("../config/db");

const registerUser = async (
    name,
    email,
    password,
    phone
) => {

    const [result] = await db.query(
        "CALL sp_register_user(?, ?, ?, ?)",
        [
            name,
            email,
            password,
            phone
        ]
    );

    return result[0][0];
};

const getUserByEmail = async (email) => {

    const [rows] = await db.query(
        `
        SELECT
            id,
            name,
            email,
            password,
            phone,
            status
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
    );

    return rows || [];
};

module.exports = {
    registerUser,
    getUserByEmail
};