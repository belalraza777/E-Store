// Cart.jsx - Shopping cart page with quantity management and order summary
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../../store/cartStore.js'
import { toast } from 'sonner'
import Skeleton from '../../components/ui/Skeleton/Skeleton.jsx'
import './Cart.css'

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
        <div className="cart-page__loading-container" aria-busy="true">
          <Skeleton variant="circle" width="56px" height="56px" aria-label="Loading cart" />
          <Skeleton variant="text" width="220px" />
          <Skeleton variant="text" width="180px" />
        </div>
      </div>
    );
  }

  // Show empty cart state with link to products
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__empty-cart">
          {/* Cart icon SVG */}
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/products" className="cart-page__continue-shopping-btn">
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

      <div className="cart-page__container">
        {/* Cart Items Section */}
        <div className="cart-page__items-section">
          {/* Items count header */}
          <div className="cart-page__items-header">
            <span>{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</span>
          </div>

          {/* List of cart items */}
          <div className="cart-page__items-list">
            {cart.items.map(item => {
              // Get image URL - handle both {url: '...'} object and direct string formats
              const imageUrl = item.product?.images?.[0]?.url || item.product?.images?.[0];
              return (
                <div key={item._id} className="cart-page__item">
                  {/* Product Image */}
                  <div className="cart-page__item-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.product?.title} />
                    ) : (
                      <div className="placeholder">No Image</div>
                    )}
                  </div>

                  {/* Product Info - title, SKU, pricing */}
                  <div className="cart-page__item-details">
                    <Link to={`/products/${item.product?.slug}`} className="cart-page__item-title">
                      {item.product?.title}
                    </Link>
                    <p className="cart-page__item-sku">SKU: {item.product?._id?.substring(0, 8)}</p>
                  
                  {/* Price display - show original and discount if applicable */}
                  <div className="cart-page__item-pricing">
                    {item.discountPrice ? (
                      <>
                        <span className="cart-page__original-price">₹{item.price.toFixed(2)}</span>
                        <span className="cart-page__discount-price">₹{item.discountPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="cart-page__price">₹{item.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls - decrease, input, increase */}
                <div className="cart-page__item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item._id, quantities[item._id] - 1)}
                    className="cart-page__qty-btn"
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
                    className="cart-page__qty-input"
                    disabled={updatingId === item._id}
                  />
                {/* Increase quantity button */}
                  <button 
                    onClick={() => handleQuantityChange(item._id, quantities[item._id] + 1)}
                    className="cart-page__qty-btn"
                    disabled={updatingId === item._id}
                  >
                    +
                  </button>
                </div>

                {/* Item Total - price × quantity */}
                <div className="cart-page__item-total">
                  <span>₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}</span>
                </div>

                {/* Remove Item Button */}
                <button 
                  onClick={() => handleRemoveItem(item._id)}
                  className="cart-page__remove-btn"
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
        <div className="cart-page__order-summary">
          <h2>Order Summary</h2>

          <div className="cart-page__summary-content">
            {/* Original price row */}
            <div className="cart-page__summary-row">
              <span>Price (Original)</span>
              <span>₹{originalTotal.toFixed(2)}</span>
            </div>

            {/* Discount amount row - only show if discount exists */}
            {discountAmount > 0 && (
              <div className="cart-page__summary-row cart-page__summary-row--discount">
                <span>Discount</span>
                <span className="save-amount">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            {/* Subtotal row */}
            <div className="cart-page__summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {/* Shipping info */}
            <div className="cart-page__summary-row cart-page__summary-row--shipping">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>

            <div className="cart-page__summary-divider"></div>

            {/* Total amount */}
            <div className="cart-page__summary-row cart-page__summary-row--total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            {/* Checkout button */}
            <button onClick={handleCheckout} className="cart-page__checkout-btn">
              Proceed to Checkout
            </button>

            {/* Continue shopping link */}
            <Link to="/products" className="cart-page__continue-shopping-link">
              Continue Shopping
            </Link>

            {/* Cart Info - benefits */}
            <div className="cart-page__cart-info">
              <p>✓ Free shipping on all orders</p>
              <p>✓ Secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
