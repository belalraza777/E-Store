import * as recommendationService from "../../services/recommendationService.js";

const getRecommendations = async (req, res) => {
    const { category } = req.params;
    // If user is not logged in, userId will be undefined (logic inside service)
    const userId = req?.user?.id;

    const recommendations = await recommendationService.getRecommendationsLogic(category, userId);

    return res.status(200).json({
        success: true,
        data: recommendations,
        message: "Recommendations fetched successfully",
    });
};

export default {
    getRecommendations,
};