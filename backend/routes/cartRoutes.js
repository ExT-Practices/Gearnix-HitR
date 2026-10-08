const express = require("express");
const { getCart, addToCart, updateQuantity, removeItem, clearCart } = require("../controllers/cartController");
const customerAuthMiddleware = require("../server/middleware/customerAuthMiddleware");

const router = express.Router();

router.use(customerAuthMiddleware);

// Get cart items
router.get("/", getCart);

// Add item to cart
router.post("/", addToCart);

// Update quantity
router.put("/:id", updateQuantity);

// Remove item
router.delete("/:id", removeItem);

// Clear cart
router.delete("/", clearCart);

module.exports = router;
