
import { sendEmail } from "./config/email.js";

(async () => {
  try {
    const result = await sendEmail(
      "your@email.com", // <-- Replace with your email to test
      "Test Email from E-Store",
      "This is a test email sent from the E-Store backend using Nodemailer."
    );
    console.log("Email sent!", result);
  } catch (err) {
    console.error("Email failed:", err.message);
  }
})();
