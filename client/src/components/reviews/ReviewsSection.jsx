// ReviewsSection.jsx - Product reviews container and orchestration component
import React, { useState } from 'react'
import useReviewStore from '../../store/reviewStore.js'
import { toast } from 'sonner'
import './ReviewsSection.css';
import StarRating from './StarRating.jsx';
import { useAuth } from '../../context/authContext.jsx';
import ReviewForm from './ReviewForm.jsx';
import ReviewsList from './ReviewsList.jsx';


export default function ReviewsSection({ productId, reviews, averageRating, totalReviews, reviewsLoading, fetchProductReviews }) {
  // Keep store interactions in parent so child components stay presentational.
  const { addReview, deleteReview } = useReviewStore();
  const { user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const handleSubmitReview = async (reviewForm) => {
    if (!reviewForm.comment.trim()) {
      toast.error('Please write a comment');
      return false;
    }

    setSubmitting(true);
    const result = await addReview(productId, reviewForm);

    if (result.success) {
      toast.success('Review added successfully');
      await fetchProductReviews(productId);
      setSubmitting(false);
      return true;
    } else {
      toast.error(result.message || 'Failed to add review');
      setSubmitting(false);
      return false;
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (deletingReviewId) return;

    const confirmed = window.confirm('Delete this review?');
    if (!confirmed) return;

    setDeletingReviewId(reviewId);
    const result = await deleteReview(reviewId);

    if (result.success) {
      toast.success('Review deleted successfully');
      await fetchProductReviews(productId);
    } else {
      toast.error(result.message || 'Failed to delete review');
    }

    setDeletingReviewId(null);
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

      <ReviewForm submitting={submitting} onSubmit={handleSubmitReview} />

      <ReviewsList
        reviews={reviews}
        totalReviews={totalReviews}
        reviewsLoading={reviewsLoading}
        currentUserId={user?._id}
        deletingReviewId={deletingReviewId}
        onDeleteReview={handleDeleteReview}
      />
    </div>
  )
}
