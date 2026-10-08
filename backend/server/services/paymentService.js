const db = require("../../config/db");


// ==========================================
// Get Order for Payment
// ==========================================

const getOrderForPayment = async (
    userId,
    orderId
) => {

    const [result] = await db.query(
        "CALL sp_get_order_for_payment(?, ?)",
        [
            userId,
            orderId,
        ]
    );

    return result[0][0] || null;
};


// ==========================================
// Save Razorpay Order
// ==========================================

const saveRazorpayOrder = async (
    orderId,
    razorpayOrderId
) => {

    const [result] = await db.query(
        "CALL sp_save_razorpay_order(?, ?)",
        [
            orderId,
            razorpayOrderId,
        ]
    );

    return result[0][0];
};


// ==========================================
// Create Payment
// ==========================================

const createPayment = async (
    orderId,
    razorpayOrderId,
    amount
) => {

    const [result] = await db.query(
        "CALL sp_create_payment(?, ?, ?)",
        [
            orderId,
            razorpayOrderId,
            amount,
        ]
    );

    return result[0][0];
};


// ==========================================
// Mark Payment Success
// ==========================================

const markPaymentSuccess = async (
    orderId,
    razorpayOrderId,
    paymentId
) => {

    const [result] = await db.query(
        "CALL sp_mark_payment_success(?, ?, ?)",
        [
            orderId,
            razorpayOrderId,
            paymentId,
        ]
    );

    return result[0][0];
};


// ==========================================
// Get Payment By Razorpay Order
// ==========================================

const getPaymentByRazorpayOrder =
    async (razorpayOrderId) => {

        const [result] = await db.query(
            "CALL sp_get_payment_by_razorpay_order(?)",
            [razorpayOrderId]
        );

        return result[0][0] || null;
    };


// ==========================================
// Process Captured Payment
// ==========================================

const processPaymentWebhook =
    async (
        razorpayOrderId,
        razorpayPaymentId,
        amount
    ) => {

        const [result] = await db.query(
            "CALL sp_process_payment_webhook(?, ?, ?)",
            [
                razorpayOrderId,
                razorpayPaymentId,
                amount,
            ]
        );

        return result[0][0];
    };


// ==========================================
// Process Failed Payment
// ==========================================

const processPaymentFailed =
    async (
        razorpayOrderId,
        razorpayPaymentId
    ) => {

        const [result] = await db.query(
            "CALL sp_process_payment_failed(?, ?)",
            [
                razorpayOrderId,
                razorpayPaymentId,
            ]
        );

        return result[0][0];
    };


// ==========================================
// Check Webhook Event
// ==========================================

const checkWebhookEvent =
    async (
        eventId,
        eventType
    ) => {

        const [result] = await db.query(
            "CALL sp_check_webhook_event(?, ?)",
            [
                eventId,
                eventType,
            ]
        );

        return result[0][0];
    };


// ==========================================
// Get All Payments (Admin)
// ==========================================

const getAllPayments = async () => {
    const query = `
        SELECT 
            p.id, 
            u.name as customer_name, 
            u.email as customer_email, 
            o.order_number, 
            p.amount, 
            p.razorpay_payment_id, 
            p.status, 
            p.created_at
        FROM payments p
        JOIN users u ON p.user_id = u.id
        JOIN orders o ON p.order_id = o.id
        ORDER BY p.created_at DESC
    `;
    const [result] = await db.query(query);
    return result;
};

module.exports = {

    getOrderForPayment,

    saveRazorpayOrder,

    createPayment,

    markPaymentSuccess,

    getPaymentByRazorpayOrder,

    processPaymentWebhook,

    processPaymentFailed,

    checkWebhookEvent,

    getAllPayments,

};