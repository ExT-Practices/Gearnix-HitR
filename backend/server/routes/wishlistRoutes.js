const express = require("express");

const customerAuthMiddleware = require("../middleware/customerAuthMiddleware");

const {
    addProductToWishlist,
    getCustomerWishlist,
    removeProductFromWishlist,
    clearCustomerWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

router.use(customerAuthMiddleware);

router.get("/", getCustomerWishlist);

router.post("/", addProductToWishlist);

router.delete("/:id", removeProductFromWishlist);

router.delete("/", clearCustomerWishlist);

module.exports = router;