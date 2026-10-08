const {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
} = require("../services/cartService");


// ADD TO CART
const addProductToCart = async (
    req,
    res
) => {
    try {
        const {
            product_id,
            quantity,
        } = req.body;

        if (!product_id || !quantity) {
            return res.status(400).json({
                success: false,
                message:
                    "Product and quantity are required",
            });
        }

        const result =
            await addToCart(
                req.user.id,
                Number(product_id),
                Number(quantity)
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

        console.error(
            "Add to cart error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// GET CART
const getCustomerCart = async (
    req,
    res
) => {
    try {

        const cart =
            await getCart(req.user.id);

        let total = 0;

        cart.forEach((item) => {
            total += Number(item.item_total);
        });

        return res.json({
            success: true,
            data: cart,
            total,
        });

    } catch (error) {

        console.error(
            "Get cart error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// UPDATE QUANTITY
const updateQuantity = async (
    req,
    res
) => {
    try {

        const cartItemId =
            Number(req.params.id);

        const {
            quantity,
        } = req.body;

        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity",
            });
        }

        const result =
            await updateCartQuantity(
                req.user.id,
                cartItemId,
                quantity
            );

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }

        return res.json({
            success: true,
            message: result.message,
        });

    } catch (error) {

        console.error(
            "Update cart error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// REMOVE ITEM
const removeProductFromCart = async (
    req,
    res
) => {
    try {

        const cartItemId =
            Number(req.params.id);

        const result =
            await removeFromCart(
                req.user.id,
                cartItemId
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

        console.error(
            "Remove cart item error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// CLEAR CART
const clearCustomerCart = async (
    req,
    res
) => {
    try {

        const result =
            await clearCart(req.user.id);

        return res.json({
            success: true,
            message: result.message,
        });

    } catch (error) {

        console.error(
            "Clear cart error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


module.exports = {
    addProductToCart,
    getCustomerCart,
    updateQuantity,
    removeProductFromCart,
    clearCustomerCart,
};