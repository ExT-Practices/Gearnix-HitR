const { getAllOrders, getOrderById, updateOrderStatus } = require("../services/orderService");
const db = require("../config/db");

const getAdminOrders = async (req, res) => {
    try {
        const orders = await getAllOrders();
        
        return res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: orders
        });
    } catch (error) {
        console.error("Get admin orders error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getAdminOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        
        const order = await getOrderById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        
        const [paymentResult] = await db.query(
            "SELECT * FROM payments WHERE order_id = ?",
            [orderId]
        );
        const payment = paymentResult[0] || null;

        return res.status(200).json({
            success: true,
            message: "Order details retrieved",
            data: {
                order,
                items: order.items,
                payment
            }
        });
    } catch (error) {
        console.error("Get admin order details error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const updateAdminOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { order_status } = req.body;
        
        if (!order_status) {
            return res.status(400).json({
                success: false,
                message: "Order status is required"
            });
        }
        
        const updated = await updateOrderStatus(orderId, order_status);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully"
        });
    } catch (error) {
        console.error("Update admin order status error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getAdminOrders,
    getAdminOrderDetails,
    updateAdminOrderStatus
};
