import React, { useEffect, useState } from "react";
import { createRazorpayOrder, verifyRazorpayPayment } from "../../api/paymentApi.js";

// Load Razorpay script 
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const OnlinePayment = ({ orderId, user, onSuccess, onFailure, submitting, amount }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    const openRazorpay = async () => {
      setError("");

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load Razorpay SDK. Please try again.");
        onFailure && onFailure("Razorpay SDK failed");
        return;
      }

      try {
        // 1️⃣ Create Razorpay order from backend
        const res = await createRazorpayOrder(orderId);
        if (!res.success || !res.data?.razorpayOrder) {
          setError(res.message || "Failed to create Razorpay order");
          onFailure && onFailure(res.message || "Failed to create Razorpay order");
          return;
        }

        const { razorpayOrder } = res.data;

        // 2️⃣ Configure Razorpay options
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "E-Store",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.phone || "",
          },
          theme: { color: "#6366f1" },
          handler: async function (response) {
            // 3️⃣ Verify payment
            const verifyRes = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });

            if (verifyRes.success) {
              onSuccess && onSuccess(verifyRes.data);
            } else {
              setError(verifyRes.message || "Payment verification failed");
              onFailure && onFailure(verifyRes.message);
            }
          },
          modal: {
            ondismiss: () => {
              onFailure && onFailure("Payment cancelled by user");
            },
          },
        };

        // 4️⃣ Open Razorpay checkout
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error(err);
        setError("Something went wrong during payment");
        onFailure && onFailure("Payment failed");
      }
    };

    if (!submitting) openRazorpay();
  }, [orderId, user, onSuccess, onFailure, submitting]);

  return error ? <div className="payment-error">{error}</div> : null;
};

export default OnlinePayment;
