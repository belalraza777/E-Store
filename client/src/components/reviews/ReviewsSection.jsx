// ReviewsSection.jsx - Product reviews display and submission component
import React, { useState } from 'react'
import useReviewStore from '../../store/reviewStore.js'
import { toast } from 'sonner'
// Styles loaded via main.css

export default function ReviewsSection({ productId, reviews, averageRating, totalReviews, reviewsLoading, fetchProductReviews }) {
  // Get addReview function from store
  const { addReview } = useReviewStore();
  // Form state for new review
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
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

  return (
    <div className="reviews-section">
      {/* Reviews header with average rating */}
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <span className="avg-rating">{averageRating.toFixed(1)}</span>
          {/* Display star rating visually */}
          <div className="stars-small">
            {'★'.repeat(Math.round(averageRating))}<span className="empty">{'☆'.repeat(5 - Math.round(averageRating))}</span>
          </div>
          <span className="total-reviews">({totalReviews} reviews)</span>
        </div>
      </div>

      {/* Add Review Form */}
      <div className="add-review-section">
        <h3>Share Your Experience</h3>
        
        {/* Star rating selector */}
        <div className="form-group">
          <label>Rate this product</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                title={`${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
          </div>
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
            <div className="spinner-small"></div>
            Loading reviews...
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
                      {'★'.repeat(review.rating)}<span className="empty">{'☆'.repeat(5 - review.rating)}</span>
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
