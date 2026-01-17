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
            },
        ],

        shippingAddress: {
            street: String,
            city: String,
            postalCode: String,
            country: String,
        },

        paymentMethod: {
            type: String,
            enum: ["Online", "COD"],
            required: true,
            trim: true,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
            trim: true,
        },

        orderStatus: {
            type: String,
            enum: ["placed", "shipped", "delivered", "cancelled"],
            default: "placed",
            trim: true,
            
        },

        totalAmount: Number,

        isCancelled: {
            type: Boolean,
            default: false,
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
