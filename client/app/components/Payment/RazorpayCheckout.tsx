import { styles } from "@/app/styles/styles";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import {
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
} from "@/redux/features/orders/ordersApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  setOpen: (open: boolean) => void;
  data: any;
  user: any;
  razorpayKeyId: string;
};

const RazorpayCheckout = ({ setOpen, data, user, razorpayKeyId }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery({ skip: loadUser ? false : true });

  const [
    createRazorpayOrder,
    { data: razorpayOrderData, error: razorpayOrderError },
  ] = useCreateRazorpayOrderMutation();
  const [verifyPayment, { data: verifyData, error: verifyError }] =
    useVerifyPaymentMutation();
  const [createOrder, { data: orderData, error: orderError }] =
    useCreateOrderMutation();

  useEffect(() => {
    if (razorpayOrderError) {
      if ("data" in razorpayOrderError) {
        const errorMessage = razorpayOrderError as any;
        toast.error(errorMessage.data.message);
      }
      setIsLoading(false);
    }

    if (verifyError) {
      if ("data" in verifyError) {
        const errorMessage = verifyError as any;
        toast.error(errorMessage.data.message);
      }
      setIsLoading(false);
    }

    if (orderError) {
      if ("data" in orderError) {
        const errorMessage = orderError as any;
        toast.error(errorMessage.data.message);
      }
      setIsLoading(false);
    }
  }, [razorpayOrderError, verifyError, orderError]);

  useEffect(() => {
    if (orderData) {
      setLoadUser(true);
      socketId.emit("notification", {
        title: "New Order",
        message: `You have a new order from ${data.name}`,
        userId: user._id,
      });
      setIsLoading(false);
      toast.success("Course purchased successfully!");
      router.push(`/course-access/${data._id}`);
    }
  }, [orderData, data._id, data.name, user._id, router]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Step 1: Create Razorpay order
      // Ensure amount is in paise (multiply by 100)
      const amount = Math.round(data.price * 100);
      await createRazorpayOrder({
        amount: amount,
        currency: "INR",
        receipt: `course_purchase_${data._id}`,
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Payment initialization failed");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (razorpayOrderData?.order) {
      // Step 2: Open Razorpay payment modal
      const options = {
        key: razorpayKeyId,
        amount: razorpayOrderData.order.amount,
        currency: razorpayOrderData.order.currency,
        name: "E-Learning Platform",
        description: `Purchase of ${data.name}`,
        order_id: razorpayOrderData.order.id,
        handler: async function (response: any) {
          try {
            // Step 3: Verify payment
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Step 4: Create course order
            await createOrder({
              courseId: data._id,
              payment_info: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed");
            setIsLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "", // Add phone if available
        },
        notes: {
          courseId: data._id,
          courseName: data.name,
        },
        theme: {
          color: "#3399cc",
        },
        // Display configuration - prioritizing UPI
        config: {
          display: {
            // Reordering payment methods to prioritize UPI which works
            blocks: {
              banks: {
                name: "Pay via UPI",
                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
              cards: {
                name: "Pay via Card",
                instruments: [
                  {
                    method: "card",
                  },
                ],
              },
              other: {
                name: "Other Payment Methods",
                instruments: [
                  {
                    method: "netbanking",
                  },
                  {
                    method: "wallet",
                  },
                ],
              },
            },
            sequence: ["block.banks", "block.cards", "block.other"],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
        // Enable better error messages
        retry: {
          enabled: false,
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
          confirm_close: true,
          escape: false,
        },
      };

      // Load Razorpay script dynamically
      const loadRazorpay = () => {
        return new Promise((resolve, reject) => {
          // Check if Razorpay is already loaded
          if ((window as any).Razorpay) {
            resolve(true);
            return;
          }

          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => {
            console.error("Failed to load Razorpay SDK");
            toast.error("Failed to load payment gateway");
            setIsLoading(false);
            reject(new Error("Failed to load Razorpay SDK"));
          };
          document.body.appendChild(script);
        });
      };

      const openRazorpayCheckout = async () => {
        try {
          await loadRazorpay();
          console.log(
            "Razorpay SDK loaded, initializing with options:",
            options
          );
          const rzp = new (window as any).Razorpay(options);

          // Add detailed error handling for payment failures
          rzp.on("payment.failed", function (response: any) {
            console.error("Payment failed details:", response);
            const { error } = response;
            let errorMessage = "Payment failed";

            if (error) {
              if (error.description) {
                errorMessage += `: ${error.description}`;
              }

              // For card errors, provide more helpful messages
              if (
                error.source === "card" &&
                error.step === "payment_authentication"
              ) {
                errorMessage =
                  "Card authentication failed. Please try using UPI payment option instead.";
              } else if (error.source === "card") {
                errorMessage = `Card payment failed: ${
                  error.reason || error.description || "Unknown card error"
                }. Try UPI payment.`;
              }

              // Output detailed error information for debugging
              console.log("Error Code:", error.code);
              console.log("Error Description:", error.description);
              console.log("Error Source:", error.source);
              console.log("Error Step:", error.step);
              console.log("Error Reason:", error.reason);
            }

            toast.error(errorMessage);
            setIsLoading(false);
          });

          rzp.open();
        } catch (error) {
          console.error("Error in Razorpay checkout:", error);
          toast.error("Payment gateway initialization failed");
          setIsLoading(false);
        }
      };

      openRazorpayCheckout();
    }
  }, [
    razorpayOrderData,
    razorpayKeyId,
    data._id,
    data.name,
    user?.name,
    user?.email,
    createOrder,
    verifyPayment,
  ]);

  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Complete Your Purchase
      </h2>

      {/* Course and price info - styled to match your footer */}
      <div className="bg-white dark:bg-gray-800/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
          {data.name}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(data.price)}
        </p>
      </div>

      {/* Payment notice - styled to match your footer's color scheme */}
      <div className="bg-blue-50 dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Payment Information
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              For fastest checkout, please use UPI payment. Card payments may
              experience issues due to security settings.
            </p>
          </div>
        </div>
      </div>

      {/* Payment button - using your site's blue color scheme */}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`${styles.button} w-full py-3 !h-[50px] text-base font-medium flex items-center justify-center`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            Proceed to Payment
            <svg
              className="ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        )}
      </button>

      {/* Footer information - styled to match your footer's color scheme */}
      <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
        <svg
          className="w-5 h-5 text-blue-500 mr-2"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        UPI payments process instantly with no extra fees
      </div>
    </div>
  );
};

export default RazorpayCheckout;
