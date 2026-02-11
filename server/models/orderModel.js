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
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity must be at least 1"],
                },
                price: {
                    type: Number,
                    required: true,
                    min: [0, "Price cannot be negative"],
                },
                discount: {
                    type: Number,
                    default: 0,
                    min: [0, "Discount cannot be negative"],
                },
            },
        ],

        shippingAddress: {
            address: { type: String, trim: true, lowercase: true },
            city: { type: String, trim: true, lowercase: true },
            postalCode: { type: String, trim: true, lowercase: true },
            country: { type: String, trim: true, lowercase: true },
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

        subtotal: {
            type: Number,
            required: true,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

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
