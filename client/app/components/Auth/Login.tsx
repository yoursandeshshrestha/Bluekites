import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  refetch?: () => void;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Login: FC<Props> = ({ setRoute, setOpen, refetch }) => {
  const [show, setShow] = useState(false);
  const [login, { isSuccess, error }] = useLoginMutation();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      try {
        const response = await login({ email, password }).unwrap();
        if (response.token) {
          toast.success("Login successful!");
          await new Promise((resolve) => setTimeout(resolve, 300));
          window.location.href = window.location.pathname;
        }
      } catch (err) {
        console.error("Login error:", err);
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successful!");
      setOpen(false);
      if (refetch) {
        refetch();
      }
      window.location.href = window.location.pathname;
    }
    if (error) {
      if ("data" in error) {
        toast.error((error as any).data.message);
      }
    }
  }, [isSuccess, error, refetch]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Please sign in to your account
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full px-3 py-2 border rounded-md shadow-sm 
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${
                errors.email && touched.email
                  ? "border-red-500 focus:ring-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
          />
          {errors.email && touched.email && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-3 py-2 border rounded-md shadow-sm 
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${
                  errors.password && touched.password
                    ? "border-red-500 focus:ring-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-500 
                dark:text-gray-500 dark:hover:text-gray-400"
            >
              {show ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && touched.password && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white 
            bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
            rounded-md transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          Sign in
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => setRoute("Sign-Up")}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 
              dark:hover:text-blue-300 font-medium transition-colors duration-200"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
