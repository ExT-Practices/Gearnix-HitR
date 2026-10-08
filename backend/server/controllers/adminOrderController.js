const {
    getAllOrders,
    getOrderDetails,
    updateOrderStatus,
    getPaymentHistory,
} = require("../services/adminOrderService");


// ==========================================
// Get All Orders
// ==========================================

const getOrders = async (req, res) => {

    try {

        const orders =
            await getAllOrders();


        return res.json({
            success: true,
            data: orders,
        });

    } catch (error) {

        console.error(
            "Admin get orders error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });

    }

};


// ==========================================
// Get Order Details
// ==========================================

const getOrder = async (req, res) => {

    try {

        const orderId =
            Number(req.params.id);


        if (
            !Number.isInteger(orderId) ||
            orderId <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });

        }


        const result =
            await getOrderDetails(orderId);


        if (!result.order) {

            return res.status(404).json({
                success: false,
                message: "Order not found",
            });

        }


        return res.json({

            success: true,

            data: {
                order: result.order,
                items: result.items,
                payment: result.payment,
            },

        });

    } catch (error) {

        console.error(
            "Admin order details error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });

    }

};


// ==========================================
// Update Order Status
// ==========================================

const changeOrderStatus = async (
    req,
    res
) => {

    try {

        const orderId =
            Number(req.params.id);

        const {
            order_status,
        } = req.body;


        if (
            !Number.isInteger(orderId) ||
            orderId <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });

        }


        if (!order_status) {

            return res.status(400).json({
                success: false,
                message: "Order status is required",
            });

        }


        const result =
            await updateOrderStatus(
                orderId,
                order_status
            );


        if (!result.success) {

            return res.status(400).json({
                success: false,
                message: result.message,
            });

        }


        return res.json({
            success: true,
            message: result.message,
        });

    } catch (error) {

        console.error(
            "Update order status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });

    }

};


// ==========================================
// Payment History
// ==========================================

const getPayments = async (
    req,
    res
) => {

    try {

        const payments =
            await getPaymentHistory();


        return res.json({
            success: true,
            data: payments,
        });

    } catch (error) {

        console.error(
            "Payment history error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });

    }

};


module.exports = {
    getOrders,
    getOrder,
    changeOrderStatus,
    getPayments,
};