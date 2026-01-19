import mongoose from "mongoose";
import Product from "./productModel.js";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },

        comment: {
            type: String,
            trim: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Middleware to update product review count and average rating after review is created
reviewSchema.post("save", async function (doc) {
    try {
        const allReviews = await mongoose.model("Review").find({ product: doc.product });
        const verifiedReviews = allReviews.filter((r) => r.isVerified);
        const avgRating =
            verifiedReviews.length > 0
                ? (verifiedReviews.reduce((sum, r) => sum + r.rating, 0) / verifiedReviews.length).toFixed(1)
                : 0;

        await Product.findByIdAndUpdate(doc.product, {
            reviewCount: allReviews.length,
            averageRating: parseFloat(avgRating),
        });
    } catch (error) {
        console.error("Error updating product reviews:", error);
    }
});

// Middleware to update product review count and average rating after review is deleted
reviewSchema.post("deleteOne", async function () {
    try {
        const allReviews = await mongoose.model("Review").find({ product: this.getFilter()._id || this.productId });
        if (allReviews.length === 0) return;

        const verifiedReviews = allReviews.filter((r) => r.isVerified);
        const avgRating =
            verifiedReviews.length > 0
                ? (verifiedReviews.reduce((sum, r) => sum + r.rating, 0) / verifiedReviews.length).toFixed(1)
                : 0;

        await Product.findByIdAndUpdate(allReviews[0].product, {
            reviewCount: allReviews.length,
            averageRating: parseFloat(avgRating),
        });
    } catch (error) {
        console.error("Error updating product reviews:", error);
    }
});

export default mongoose.model("Review", reviewSchema);
