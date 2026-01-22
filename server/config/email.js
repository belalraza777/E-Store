import FormData from "form-data";
import Mailgun from "mailgun.js";
import dotenv from "dotenv";

dotenv.config();

const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env;

if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    process.exit(1);
}

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
    username: "api",
    key: MAILGUN_API_KEY,
    // If using EU domain:
    // url: "https://api.eu.mailgun.net"
});

// ------- Send Email Notification -------
export const sendEmail = async (to, subject, text, from = "E-Store <no-reply@estore.com>") => {
    try {
        const data = await mg.messages.create(MAILGUN_DOMAIN, {
            from,
            to,
            subject,
            text,
        });
        return data;
    } catch (error) {
        throw new Error(`Failed to send email: ${error.message || error}`);
    }
};