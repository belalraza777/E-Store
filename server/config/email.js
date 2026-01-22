import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";


const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.error("Missing Gmail credentials");
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

// ------- Send Email Notification -------
export const sendEmail = async (
  to,
  subject,
  text,
  from = `E-Store <${GMAIL_USER}>`
) => {
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
    });

    return info;
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
