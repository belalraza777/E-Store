import * as paymentService from "../../services/paymentService.js";

/**
 * CREATE RAZORPAY ORDER
 */
export const createOrder = async (req, res) => {
    const { orderId } = req.body;

    const result = await paymentService.createRazorpayOrderLogic(orderId);

    if (!result.success) {
        return res.status(result.statusCode).json({
            success: false,
            message: result.message,
        });
    }

    res.status(201).json({
        success: true,
        razorpayOrder: result.razorpayOrder,
    });
};

/**
 * VERIFY RAZORPAY PAYMENT
 */
export const verifyPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
    } = req.body;

    const result = await paymentService.verifyPaymentLogic({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
    });

    if (!result.success) {
        return res.status(result.statusCode).json({
            success: false,
            message: result.message,
        });
    }

    // Success cases: "Payment verified successfully" or "Payment already verified"
    res.status(result.statusCode).json({
        success: true,
        message: result.message,
    });
};

/**
 * MARK PAYMENT FAILED (user cancellation / timeout)
 */
export const markPaymentFailed = async (req, res) => {
    const { orderId, reason } = req.body;

    const result = await paymentService.markPaymentFailedLogic(orderId, reason);

    if (!result.success) {
        return res.status(result.statusCode).json({
            success: false,
            message: result.message,
        });
    }

    return res.status(result.statusCode).json({
        success: true,
        message: result.message,
    });
};

/**
 * RAZORPAY WEBHOOK
 * Called directly by Razorpay's servers — no user auth, no verifyAuth middleware.
 * Trust is established via HMAC signature over the *raw* request body instead.
 * req.rawBody must be populated upstream (see app.js — express.json({ verify }) ).
 */
export const webhookHandler = async (req, res) => {
    const signature = req.headers["x-razorpay-signature"];
    const rawBody = req.rawBody;

    const isValid = paymentService.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid webhook signature",
        });
    }

    const { event, payload } = req.body;

    const result = await paymentService.handleWebhookEventLogic(event, payload);

    return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
    });
};