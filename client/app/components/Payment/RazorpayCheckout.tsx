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
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
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

  // Handle free course enrollment directly
  const handleFreeCourseEnrollment = async () => {
    try {
      setIsLoading(true);

      // Create a direct order without payment info
      await createOrder({
        courseId: data._id,
        payment_info: {
          type: "free",
          status: "succeeded",
        },
      });
    } catch (error) {
      console.error("Error enrolling in free course:", error);
      toast.error("Enrollment failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      // If course is free, process without Razorpay
      if (data.price === 0) {
        handleFreeCourseEnrollment();
        return;
      }

      setIsLoading(true);

      // Step 1: Create Razorpay order for paid courses
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
      // Only process for paid courses
      if (data.price > 0) {
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
            contact: user?.phone || "",
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
    }
  }, [
    razorpayOrderData,
    razorpayKeyId,
    data,
    user,
    createOrder,
    verifyPayment,
  ]);

  // Modified UI to account for free courses
  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-semibold text-black dark:text-white">
        Complete Your Purchase
      </h2>

      {/* Course and price info - styled to match the CourseDetails component */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
          {data.name}
        </p>
        <p className="text-3xl font-bold text-black dark:text-white mt-2">
          {data.price === 0
            ? "Free"
            : new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(data.price)}
        </p>
      </div>

      {/* Different messaging for free vs. paid courses */}
      {data.price > 0 ? (
        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
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
              <h3 className="text-sm font-medium text-black dark:text-white">
                Payment Information
              </h3>
              <p className="mt-1 text-sm text-black dark:text-white">
                For fastest checkout, please use UPI payment. Card payments may
                experience issues due to security settings.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 text-left">
              <h3 className="text-sm font-medium text-black dark:text-white">
                Free Course
              </h3>
              <p className="mt-1 text-sm text-black dark:text-white">
                This course is available at no cost. Click the button below to
                complete your enrollment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Button text changes based on free vs paid course */}
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
            {data.price === 0 ? "Enroll Now - Free" : "Proceed to Payment"}
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

      {/* Footer information */}
      <div className="flex items-center justify-center gap-2 text-sm text-black dark:text-white">
        <IoMdCheckmarkCircleOutline className="text-green-500" />
        {data.price === 0
          ? "Get instant access to all course materials"
          : "UPI payments process instantly with no extra fees"}
      </div>
    </div>
  );
};

export default RazorpayCheckout;
