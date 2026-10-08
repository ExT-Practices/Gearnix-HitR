const crypto = require("crypto");
const Razorpay = require("razorpay");

const {
    getOrderForPayment,
    saveRazorpayOrder,
    createPayment,
    markPaymentSuccess,
} = require("../services/paymentService");


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ==========================================
// Create Razorpay Order
// ==========================================

const createRazorpayOrder = async (req, res) => {

    try {

        const { order_id } = req.body;


        if (!order_id) {

            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });

        }


        const order = await getOrderForPayment(
            req.user.id,
            Number(order_id)
        );


        if (!order) {

            return res.status(404).json({
                success: false,
                message:
                    "Order not found or payment already completed",
            });

        }


        /*
          Razorpay amount is in paise.
    
          Example:
    
          ₹100
          =
          10000 paise
        */

        const amountInPaise = Math.round(
            Number(order.total_amount) * 100
        );


        const razorpayOrder =
            await razorpay.orders.create({

                amount: amountInPaise,

                currency: "INR",

                receipt: order.order_number,

                notes: {
                    order_id: String(order.order_id),
                    user_id: String(req.user.id),
                },

            });


        /*
          Save Razorpay Order ID
        */

        await saveRazorpayOrder(
            order.order_id,
            razorpayOrder.id
        );


        /*
          Create payment record
        */

        await createPayment(
            order.order_id,
            razorpayOrder.id,
            order.total_amount
        );


        return res.status(201).json({

            success: true,

            data: {

                key_id:
                    process.env.RAZORPAY_KEY_ID,

                razorpay_order_id:
                    razorpayOrder.id,

                amount:
                    razorpayOrder.amount,

                currency:
                    razorpayOrder.currency,

                order_id:
                    order.order_id,

                order_number:
                    order.order_number,

            },

        });

    } catch (error) {

        console.error(
            "Create Razorpay order error:",
            error
        );

        return res.status(500).json({

            success: false,
            message: "Failed to create payment order",

        });

    }

};


// ==========================================
// Verify Payment
// ==========================================

const verifyPayment = async (req, res) => {

    try {

        const {
            order_id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;


        if (
            !order_id ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                success: false,
                message: "Payment details are required",

            });

        }


        /*
          IMPORTANT:
    
          Get YOUR database order.
    
          Do not trust the order ID
          sent by the frontend.
        */

        const order = await getOrderForPayment(
            req.user.id,
            Number(order_id)
        );


        if (!order) {

            return res.status(404).json({

                success: false,
                message: "Order not found",

            });

        }


        /*
          Verify Razorpay Order ID
        */

        if (
            order.razorpay_order_id !==
            razorpay_order_id
        ) {

            return res.status(400).json({

                success: false,
                message: "Invalid Razorpay order",

            });

        }


        /*
          Generate signature
    
          HMAC SHA256:
    
          razorpay_order_id
          +
          "|"
          +
          razorpay_payment_id
        */

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    razorpay_order_id +
                    "|" +
                    razorpay_payment_id
                )
                .digest("hex");


        /*
          Compare signatures
        */

        const expectedSignature =
            Buffer.from(generatedSignature);
        const providedSignature =
            Buffer.from(razorpay_signature);

        if (
            expectedSignature.length !==
            providedSignature.length
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });

        }

        const isValid =
            crypto.timingSafeEqual(
                expectedSignature,
                providedSignature
            );


        if (!isValid) {

            return res.status(400).json({

                success: false,
                message: "Invalid payment signature",

            });

        }


        /*
          Payment is authentic
        */

        const result =
            await markPaymentSuccess(
                order.order_id,
                razorpay_order_id,
                razorpay_payment_id
            );


        if (!result.success) {

            return res.status(400).json({

                success: false,
                message: result.message,

            });

        }


        return res.json({

            success: true,

            message:
                "Payment verified successfully",

            data: {
                order_id: order.order_id,
                order_number: order.order_number,
                payment_id: razorpay_payment_id,
            },

        });

    } catch (error) {

        console.error(
            "Payment verification error:",
            error
        );

        return res.status(500).json({

            success: false,
            message: "Payment verification failed",

        });

    }

};


module.exports = {
    createRazorpayOrder,
    verifyPayment,
};