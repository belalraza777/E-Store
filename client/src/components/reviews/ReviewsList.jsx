import React from 'react';
import Skeleton from '../ui/Skeleton/Skeleton.jsx';
import StarRating from './StarRating.jsx';
import { AiOutlineDelete } from "react-icons/ai";


export default function ReviewsList({
    reviews,
    totalReviews,
    reviewsLoading,
    currentUserId,
    deletingReviewId,
    onDeleteReview,
}) {

    if (!Array.isArray(reviews)) {
        return null;
    }

    const isReviewOwner = (review) => {
        const reviewUserId = typeof review.user === 'object' ? review.user?._id : review.user;
        return Boolean(currentUserId && reviewUserId && String(currentUserId) === String(reviewUserId));
    };

    return (
        <div className="reviews-list-section">
            <h3>Reviews ({totalReviews})</h3>

            {reviewsLoading ? (
                <div className="loading">
                    <Skeleton variant="text" width="180px" aria-label="Loading reviews" />
                    <div className="reviews-list-section__skeletons" aria-hidden="true">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="reviews-list-section__skeleton-item">
                                <Skeleton variant="text" width="40%" />
                                <Skeleton variant="text" width="85%" />
                                <Skeleton variant="text" width="65%" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : reviews.length === 0 ? (
                <div className="no-reviews">No reviews yet. Be the first to share your thoughts!</div>
            ) : (
                <div className="reviews-list">
                    {reviews.map((review) => (
                        <div key={review._id} className="review-item">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <div className="reviewer-name-row">
                                        <strong>{review.user?.name || 'Anonymous'}</strong>
                                        {review.isVerified && (
                                            <span className="verified-tag" title="Verified Purchase">Verified Purchase</span>
                                        )}
                                    </div>
                                    <span className="review-rating">
                                        <StarRating value={review.rating} size={16} readOnly={true} />
                                    </span>
                                </div>
                                <span className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>

                            <p className="review-comment">{review.comment}</p>

                            {isReviewOwner(review) && (
                                <div className="review-actions">
                                    <button
                                        type="button"
                                        className="review-delete-btn"
                                        onClick={() => onDeleteReview(review._id)}
                                        disabled={deletingReviewId === review._id}
                                    >
                                        {deletingReviewId === review._id ? 'Deleting...' : <AiOutlineDelete />}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
