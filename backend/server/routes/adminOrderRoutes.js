const express = require("express");

const adminAuthMiddleware =
    require("../middleware/adminAuthMiddleware");

const {
    getOrders,
    getOrder,
    changeOrderStatus,
    getPayments,
} = require("../controllers/adminOrderController");

const router = express.Router();


// ==========================================
// Admin Authentication
// ==========================================

router.use(adminAuthMiddleware);


// ==========================================
// Orders
// ==========================================

router.get(
    "/orders",
    getOrders
);


router.get(
    "/orders/:id",
    getOrder
);


router.put(
    "/orders/:id/status",
    changeOrderStatus
);


// ==========================================
// Payments
// ==========================================

router.get(
    "/payments",
    getPayments
);


module.exports = router;