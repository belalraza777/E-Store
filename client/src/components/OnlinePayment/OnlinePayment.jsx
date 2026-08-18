import React, { useEffect, useRef, useState } from "react";
import {
  createRazorpayOrder,
  markRazorpayPaymentFailed,
  verifyRazorpayPayment,
} from "../../api/paymentApi.js";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

// OnlinePayment component handles the Razorpay payment flow
const OnlinePayment = ({
  orderId,
  user,
  onSuccess,
  onFailure,
  submitting,
}) => {
  const [error, setError] = useState("");

  // Prevent Razorpay from being initialized more than once
  const paymentStartedRef = useRef(false);

  // Prevent payment failure from being handled more than once
  const paymentHandledRef = useRef(false);

  //All the logic for handling Razorpay payment is inside useEffect to ensure it runs only when orderId is available and not submitting.
  useEffect(() => {
    if (!orderId || submitting || paymentStartedRef.current) {
      return;
    }

    paymentStartedRef.current = true;

    // Handle payment failure and mark it in backend
    const handlePaymentFailure = async (reason) => {
      // Prevent duplicate failure handling
      if (paymentHandledRef.current) {
        return;
      }

      paymentHandledRef.current = true;

      try {
        await markRazorpayPaymentFailed(orderId, reason);
      } catch (err) {
        console.error(
          "Failed to mark payment as failed:",
          err
        );
      }

      onFailure?.(reason);
    };

    // Open Razorpay payment modal
    const openRazorpay = async () => {
      setError("");

      // 1. Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setError(
          "Failed to load Razorpay SDK. Please try again."
        );

        await handlePaymentFailure("Razorpay SDK failed");
        return;
      }

      try {
        // 2. Create Razorpay order from backend
        const res = await createRazorpayOrder(orderId);

        if (!res.success || !res.data?.razorpayOrder) {
          const message =
            res.message || "Failed to create Razorpay order";

          setError(message);
          await handlePaymentFailure(message);
          return;
        }

        const { razorpayOrder } = res.data;

        // 3. Configure Razorpay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "E-Store",
          description: "Order Payment",
          order_id: razorpayOrder.id,

          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: user?.phone || "",
          },

          theme: {
            color: "#6366f1",
          },

          // 4. Payment successful
          handler: async function (response) {
            try {
              const verifyRes =
                await verifyRazorpayPayment({
                  razorpay_order_id:
                    response.razorpay_order_id,
                  razorpay_payment_id:
                    response.razorpay_payment_id,
                  razorpay_signature:
                    response.razorpay_signature,
                  orderId,
                });

              if (verifyRes.success) {
                // Mark as handled so failure callbacks
                // cannot run after successful verification.
                paymentHandledRef.current = true;

                onSuccess?.(verifyRes.data);
              } else {
                const message =
                  verifyRes.message ||
                  "Payment verification failed";

                setError(message);
                await handlePaymentFailure(message);
              }
            } catch (err) {
              console.error(
                "Payment verification error:",
                err
              );

              setError("Payment verification failed");

              await handlePaymentFailure(
                "Payment verification failed"
              );
            }
          },

          // 5. User closes Razorpay
          modal: {
            ondismiss: () => {
              handlePaymentFailure(
                "Payment cancelled by user"
              );
            },
          },
        };

        // 6. Open Razorpay
        const rzp = new window.Razorpay(options);

        // 7. Razorpay reports payment failure
        rzp.on("payment.failed", () => {
          handlePaymentFailure("Payment failed");
        });

        rzp.open();
      } catch (err) {
        console.error("Razorpay error:", err);

        setError(
          "Something went wrong during payment"
        );

        await handlePaymentFailure("Payment failed");
      }
    };

    openRazorpay();
  }, [orderId, submitting]);

  return error ? (
    <div className="payment-error">
      {error}
    </div>
  ) : null;
};

export default OnlinePayment;