const db = require("../config/db");

const createOrder = async (
    userId,
    shippingName,
    shippingPhone,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingPincode
) => {

    const [result] = await db.query(
        `CALL sp_create_order(?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            shippingName,
            shippingPhone,
            shippingAddress,
            shippingCity,
            shippingState,
            shippingPincode,
        ]
    );

    return result[0][0];
};

const getOrders = async (userId) => {
    // If a stored procedure like sp_get_customer_orders exists, you can use it.
    // For now, we fallback to a standard SQL query.
    try {
        const [result] = await db.query(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
            [userId]
        );
        return result;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

const getOrderById = async (orderId) => {
    try {
        const [orderResult] = await db.query(
            `SELECT o.*, u.name as customer_name, u.email as customer_email 
             FROM orders o 
             JOIN users u ON o.user_id = u.id 
             WHERE o.id = ?`,
            [orderId]
        );
        const order = orderResult[0];
        
        if (!order) return null;

        const [itemsResult] = await db.query(
            `SELECT oi.*, p.slug, p.price as current_price
             FROM order_items oi
             LEFT JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [orderId]
        );
        order.items = itemsResult;
        
        return order;
    } catch (error) {
        console.error("Error fetching order by id:", error);
        throw error;
    }
};

const getAllOrders = async () => {
    try {
        const query = `
            SELECT 
                o.id as order_id,
                o.order_number,
                o.total_amount,
                o.payment_status,
                o.order_status,
                o.created_at,
                u.name as customer_name,
                u.email as customer_email,
                (SELECT SUM(quantity) FROM order_items oi WHERE oi.order_id = o.id) as total_items
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `;
        const [result] = await db.query(query);
        return result;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        throw error;
    }
};

const updateOrderStatus = async (orderId, status) => {
    try {
        const [result] = await db.query(
            "UPDATE orders SET order_status = ? WHERE id = ?",
            [status, orderId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
};