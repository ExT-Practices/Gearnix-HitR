const express = require("express");

const customerAuthMiddleware = require("../middleware/customerAuthMiddleware");

const {
    createRazorpayOrder,
    verifyPayment,
} = require("../controllers/paymentController");


const router = express.Router();


router.use(customerAuthMiddleware);


// ==========================================
// Create Razorpay Order
// ==========================================

router.post(
    "/create-order",
    createRazorpayOrder
);


// ==========================================
// Verify Payment
// ==========================================

router.post(
    "/verify",
    verifyPayment
);


module.exports = router;