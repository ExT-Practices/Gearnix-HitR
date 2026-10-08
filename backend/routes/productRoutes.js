const express = require("express");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    deleteProductImage
} = require("../controllers/productController");


const {
    authMiddleware,
    adminMiddleware
} = require("../middleware/authMiddleware");


const upload =
    require("../middleware/uploadMiddleware");


const router = express.Router();


// Public
router.get("/", getProducts);

router.get("/:id", getProductById);


// Admin
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    upload.any(),
    createProduct
);


router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    upload.any(),
    updateProduct
);


router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);


router.delete(
    "/image/:id",
    authMiddleware,
    adminMiddleware,
    deleteProductImage
);


module.exports = router;