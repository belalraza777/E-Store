import { getRecommendedProducts } from "../helper/recommendation.js";

// Get recommendations for a category (with optional user personalization)
export const getRecommendationsLogic = async (category, userId) => {
    if (!category) {
        const error = new Error("Category is required");
        error.statusCode = 400;
        throw error;
    }

    // If user is not logged in, provide generic recommendations
    // (userId is passed in as null/undefined if not logged in)

    // Helper function to get recommendations based on category and user preferences
    const recommendations = await getRecommendedProducts(userId ? { category, userId } : { category });
    if (!recommendations) {
        const error = new Error("Could not fetch recommendations");
        error.statusCode = 500;
        throw error;
    }

    return recommendations;
};