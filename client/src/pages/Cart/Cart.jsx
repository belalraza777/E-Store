import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../../store/cartStore.js'
import { toast } from 'sonner'
import './Cart.css'

export default function Cart() {
  // Get cart state and actions from store
  const { cart, loading, fetchCart, updateItem, removeItem } = useCartStore();
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Sync quantities to local state
  useEffect(() => {
    if (cart?.items) {
      const qtys = {};
      cart.items.forEach(item => {
        qtys[item._id] = item.quantity;
      });
      setQuantities(qtys);
    }
  }, [cart]);

  // Update item quantity instantly; prevent overlapping calls per item
  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1 || updatingId === itemId) return;
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

  // Redirect to checkout
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

  // Show empty state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
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

  // Calculate totals
  const originalTotal = cart.totalPrice || 0;
  const totalDiscount = cart.totalDiscountPrice || 0;
  const subtotal = originalTotal - totalDiscount;
  const total = subtotal;

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items">
          <div className="items-header">
            <span>{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="items-list">
            {cart.items.map(item => (
              <div key={item._id} className="cart-item">
                {/* Product Image */}
                <div className="item-image">
                  {item.product?.image ? (
                    <img src={item.product.image} alt={item.product.name} />
                  ) : (
                    <div className="placeholder">No Image</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="item-details">
                  <Link to={`/products/${item.product?.slug}`} className="item-title">
                    {item.product?.name}
                  </Link>
                  <p className="item-sku">SKU: {item.product?._id?.substring(0, 8)}</p>
                  
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

                {/* Quantity & Total */}
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
                  <button 
                    onClick={() => handleQuantityChange(item._id, quantities[item._id] + 1)}
                    className="qty-btn"
                    disabled={updatingId === item._id}
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div className="item-total">
                  <span>₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}</span>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => handleRemoveItem(item._id)}
                  className="remove-btn"
                  title="Remove from cart"
                  disabled={updatingId === item._id}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-content">
            <div className="summary-row">
              <span>Price (Original)</span>
              <span>₹{originalTotal.toFixed(2)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span className="save-amount">-₹{totalDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row shipping">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>

            <Link to="/products" className="continue-shopping-link">
              Continue Shopping
            </Link>

            {/* Cart Info */}
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
