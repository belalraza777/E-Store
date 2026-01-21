import React from 'react';
import './CancelOrderModal.css';

export default function CancelOrderModal({
  show,
  onClose,
  cancelReason,
  setCancelReason,
  onSubmit,
  cancelling
}) {
  if (!show) return null;
  return (
    <div className="cancel-order-modal" onClick={onClose}>
      <div className="cancel-order-modal__panel" onClick={e => e.stopPropagation()}>
        <h3 className="cancel-order-modal__title">Cancel Order</h3>
        <p className="cancel-order-modal__text">Please provide a reason for cancelling this order:</p>
        <textarea
          value={cancelReason}
          onChange={e => setCancelReason(e.target.value)}
          placeholder="Enter cancellation reason..."
          rows={4}
          className="cancel-order-modal__textarea"
        />
        <div className="cancel-order-modal__actions">
          <button className="cancel-order-modal__button" onClick={onClose}>
            Keep Order
          </button>
          <button className="cancel-order-modal__button cancel-order-modal__button--danger" onClick={onSubmit} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
