const {
    createOrder,
    getOrders,
    getOrderById,
} = require("../../services/orderService");


const createCustomerOrder = async (req, res) => {

    try {

        const {
            shipping_name,
            shipping_phone,
            shipping_address,
            shipping_city,
            shipping_state,
            shipping_pincode,
        } = req.body;


        if (
            !shipping_name ||
            !shipping_phone ||
            !shipping_address ||
            !shipping_city ||
            !shipping_state ||
            !shipping_pincode
        ) {

            return res.status(400).json({
                success: false,
                message: "All shipping fields are required",
            });

        }


        const result = await createOrder(
            req.user.id,
            shipping_name,
            shipping_phone,
            shipping_address,
            shipping_city,
            shipping_state,
            shipping_pincode
        );


        if (!result.success) {

            return res.status(400).json({
                success: false,
                message: result.message,
            });

        }


        return res.status(201).json({
            success: true,
            message: result.message,
            data: {
                order_id: result.order_id,
                order_number: result.order_number,
                total_amount: result.total_amount,
            },
        });

    } catch (error) {

        console.error("Create order error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });

    }

};

const getCustomerOrders = async (req, res) => {
    try {
        const orders = await getOrders(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: orders,
        });
    } catch (error) {
        console.error("Get orders error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getCustomerOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await getOrderById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order retrieved successfully",
            data: order,
        });
    } catch (error) {
        console.error("Get order by id error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    createCustomerOrder,
    getCustomerOrders,
    getCustomerOrderById,
};