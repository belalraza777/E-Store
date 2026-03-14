import React, { useState } from 'react';
import StarRating from './StarRating.jsx';

export default function ReviewForm({ submitting, onSubmit }) {
  const [reviewForm, setReviewForm] = useState({ rating: 1, comment: '' });

  const handleRatingChange = (newRating) => {
    setReviewForm((prev) => ({ ...prev, rating: newRating }));
  };

  const handleSubmit = async () => {
    const wasSuccessful = await onSubmit(reviewForm);
    if (wasSuccessful) {
      setReviewForm({ rating: 1, comment: '' });
    }
  };

  return (
    <div className="add-review-section">
      <h3>Share Your Experience</h3>

      <div className="form-group">
        <label>Rate this product</label>
        <StarRating value={reviewForm.rating} size={30} readOnly={false} onChange={handleRatingChange} />
      </div>

      <div className="form-group">
        <label>Your Review</label>
        <textarea
          value={reviewForm.comment}
          onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
          placeholder="Tell us what you think about this product..."
          className="comment-input"
          rows="4"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="submit-review-btn"
      >
        {submitting ? 'Posting...' : 'Post Review'}
      </button>
    </div>
  );
}
