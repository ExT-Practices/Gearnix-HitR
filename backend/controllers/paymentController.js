const paymentService = require("../server/services/paymentService");

const getAdminPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments();
        
        return res.status(200).json({
            success: true,
            message: "Payments retrieved successfully",
            data: payments
        });
    } catch (error) {
        console.error("Get admin payments error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getAdminPayments
};
