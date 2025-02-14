"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail = async (options) => {
    console.log("Loaded SMTP Credentials:");
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS:", process.env.SMTP_PASS ? "********" : "Not Set");
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("❌ SMTP credentials missing. Check your .env file.");
        throw new Error("SMTP credentials are not defined.");
    }
    const transporter = nodemailer_1.default.createTransport({
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
        const templatePath = path_1.default.resolve(__dirname, "..", "mails", template);
        const html = await ejs_1.default.renderFile(templatePath, data);
        const mailOptions = {
            from: `"BluKites" <${process.env.SMTP_FROM}>`, // Ensure this matches a verified sender
            to: email,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions);
        console.log("✅ Activation email sent to:", email);
    }
    catch (error) {
        console.error("❌ Email sending failed:", error);
        throw new Error("Failed to send email.");
    }
};
exports.default = sendMail;
