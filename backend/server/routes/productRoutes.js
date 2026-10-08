const permissionMiddleware = require("../middleware/permissionMiddleware");

const express = require("express");

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus
} = require("../controllers/productController");

const adminAuthMiddleware =
    require("../middleware/adminAuthMiddleware");

const permissionMiddleware =
    require("../middleware/permissionMiddleware");

const router = express.Router();

router.get(
    "/admin/all",
    adminAuthMiddleware,
    permissionMiddleware("products.view"),
    getAllProducts
);

router.post(
    "/",
    adminAuthMiddleware,
    permissionMiddleware("products.add"),
    createProduct
);

router.put(
    "/:id",
    adminAuthMiddleware,
    permissionMiddleware("products.edit"),
    updateProduct
);

router.delete(
    "/:id",
    adminAuthMiddleware,
    permissionMiddleware("products.delete"),
    deleteProduct
);

router.put(
    "/:id/status",
    adminAuthMiddleware,
    permissionMiddleware("products.edit"),
    updateProductStatus
);