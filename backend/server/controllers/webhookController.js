const crypto = require("crypto");

const {
    processPaymentWebhook,
    processPaymentFailed,
    checkWebhookEvent,
} = require("../services/paymentService");


// ==========================================
// Razorpay Webhook
// ==========================================

const razorpayWebhook = async (req, res) => {

    try {

        const webhookSignature =
            req.headers["x-razorpay-signature"];


        const eventId =
            req.headers["x-razorpay-event-id"];


        if (!webhookSignature) {

            return res.status(400).json({
                success: false,
                message: "Webhook signature missing",
            });

        }


        if (!eventId) {

            return res.status(400).json({
                success: false,
                message: "Webhook event ID missing",
            });

        }


        /*
          IMPORTANT:
    
          req.body must be RAW BUFFER.
    
          Do not use JSON.stringify(req.body)
          for signature verification.
        */

        const rawBody = req.body;


        /*
          Generate expected signature
        */

        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_WEBHOOK_SECRET
                )
                .update(rawBody)
                .digest("hex");


        /*
          Compare signatures safely
        */

        const receivedBuffer =
            Buffer.from(webhookSignature);

        const expectedBuffer =
            Buffer.from(expectedSignature);


        if (
            receivedBuffer.length !==
            expectedBuffer.length
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid webhook signature",
            });

        }


        const signatureValid =
            crypto.timingSafeEqual(
                receivedBuffer,
                expectedBuffer
            );


        if (!signatureValid) {

            return res.status(400).json({
                success: false,
                message: "Invalid webhook signature",
            });

        }


        /*
          Convert raw body to JSON
          ONLY AFTER signature verification
        */

        const payload =
            JSON.parse(
                rawBody.toString("utf8")
            );


        const eventType =
            payload.event;


        /*
          Idempotency check
        */

        const eventResult =
            await checkWebhookEvent(
                eventId,
                eventType
            );


        if (!eventResult.should_process) {

            /*
              Already processed.
      
              Return 200 so Razorpay
              doesn't keep retrying.
            */

            return res.status(200).json({
                success: true,
                message: "Webhook already processed",
            });

        }


        // ======================================
        // Payment Captured
        // ======================================

        if (
            eventType === "payment.captured"
        ) {

            const payment =
                payload.payload?.payment?.entity;


            if (!payment) {

                return res.status(400).json({
                    success: false,
                    message: "Payment data missing",
                });

            }


            const result =
                await processPaymentWebhook(

                    payment.order_id,

                    payment.id,

                    payment.amount

                );


            if (!result.success) {

                console.error(
                    "Webhook payment processing error:",
                    result.message
                );

                return res.status(400).json({
                    success: false,
                    message: result.message,
                });

            }


            console.log(
                "Payment captured webhook processed:",
                payment.id
            );

        }


        // ======================================
        // Order Paid
        // ======================================

        else if (
            eventType === "order.paid"
        ) {

            const order =
                payload.payload?.order?.entity;


            const payment =
                payload.payload?.payment?.entity;


            if (
                payment &&
                payment.order_id
            ) {

                const result =
                    await processPaymentWebhook(

                        payment.order_id,

                        payment.id,

                        payment.amount

                    );


                if (!result.success) {

                    console.error(
                        "Order paid processing error:",
                        result.message
                    );

                }

            }

            console.log(
                "Order paid webhook received:",
                order?.id
            );

        }


        // ======================================
        // Payment Failed
        // ======================================

        else if (
            eventType === "payment.failed"
        ) {

            const payment =
                payload.payload?.payment?.entity;


            if (payment) {

                await processPaymentFailed(

                    payment.order_id,

                    payment.id

                );


                console.log(
                    "Payment failed webhook processed:",
                    payment.id
                );

            }

        }


        /*
          Return 200.
    
          This tells Razorpay:
          webhook received successfully.
        */

        return res.status(200).json({
            success: true,
            message: "Webhook received",
        });

    } catch (error) {

        console.error(
            "Razorpay webhook error:",
            error
        );


        /*
            Return non-2xx when processing failed.
    
            Razorpay can retry failed webhook
            deliveries.
        */

        return res.status(500).json({
            success: false,
            message: "Webhook processing failed",
        });

    }

};


module.exports = {
    razorpayWebhook,
};