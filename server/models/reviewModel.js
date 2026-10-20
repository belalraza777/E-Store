import mongoose from "mongoose";
import Product from "./productModel.js";

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", index: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, trim: true },
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Update product's review count and average rating
const updateProductStats = async (doc) => {
    if (!doc) return;

    try {
        const [stats] = await mongoose.model("Review").aggregate([
            { $match: { product: doc.product } },
            { $group: { _id: null, count: { $sum: 1 }, avg: { $avg: "$rating" } } },
        ]);

        await Product.updateOne(
            { _id: doc.product },
            {
                reviewCount: stats?.count ?? 0,
                averageRating: stats ? Math.round(stats.avg * 10) / 10 : 0,
            }
        );
    } catch (error) {
        console.error("Error updating product reviews:", error);
    }
};

reviewSchema.post("save", updateProductStats);
reviewSchema.post("findOneAndDelete", updateProductStats);

export default mongoose.model("Review", reviewSchema);
