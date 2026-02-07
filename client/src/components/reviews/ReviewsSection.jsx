// ReviewsSection.jsx - Product reviews display and submission component
import React, { useState } from 'react'
import useReviewStore from '../../store/reviewStore.js'
import { toast } from 'sonner'
import Skeleton from '../ui/Skeleton/Skeleton.jsx'
import './ReviewsSection.css';
import StarRating from './StarRating.jsx';


export default function ReviewsSection({ productId, reviews, averageRating, totalReviews, reviewsLoading, fetchProductReviews }) {
  // Get addReview function from store
  const { addReview } = useReviewStore();
  // Form state for new review
  const [reviewForm, setReviewForm] = useState({ rating: 1, comment: '' });
  // Track submission loading state
  const [submitting, setSubmitting] = useState(false);

  // Handle review form submission
  const handleSubmitReview = async () => {
    // Validate comment is not empty
    if (!reviewForm.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    setSubmitting(true);
    // Call API to add review
    const result = await addReview(productId, reviewForm);
    if (result.success) {
      toast.success('Review added successfully');
      // Reset form after success
      setReviewForm({ rating: 5, comment: '' });
      // Refresh reviews list
      await fetchProductReviews(productId);
    } else {
      toast.error(result.message || 'Failed to add review');
    }
    setSubmitting(false);
  };

  const handleRatingChange = (newRating) => {
    setReviewForm(prev => ({ ...prev, rating: newRating }));
  };

  

  return (
    <div className="reviews-section">
      {/* Reviews header with average rating */}
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <span className="avg-rating">{averageRating.toFixed(1)}</span>
          {/* Display star rating visually */}
          <StarRating value={averageRating} size={18} readOnly={true} />
          <span className="total-reviews">({totalReviews} reviews)</span>
        </div>
      </div>

      {/* Add Review Form */}
      <div className="add-review-section">
        <h3>Share Your Experience</h3>

        {/* Star rating selector */}
        <div className="form-group">
          <label>Rate this product</label>
          <StarRating value={reviewForm.rating} size={30} readOnly={false} onChange={handleRatingChange} />
        </div>

        {/* Comment textarea */}
        <div className="form-group">
          <label>Your Review</label>
          <textarea
            value={reviewForm.comment}
            onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="Tell us what you think about this product..."
            className="comment-input"
            rows="4"
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmitReview}
          disabled={submitting}
          className="submit-review-btn"
        >
          {submitting ? 'Posting...' : 'Post Review'}
        </button>
      </div>

      {/* Reviews List Section */}
      <div className="reviews-list-section">
        <h3>Reviews ({totalReviews})</h3>

        {/* Loading state */}
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
          // Empty state when no reviews
          <div className="no-reviews">No reviews yet. Be the first to share your thoughts!</div>
        ) : (
          // Display all reviews
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review._id} className="review-item">
                {/* Review header with user info */}
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>{review.user?.name || 'Anonymous'}</strong>
                    {/* User's star rating */}
                    <span className="review-rating">
                      <StarRating value={review.rating} size={16} readOnly={true} />
                    </span>
                  </div>
                  {/* Review date */}
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {/* Review comment text */}
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
