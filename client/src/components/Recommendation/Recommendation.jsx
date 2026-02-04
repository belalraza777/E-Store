import React, { useMemo } from 'react'
import useRecommendationStore from '../../store/recommendationStore'
import './Recommendation.css'
import ProductList from '../product/ProductList';
import { toast } from 'sonner';
import Skeleton from '../ui/Skeleton/Skeleton.jsx';

export default function Recommendation({ category }) {
    const { recommendations, fetchRecommendations, loading, error } = useRecommendationStore();
    // Fetch recommendations when category changes
    useMemo(() => {
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
        <Skeleton  width="220px" aria-label="Loading products" />
    }
    if (recommendations.length === 0) {
        return null;
    }
    return (
        <div className="recommendation-container">
            <h2 className="recommendation-title">Recommended for you</h2>
            <ProductList products={recommendations} horizontal={true} />
        </div>
    )
}
