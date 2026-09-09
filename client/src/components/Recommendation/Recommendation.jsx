import React, { useEffect } from 'react'
import useRecommendationStore from '../../store/recommendationStore'
import './Recommendation.css'
import ProductList from '../product/ProductList';
import { toast } from 'sonner';
import Skeleton from '../ui/Skeleton/Skeleton.jsx';

export default function Recommendation({ category }) {
    const { recommendations, fetchRecommendations, loading, error } = useRecommendationStore();
    // Fetch recommendations when category changes
    useEffect(() => {
        if (!category) return;
        loadRecommendations(category);
    }, [category]);

    if (!category) {
        return null;
    }
    // Function to load recommendations
    async function loadRecommendations(category) {
        try {
            const res = await fetchRecommendations(category);
            if (!res.success || error) {
                toast.error(res.message || error || "Failed to load recommendations.");
            }
        } catch (err) {
            toast.error(err || "Failed to load recommendations.");
            console.error("Failed to fetch recommendations:", err);
        }
    }

    if (loading) {
        return (
            <div className="recommendation-container recommendation-container--loading" aria-busy="true">
                <Skeleton width="220px" aria-label="Loading recommendations" />
            </div>
        );
    }
    if (recommendations.length === 0) {
        return null;
    }
    return (
        <section className="recommendation-container" aria-labelledby="recommendation-title">
            <div className="recommendation-heading">
                <div>
                    <p className="recommendation-eyebrow">You may also like</p>
                    <h2 className="recommendation-title" id="recommendation-title">Recommended for you</h2>
                </div>
                <span className="recommendation-count">{recommendations.length} products</span>
            </div>
            <ProductList products={recommendations} horizontal={true} />
        </section>
    )
}
