import mongoose from "mongoose";
import { CATEGORIES } from "../constants/categories.js";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: Number,

    stock: {
      type: Number,
      default: 0,
    },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },

    ratings: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
