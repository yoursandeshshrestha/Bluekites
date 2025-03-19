import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (type) => ({
        url: `get-orders`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Replace Stripe with Razorpay endpoints
    getRazorpayKey: builder.query({
      query: () => ({
        url: `payment/razorpay-key`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    createRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: `payment/create-razorpay-order`,
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    verifyPayment: builder.mutation({
      query: (data) => ({
        url: `payment/verify`,
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    createOrder: builder.mutation({
      query: ({ courseId, payment_info }) => ({
        url: `create-order`,
        method: "POST",
        body: {
          courseId,
          payment_info,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetRazorpayKeyQuery,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
  useCreateOrderMutation,
} = orderApi;
