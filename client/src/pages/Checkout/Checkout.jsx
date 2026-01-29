// Checkout.jsx - Main Checkout page (composes CheckoutForm + OrderSummary)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useCartStore from '../../store/cartStore.js';
import useOrderStore from '../../store/orderStore.js';
import { useAuth } from '../../context/authContext.jsx';
import Skeleton from '../../components/ui/Skeleton/Skeleton.jsx';
import CheckoutForm from './CheckoutForm.jsx';
import OnlinePayment from '../../components/OnlinePayment/OnlinePayment.jsx';
import OrderSummary from './OrderSummary.jsx';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading: cartLoading, fetchCart, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();

  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'India',
    paymentMethod: 'COD',
  });

  useEffect(() => {
    fetchCart().finally(() => setInitialLoad(false));
  }, []);

  useEffect(() => {
    if (!initialLoad && !orderPlaced && !cartLoading && (!cart || cart.items?.length === 0)) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cart, cartLoading, navigate, initialLoad, orderPlaced]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const [createdOrderId, setCreatedOrderId] = useState(null);

  // Handle form submission Main fn controlling order placement
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Validate form
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.postalCode) {
      toast.error('Please fill all required fields');
      return;
    }
    const orderData = {
      items: cart.items.map(item => ({ product: item.product._id, quantity: item.quantity })),
      shippingAddress: {
        address: `${form.fullName}, ${form.phone}\n${form.address}`,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
      },
      paymentMethod: form.paymentMethod,
    };

    setSubmitting(true);

    try {
      // Create order on backend
      const result = await createOrder(orderData); // <-- your original orderData untouched
      setSubmitting(false);

      if (!result.success) {
        toast.error(result.message || 'Failed to create order');
        return;
      }

      // Order placed for COD
      if (form.paymentMethod === 'COD') {
        setOrderPlaced(true);
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/orders');
      }
      // Order created for Online Payment
      else if (form.paymentMethod === 'Online') {
        if (result.data && result.data._id) {
          setCreatedOrderId(result.data._id); // Trigger OnlinePayment component
        } else {
          toast.error(result.message || 'Failed to create order for payment');
        }
      }

    } catch (err) {
      console.error(err);
      setSubmitting(false);
      toast.error('Something went wrong');
    }
  };


  const originalTotal = cart?.totalPrice || 0;
  const discountedTotal = cart?.totalDiscountPrice || cart?.totalPrice || 0;
  const discountAmount = originalTotal - discountedTotal;

  if (cartLoading) {
    return (
      <div className="checkout-page__loading-container">
        <Skeleton variant="circle" width="56px" height="56px" aria-label="Loading checkout" />
        <Skeleton variant="text" width="200px" />
        <Skeleton variant="text" width="160px" />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-page__container">
        {/* Form Section */}
        <CheckoutForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          submitting={submitting}
        />

        {/* Online Payment Section */}
        {form.paymentMethod === 'Online' && createdOrderId && (
          <OnlinePayment
            orderId={createdOrderId}
            amount={discountedTotal}
            user={user}
            submitting={submitting}
            onSuccess={() => {
              setOrderPlaced(true);
              clearCart();
              toast.success('Payment successful! Order placed.');
              navigate('/orders');
            }}
            onFailure={(msg) => {
              toast.error(msg || 'Payment failed or cancelled');
            }}
          />
        )}

        {/* Order Summary Section */}
        <OrderSummary
          cart={cart}
          originalTotal={originalTotal}
          discountedTotal={discountedTotal}
          discountAmount={discountAmount}
        />
      </div>
    </div>
  );
}
