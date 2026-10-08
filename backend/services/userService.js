const db = require("../config/db");


// Get all users
const getAllUsers = async () => {

    const [result] = await db.query(
        "CALL sp_get_all_users()"
    );

    return result[0];
};


// Get user by ID
const getUserById = async (id) => {

    const [result] = await db.query(
        "CALL sp_get_user_by_id(?)",
        [id]
    );

    return result[0][0];
};


// Update user status
const updateUserStatus = async (
    id,
    status
) => {

    const [result] = await db.query(
        "CALL sp_update_user_status(?, ?)",
        [
            id,
            status
        ]
    );

    return result[0][0];
};

// Create user (Admin)
const createUser = async (name, email, password, phone, address, city, state, pincode, status) => {
    const [result] = await db.query(
        "CALL sp_admin_create_user(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name, email, password, phone, address, city, state, pincode, status]
    );
    return result[0][0];
};

// Update user (Admin)
const updateUser = async (id, name, email, phone, address, city, state, pincode, status) => {
    const [result] = await db.query(
        "CALL sp_admin_update_user(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [id, name, email, phone, address, city, state, pincode, status]
    );
    return result[0][0];
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserStatus,
    createUser,
    updateUser
};