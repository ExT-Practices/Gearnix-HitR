const db = require("../config/db");

const getCart = async (req, res) => {
    try {
        const [result] = await db.query("CALL sp_get_cart(?)", [req.user.id]);

        // `result[0]` contains the rows returned by the stored procedure.
        const cartItems = (result[0] || []).map(item => ({
            ...item,
            id: item.cart_item_id // Maps the SP column to 'id' for frontend
        }));

        // Calculate the total locally just in case it's needed
        let total = 0;
        for (let item of cartItems) {
            total += Number(item.item_total || 0);
        }

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            data: cartItems,
            total: total
        });
    } catch (error) {
        console.error("Cart Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        if (!product_id || !quantity) return res.status(400).json({ success: false, message: "Missing product_id or quantity" });

        await db.query("CALL sp_add_to_cart(?, ?, ?)", [req.user.id, product_id, quantity]);

        return res.status(200).json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.error("Cart Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const updateQuantity = async (req, res) => {
    try {
        const cart_item_id = parseInt(req.params.id);
        const { quantity } = req.body;

        await db.query("CALL sp_update_cart_quantity(?, ?, ?)", [req.user.id, cart_item_id, quantity]);

        return res.status(200).json({ success: true, message: "Quantity updated" });
    } catch (error) {
        console.error("Cart Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const removeItem = async (req, res) => {
    try {
        const cart_item_id = parseInt(req.params.id);

        await db.query("CALL sp_remove_from_cart(?, ?)", [req.user.id, cart_item_id]);

        return res.status(200).json({ success: true, message: "Removed from cart" });
    } catch (error) {
        console.error("Cart Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        await db.query("CALL sp_clear_cart(?)", [req.user.id]);
        return res.status(200).json({ success: true, message: "Cart cleared" });
    } catch (error) {
        console.error("Cart Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
};
