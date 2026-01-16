import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
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
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
        discountPrice: {
          type: Number,
          default: 0,
        },
      },
    ],

    totalPrice: Number,
    discountPrice: {
      type: Number,
      default: 0,
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
