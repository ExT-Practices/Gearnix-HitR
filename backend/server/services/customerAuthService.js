import db from "../config/db.js";

export const registerCustomer = async (
    name,
    email,
    password,
    phone
) => {
    const [result] = await db.query(
        "CALL sp_register_customer(?, ?, ?, ?)",
        [name, email, password, phone]
    );

    return result[0][0];
};

export const loginCustomer = async (email) => {
    const [result] = await db.query(
        "CALL sp_customer_login(?)",
        [email]
    );

    return result[0][0];
};