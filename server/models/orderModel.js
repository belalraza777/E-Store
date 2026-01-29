import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: Number,
                price: Number,
                discount: Number,
            },
        ],

        shippingAddress: {
            address: String,
            city: String,
            postalCode: String,
            country: String,
        },

        paymentMethod: {
            type: String,
            enum: ["Online", "COD"],
            required: true,
            trim: true,
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
            trim: true,
        },

        razorpay: {
            orderId: {
                type: String,
                trim: true,
            },
            paymentId: {
                type: String,
                trim: true,
            },
            signature: {
                type: String,
                trim: true,
            },
        },

        orderStatus: {
            type: String,
            enum: ["placed", "shipped", "delivered", "cancelled"],
            default: "placed",
            trim: true,
        },

        subtotal: Number,

        totalAmount: Number,

        isCancelled: {
            type: Boolean,
            default: false,
        },

        cancelReason: {
            type: String,
            trim: true,
        },

        isDelivered: {
            type: Boolean,
            default: false,
        },

    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
