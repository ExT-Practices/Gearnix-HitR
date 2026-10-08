const db = require("../../config/db");

const addToWishlist = async (userId, productId) => {
    const [result] = await db.query(
        "CALL sp_add_to_wishlist(?, ?)",
        [userId, productId]
    );

    return result[0][0];
};

const getWishlist = async (userId) => {
    const [result] = await db.query(
        "CALL sp_get_wishlist(?)",
        [userId]
    );

    return result[0];
};

const removeFromWishlist = async (userId, wishlistItemId) => {
    const [result] = await db.query(
        "CALL sp_remove_from_wishlist(?, ?)",
        [userId, wishlistItemId]
    );

    return result[0][0];
};

const clearWishlist = async (userId) => {
    const [result] = await db.query(
        "CALL sp_clear_wishlist(?)",
        [userId]
    );

    return result[0][0];
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist,
};