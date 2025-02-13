import dotenv from "dotenv";
dotenv.config();

import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  console.log("Loaded SMTP Credentials:");
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "********" : "Not Set");

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP credentials missing. Check your .env file.");
    throw new Error("SMTP credentials are not defined.");
  }

  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // Must be FALSE for port 587 (TLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const { email, subject, template, data } = options;

  try {
    const templatePath = path.resolve(__dirname, "..", "mails", template);
    const html: string = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: `"BluKites" <${process.env.SMTP_FROM}>`, // Ensure this matches a verified sender
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Activation email sent to:", email);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send email.");
  }
};

export default sendMail;
