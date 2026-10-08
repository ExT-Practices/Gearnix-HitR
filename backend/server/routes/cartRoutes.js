const express = require("express");

const customerAuthMiddleware =
    require(
        "../middleware/customerAuthMiddleware"
    );

const {
    addProductToCart,
    getCustomerCart,
    updateQuantity,
    removeProductFromCart,
    clearCustomerCart,
} = require(
    "../controllers/cartController"
);

const router = express.Router();


// Every cart API requires customer login
router.use(
    customerAuthMiddleware
);


// GET CART
router.get(
    "/",
    getCustomerCart
);


// ADD TO CART
router.post(
    "/",
    addProductToCart
);


// UPDATE QUANTITY
router.put(
    "/:id",
    updateQuantity
);


// REMOVE ITEM
router.delete(
    "/:id",
    removeProductFromCart
);


// CLEAR CART
router.delete(
    "/",
    clearCustomerCart
);


module.exports = router;