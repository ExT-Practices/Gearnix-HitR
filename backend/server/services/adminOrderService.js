const db = require("../../config/db");


// ==========================================
// Get All Orders
// ==========================================

const getAllOrders = async () => {

    const [result] = await db.query(
        "CALL sp_admin_get_all_orders()"
    );

    return result[0];
};


// ==========================================
// Get Order Details
// ==========================================

const getOrderDetails = async (orderId) => {

    const [result] = await db.query(
        "CALL sp_admin_get_order_details(?)",
        [orderId]
    );

    return {
        order: result[0][0] || null,
        items: result[1] || [],
        payment: result[2][0] || null,
    };
};


// ==========================================
// Update Order Status
// ==========================================

const updateOrderStatus = async (
    orderId,
    orderStatus
) => {

    const [result] = await db.query(
        "CALL sp_admin_update_order_status(?, ?)",
        [
            orderId,
            orderStatus,
        ]
    );

    return result[0][0];
};


// ==========================================
// Payment History
// ==========================================

const getPaymentHistory = async () => {

    const [result] = await db.query(
        "CALL sp_admin_get_payment_history()"
    );

    return result[0];
};


module.exports = {
    getAllOrders,
    getOrderDetails,
    updateOrderStatus,
    getPaymentHistory,
};