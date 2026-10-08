const express = require("express");

const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const {
    authMiddleware,
    adminMiddleware
} = require("../middleware/authMiddleware");

const router = express.Router();


// Public
router.get("/", getCategories);

router.get("/:id", getCategoryById);


// Admin Protected
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createCategory
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteCategory
);


module.exports = router;

