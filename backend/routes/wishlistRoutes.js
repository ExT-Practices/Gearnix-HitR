const express = require("express");
const { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } = require("../controllers/wishlistController");

// const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:id", removeFromWishlist);
router.delete("/", clearWishlist);

module.exports = router;
