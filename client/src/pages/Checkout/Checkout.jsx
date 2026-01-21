// Checkout.jsx - Checkout page with shipping form, payment method and order summary
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FiMapPin, FiCreditCard, FiLock } from 'react-icons/fi';
import useCartStore from '../../store/cartStore.js';
import useOrderStore from '../../store/orderStore.js';
import { useAuth } from '../../context/authContext.jsx';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  // Get logged in user data
  const { user } = useAuth();
  // Cart state and actions
  const { cart, loading: cartLoading, fetchCart, clearCart } = useCartStore();
  // Order creation function
  const { createOrder } = useOrderStore();

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  // Track if order was just placed - prevents redirect on cart clear
  const [orderPlaced, setOrderPlaced] = useState(false);
  // Track initial cart load - prevents redirect before cart loads
  const [initialLoad, setInitialLoad] = useState(true);
  // Form fields with user data as defaults
  const [form, setForm] = useState({  
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    postalCode:user?.address?.postalCode || '',
    country:user?.address?.country || 'India',
    paymentMethod: 'COD',
  });

  // Fetch cart on mount
  useEffect(() => {
    fetchCart().finally(() => setInitialLoad(false));
  }, []);

  // Redirect if cart is empty (but not during initial load or after order placed)
  useEffect(() => {
    if (!initialLoad && !orderPlaced && !cartLoading && (!cart || cart.items?.length === 0)) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cart, cartLoading, navigate, initialLoad, orderPlaced]);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Validate required fields
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.postalCode) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);

    // Build order data object
    const orderData = {
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      shippingAddress: { 
        address: `${form.fullName}, ${form.phone}\n${form.address}`,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
      },
      paymentMethod: form.paymentMethod,
    };

    // Create order via API
    const result = await createOrder(orderData);
    setSubmitting(false);

    if (result.success) {
      // Set flag before clearing to prevent empty cart redirect
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } else {
      toast.error(result.message || 'Failed to place order');
    }
  };

  // All prices come pre-calculated from backend cart
  // totalPrice = sum of (item.price * quantity) for all items (original prices)
  // totalDiscountPrice = sum of (item.discountPrice * quantity) - actual amount to pay
  const originalTotal = cart?.totalPrice || 0;
  const discountedTotal = cart?.totalDiscountPrice || cart?.totalPrice || 0;
  const discountAmount = originalTotal - discountedTotal; // savings shown to user

  if (cartLoading) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__loading-container">
          <div className="checkout-page__spinner-large"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-page__container">
        {/* Checkout Form Section */}
        <form className="checkout-page__form-section" onSubmit={handleSubmit}>
          {/* Shipping Address Section */}
          <h3 className="checkout-page__section-title"><FiMapPin /> Shipping Address</h3>
          <div className="checkout-page__section-content">
            <div className="checkout-page__shipping-form">
              {/* Name and Phone row */}
              <div className="checkout-page__form-row">
                <div className="checkout-page__form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="checkout-page__form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>

              {/* Address textarea */}
              <div className="checkout-page__form-group checkout-page__form-group--full-width">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  rows={2}
                  required
                />
              </div>

              {/* City and Postal Code row */}
              <div className="checkout-page__form-row">
                <div className="checkout-page__form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="checkout-page__form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="PIN Code"
                    required
                  />
                </div>
              </div>

              {/* Country dropdown */}
              <div className="checkout-page__form-group">
                <label>Country</label>
                <select name="country" value={form.country} onChange={handleChange}>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <h3 className="checkout-page__section-title"><FiCreditCard /> Payment Method</h3>
          <div className="checkout-page__section-content">
            <div className="checkout-page__payment-methods">
              {/* Cash on Delivery option */}
              <label className={`checkout-page__payment-option ${form.paymentMethod === 'COD' ? 'checkout-page__payment-option--selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={form.paymentMethod === 'COD'}
                  onChange={handleChange}
                />
                <span className="checkout-page__payment-name">Cash on Delivery</span>
              </label>

              {/* Online payment option - ready for payment gateway */}
              <label className={`checkout-page__payment-option ${form.paymentMethod === 'Online' ? 'checkout-page__payment-option--selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online"
                  checked={form.paymentMethod === 'Online'}
                  onChange={handleChange}
                />
                <span className="checkout-page__payment-name">Pay Online</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="checkout-page__place-order-btn" disabled={submitting}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        {/* ===== ORDER SUMMARY SECTION ===== */}
        <div className="checkout-page__summary">
          <h2>Order Summary</h2>

          {/* List of cart items */}
          <div className="checkout-page__items">
            {cart?.items?.map(item => {
              // Get image URL - handle both {url: '...'} object and direct string formats
              const imageUrl = item.product?.images?.[0]?.url || item.product?.images?.[0];
              return (
                <div key={item._id} className="checkout-page__item">
                  {/* Product image */}
                  <div className="checkout-page__item-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.product?.title} />
                    ) : (
                      <div className="placeholder">N/A</div>
                    )}
                  </div>
                  {/* Product name and quantity */}
                  <div className="checkout-page__item-info">
                    <p className="checkout-page__item-name">{item.product?.title}</p>
                    <p className="checkout-page__item-qty">{item.quantity} ×</p>    
                  </div>
                  {/* Item total price (pre-calculated from backend: discountPrice or price * qty) */}
                  <div className="checkout-page__item-price">
                    ₹{(item.discountPrice || item.price || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Price breakdown */}
          <div className="checkout-page__totals">
            {/* Original price before any discounts */}
            <div className="checkout-page__row">
              <span>Subtotal</span>
              <span>₹{originalTotal.toLocaleString('en-IN')}</span>
            </div>
            {/* Show discount only if there is a discount */}
            {discountAmount > 0 && (
              <div className="checkout-page__row checkout-page__row--discount">
                <span>Discount</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {/* Shipping cost */}
            <div className="checkout-page__row">
              <span>Shipping</span>
              <span style={{ color: 'var(--success)' }}>FREE</span>
            </div>
            {/* Final amount to pay */}
            <div className="checkout-page__row checkout-page__row--total">
              <span>Total</span>
              <span>₹{discountedTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="checkout-page__secure">
            <FiLock /> Secure checkout
          </div>
        </div>
      </div>
    </div>
  );
}
