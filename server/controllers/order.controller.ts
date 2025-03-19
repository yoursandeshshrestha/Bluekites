import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel, { ICourse } from "../models/course.model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import sendMail from "../utils/sendMail";
import path from "path";
import ejs from "ejs";
import NotificationModel from "../models/notification.model";
import { redis } from "../utils/redis";
require("dotenv").config();
// import crypto from "crypto";
const Razorpay = require("razorpay");

// Check for Razorpay configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error(
    "WARNING: Razorpay credentials not found in environment variables!"
  );
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID || "",
  key_secret: RAZORPAY_KEY_SECRET || "",
});

// create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      // Verify Razorpay payment
      if (payment_info) {
        if (
          "razorpay_payment_id" in payment_info &&
          "razorpay_order_id" in payment_info &&
          "razorpay_signature" in payment_info
        ) {
          // Get key secret
          const keySecret = process.env.RAZORPAY_KEY_SECRET;
          if (!keySecret) {
            return next(
              new ErrorHandler("Payment service configuration error", 500)
            );
          }

          // Verify the payment signature
          const generated_signature = crypto
            .createHmac("sha256", keySecret)
            .update(
              payment_info.razorpay_order_id +
                "|" +
                payment_info.razorpay_payment_id
            )
            .digest("hex");

          if (generated_signature !== payment_info.razorpay_signature) {
            return next(new ErrorHandler("Payment verification failed!", 400));
          }
        } else {
          return next(new ErrorHandler("Payment information incomplete", 400));
        }
      }

      const user = await userModel.findById(req.user?._id);

      const courseExistsInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistsInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const course: ICourse | null = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.courses.push(course?._id);

      await redis.set(req.user?._id, JSON.stringify(user));

      await user?.save();

      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
      });

      course.purchased += 1;

      await course.save();

      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all orders --- only for admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// send Razorpay key id
export const sendRazorpayKeyId = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  }
);

// create Razorpay order
export const createRazorpayOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        amount,
        currency = "INR",
        receipt = "receipt_order_" + Date.now(),
      } = req.body;

      // Check if amount is already in paise
      // If amount is less than 100, assume it's already in rupees and convert to paise
      const amountInPaise = amount < 100 ? Math.round(amount * 100) : amount;

      const options = {
        amount: amountInPaise,
        currency,
        receipt,
        payment_capture: 1, // Auto-capture enabled
      };

      console.log("Creating Razorpay order with options:", options);
      const order = await razorpay.orders.create(options);
      console.log("Razorpay order created:", order);

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error: any) {
      console.error("Razorpay order creation failed:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Import crypto for signature verification
import crypto from "crypto";

// Verify Razorpay payment
export const verifyRazorpayPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      // Validate required params
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return next(
          new ErrorHandler(
            "Missing required payment verification parameters",
            400
          )
        );
      }

      // Validate that RAZORPAY_KEY_SECRET is available
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        console.error(
          "RAZORPAY_KEY_SECRET is not defined in environment variables"
        );
        return next(
          new ErrorHandler("Payment service configuration error", 500)
        );
      }

      console.log("Verifying payment with details:", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      // Generate signature for verification
      const generated_signature = crypto
        .createHmac("sha256", keySecret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      console.log("Generated signature:", generated_signature);
      console.log("Received signature:", razorpay_signature);

      if (generated_signature === razorpay_signature) {
        // Fetch payment details from Razorpay for double validation
        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        if (payment.status === "captured") {
          console.log("Payment verified successfully:", payment);
          res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            payment: {
              id: payment.id,
              amount: payment.amount,
              status: payment.status,
            },
          });
        } else {
          console.error("Payment not captured:", payment);
          return next(
            new ErrorHandler(
              `Payment not captured. Status: ${payment.status}`,
              400
            )
          );
        }
      } else {
        console.error("Signature verification failed");
        return next(
          new ErrorHandler("Payment signature verification failed", 400)
        );
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
