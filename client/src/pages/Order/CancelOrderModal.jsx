import React from 'react';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Cancel Order</h3>
        <p>Please provide a reason for cancelling this order:</p>
        <textarea
          value={cancelReason}
          onChange={e => setCancelReason(e.target.value)}
          placeholder="Enter cancellation reason..."
          rows={4}
        />
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Keep Order
          </button>
          <button className="btn-danger" onClick={onSubmit} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
