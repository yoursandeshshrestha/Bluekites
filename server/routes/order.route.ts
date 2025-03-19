import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createOrder,
  getAllOrders,
  createRazorpayOrder,
  sendRazorpayKeyId,
  verifyRazorpayPayment,
} from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrder);
orderRouter.get(
  "/get-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

// Razorpay routes
orderRouter.get("/payment/razorpay-key", sendRazorpayKeyId);
orderRouter.post(
  "/payment/create-razorpay-order",
  isAuthenticated,
  createRazorpayOrder
);
orderRouter.post("/payment/verify", isAuthenticated, verifyRazorpayPayment);

export default orderRouter;
