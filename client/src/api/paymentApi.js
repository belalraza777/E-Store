import axiosInstance from "./axios";

// Create Razorpay order (expects only orderId in body)
export const createRazorpayOrder = async (orderId) => {
  try {
    const response = await axiosInstance.post("/payments/create-order", { orderId });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create Razorpay order"
    };
  }
};

// Verify Razorpay payment (expects payment details and orderId)
export const verifyRazorpayPayment = async (paymentDetails) => {
  try {
    const response = await axiosInstance.post("/payments/verify", paymentDetails);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to verify payment"
    };
  }
};
