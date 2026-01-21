// Cart.jsx - Shopping cart page with quantity management and order summary
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../../store/cartStore.js'
import { toast } from 'sonner'
// Styles loaded via main.css

export default function Cart() {
  // Get cart state and actions from store
  const { cart, loading, fetchCart, updateItem, removeItem } = useCartStore();
  const navigate = useNavigate();
  // Local state for quantity inputs
  const [quantities, setQuantities] = useState({});
  // Track which item is being updated
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Sync quantities to local state when cart changes
  useEffect(() => {
    if (cart?.items) {
      const qtys = {};
      cart.items.forEach(item => {
        qtys[item._id] = item.quantity;
      });
      setQuantities(qtys);
    }
  }, [cart]);

  // Update item quantity - prevents multiple simultaneous calls
  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1 || updatingId === itemId) return;
    // Update local state immediately for responsive UI
    setQuantities(prev => ({ ...prev, [itemId]: newQty }));
    setUpdatingId(itemId);
    await updateItem(itemId, newQty);
    setUpdatingId(null);
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId) => {
    if (updatingId === itemId) return;
    setUpdatingId(itemId);
    await removeItem(itemId);
    setUpdatingId(null);
    await fetchCart();
    toast.success('Item removed from cart');
  };

  // Navigate to checkout page
  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  // Show empty cart state with link to products
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          {/* Cart icon SVG */}
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Calculate totals from backend pre-calculated values
  // totalPrice = original price total, totalDiscountPrice = what customer pays
  const originalTotal = cart.totalPrice || 0;
  const discountedTotal = cart.totalDiscountPrice || 0;
  const discountAmount = originalTotal - discountedTotal;
  const subtotal = discountedTotal;
  const total = subtotal;

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-container">
        {/* Cart Items Section */}
        <div className="cart-items">
          {/* Items count header */}
          <div className="items-header">
            <span>{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</span>
          </div>

          {/* List of cart items */}
          <div className="items-list">
            {cart.items.map(item => {
              // Get image URL - handle both {url: '...'} object and direct string formats
              const imageUrl = item.product?.images?.[0]?.url || item.product?.images?.[0];
              return (
                <div key={item._id} className="cart-item">
                  {/* Product Image */}
                  <div className="item-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.product?.title} />
                    ) : (
                      <div className="placeholder">No Image</div>
                    )}
                  </div>

                  {/* Product Info - title, SKU, pricing */}
                  <div className="item-details">
                    <Link to={`/products/${item.product?.slug}`} className="item-title">
                      {item.product?.title}
                    </Link>
                    <p className="item-sku">SKU: {item.product?._id?.substring(0, 8)}</p>
                  
                  {/* Price display - show original and discount if applicable */}
                  <div className="item-pricing">
                    {item.discountPrice ? (
                      <>
                        <span className="original-price">₹{item.price.toFixed(2)}</span>
                        <span className="discount-price">₹{item.discountPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="price">₹{item.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls - decrease, input, increase */}
                <div className="item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item._id, quantities[item._id] - 1)}
                    className="qty-btn"
                    disabled={quantities[item._id] <= 1 || updatingId === item._id}
                  >
                    −
                  </button>
                  <input 
                    type="number" 
                    value={quantities[item._id]} 
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      handleQuantityChange(item._id, val);
                    }}
                    min="1"
                    className="qty-input"
                    disabled={updatingId === item._id}
                  />
                {/* Increase quantity button */}
                  <button 
                    onClick={() => handleQuantityChange(item._id, quantities[item._id] + 1)}
                    className="qty-btn"
                    disabled={updatingId === item._id}
                  >
                    +
                  </button>
                </div>

                {/* Item Total - price × quantity */}
                <div className="item-total">
                  <span>₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}</span>
                </div>

                {/* Remove Item Button */}
                <button 
                  onClick={() => handleRemoveItem(item._id)}
                  className="remove-btn"
                  title="Remove from cart"
                  disabled={updatingId === item._id}
                >
                  ✕
                </button>
              </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-content">
            {/* Original price row */}
            <div className="summary-row">
              <span>Price (Original)</span>
              <span>₹{originalTotal.toFixed(2)}</span>
            </div>

            {/* Discount amount row - only show if discount exists */}
            {discountAmount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span className="save-amount">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            {/* Subtotal row */}
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {/* Shipping info */}
            <div className="summary-row shipping">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>

            <div className="summary-divider"></div>

            {/* Total amount */}
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            {/* Checkout button */}
            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>

            {/* Continue shopping link */}
            <Link to="/products" className="continue-shopping-link">
              Continue Shopping
            </Link>

            {/* Cart Info - benefits */}
            <div className="cart-info">
              <p>✓ Free shipping on all orders</p>
              <p>✓ Secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
