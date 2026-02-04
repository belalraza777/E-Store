import { getRecommendedProducts } from "../../helper/recommendation.js";

const getRecommendations = async (req, res) => {
    const { category } = req.params;
    if (!category) {
        return res.status(400).json({ success: false, message: "Category is required" });
    }

    // If user is not logged in, provide generic recommendations
    const userId = req?.user?.id;

    // Helper function to get recommendations based on category and user preferences
    const recommendations = await getRecommendedProducts(userId ? { category, userId } : { category });
    if (!recommendations) {
        return res.status(500).json({ success: false, message: "Could not fetch recommendations" });
    }

    return res.status(200).json({ success: true, data: recommendations, message: "Recommendations fetched successfully" });

}

export default {
    getRecommendations
};