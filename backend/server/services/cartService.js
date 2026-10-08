const db = require("../../config/db");

const addToCart = async (
    userId,
    productId,
    quantity
) => {
    const [result] = await db.query(
        "CALL sp_add_to_cart(?, ?, ?)",
        [userId, productId, quantity]
    );

    return result[0][0];
};

const getCart = async (userId) => {
    const [result] = await db.query(
        "CALL sp_get_cart(?)",
        [userId]
    );

    return result[0];
};

const updateCartQuantity = async (
    userId,
    cartItemId,
    quantity
) => {
    const [result] = await db.query(
        "CALL sp_update_cart_quantity(?, ?, ?)",
        [userId, cartItemId, quantity]
    );

    return result[0][0];
};

const removeFromCart = async (
    userId,
    cartItemId
) => {
    const [result] = await db.query(
        "CALL sp_remove_from_cart(?, ?)",
        [userId, cartItemId]
    );

    return result[0][0];
};

const clearCart = async (userId) => {
    const [result] = await db.query(
        "CALL sp_clear_cart(?)",
        [userId]
    );

    return result[0][0];
};

module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
};