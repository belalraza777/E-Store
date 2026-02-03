import { getRecommendedProducts } from "../../helper/recommendation.js";

const getRecommendations = async (req, res) => {
    const { category } = req.body;
    const userId = req?.user?.id;
    if (!category) {
        return res.status(400).json({ success: false, message: "Category is required" });
    }
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    // Helper function to get recommendations based on category and user preferences
    const recommendations = await getRecommendedProducts({ category, userId });
    if (!recommendations) {
        return res.status(500).json({ success: false, message: "Could not fetch recommendations" });
    }

    return res.status(200).json({ success: true, data: recommendations, message: "Recommendations fetched successfully" });

}

export default {
    getRecommendations
};