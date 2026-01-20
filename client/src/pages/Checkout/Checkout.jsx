import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FiMapPin, FiCreditCard, FiLock } from 'react-icons/fi';
import useCartStore from '../../store/cartStore.js';
import useOrderStore from '../../store/orderStore.js';
import { useAuth } from '../../context/authContext.jsx';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading: cartLoading, fetchCart, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({  
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    postalCode:user?.address?.postalCode || '',
    country:user?.address?.country || 'India',
    paymentMethod: 'COD',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (!cartLoading && (!cart || cart.items?.length === 0)) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cart, cartLoading, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Simple validation
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.postalCode) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);

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

    const result = await createOrder(orderData);
    setSubmitting(false);

    if (result.success) {
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } else {
      toast.error(result.message || 'Failed to place order');
    }
  };

  // Calculate totals
  // totalPrice = original price total, totalDiscountPrice = discounted price total (what to pay)
  const originalTotal = cart?.totalPrice || 0;
  const discountedTotal = cart?.totalDiscountPrice || 0;
  const discountAmount = originalTotal - discountedTotal;
  const total = discountedTotal;

  if (cartLoading) {
    return (
      <div className="checkout-page">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        {/* Form */}
        <form className="checkout-form-section" onSubmit={handleSubmit}>
          {/* Shipping */}
          <h3 className="section-title"><FiMapPin /> Shipping Address</h3>
          <div className="section-content">
            <div className="shipping-form">
              <div className="form-row">
                <div className="form-group">
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
                <div className="form-group">
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

              <div className="form-group full-width">
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

              <div className="form-row">
                <div className="form-group">
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
                <div className="form-group">
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

              <div className="form-group">
                <label>Country</label>
                <select name="country" value={form.country} onChange={handleChange}>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment */}
          <h3 className="section-title"><FiCreditCard /> Payment Method</h3>
          <div className="section-content">
            <div className="payment-methods">
              <label className={`payment-option ${form.paymentMethod === 'COD' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={form.paymentMethod === 'COD'}
                  onChange={handleChange}
                />
                <span className="payment-name">Cash on Delivery</span>
              </label>

              {/* Online payment - ready for payment gateway integration */}
              <label className={`payment-option ${form.paymentMethod === 'Online' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online"
                  checked={form.paymentMethod === 'Online'}
                  onChange={handleChange}
                />
                <span className="payment-name">Pay Online</span>
              </label>
            </div>
          </div>

          <button type="submit" className="place-order-btn" disabled={submitting}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        {/* Summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-items">
            {cart?.items?.map(item => (
              <div key={item._id} className="checkout-item">
                <div className="checkout-item-image">
                  {item.product?.images?.[0] ? (
                    <img src={item.product.images[0]} alt={item.product.title} />
                  ) : (
                    <div className="placeholder">No img</div>
                  )}
                </div>
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.product?.title}</p>
                  <p className="checkout-item-qty">Qty: {item.quantity}</p>
                </div>
                <div className="checkout-item-price">
                  ₹{((item.product?.price - (item.product?.discountPrice || 0)) * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-totals">
            <div className="checkout-row">
              <span>Subtotal</span>
              <span>₹{originalTotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="checkout-row discount">
                <span>Discount</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="checkout-row">
              <span>Shipping</span>
              <span style={{ color: 'var(--success)' }}>FREE</span>
            </div>
            <div className="checkout-row total">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="checkout-secure">
            <FiLock /> Secure checkout
          </div>
        </div>
      </div>
    </div>
  );
}
