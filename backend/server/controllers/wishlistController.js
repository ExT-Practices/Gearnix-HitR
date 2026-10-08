const {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist,
} = require("../services/wishlistService");

const addProductToWishlist = async (req, res) => {
    try {
        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: "Product is required",
            });
        }

        const result = await addToWishlist(
            req.user.id,
            Number(product_id)
        );

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }

        return res.status(201).json({
            success: true,
            message: result.message,
        });

    } catch (error) {
        console.error("Add wishlist error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


const getCustomerWishlist = async (req, res) => {
    try {
        const wishlist = await getWishlist(req.user.id);

        return res.json({
            success: true,
            data: wishlist,
        });

    } catch (error) {
        console.error("Get wishlist error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


const removeProductFromWishlist = async (req, res) => {
    try {
        const wishlistItemId = Number(req.params.id);

        const result = await removeFromWishlist(
            req.user.id,
            wishlistItemId
        );

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message,
            });
        }

        return res.json({
            success: true,
            message: result.message,
        });

    } catch (error) {
        console.error("Remove wishlist error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


const clearCustomerWishlist = async (req, res) => {
    try {
        const result = await clearWishlist(req.user.id);

        return res.json({
            success: true,
            message: result.message,
        });

    } catch (error) {
        console.error("Clear wishlist error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


module.exports = {
    addProductToWishlist,
    getCustomerWishlist,
    removeProductFromWishlist,
    clearCustomerWishlist,
};