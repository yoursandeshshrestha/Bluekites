import React, { FC, useEffect, useRef, useState } from "react";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { useSelector } from "react-redux";

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully");
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
        setInvalidError(true);
      } else {
        console.log("An error occurred:", error);
      }
    }
  }, [isSuccess, error]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    });
  };

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    const sanitizedValue = value.slice(-1);

    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: sanitizedValue };
    setVerifyNumber(newVerifyNumber);

    if (sanitizedValue === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (sanitizedValue.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Verify your Account
        </h1>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Please enter the verification code sent to your email
        </p>

        {/* OTP Input Fields */}
        <div className="flex gap-3 justify-center my-8">
          {Object.keys(verifyNumber).map((key, index) => (
            <input
              key={key}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={verifyNumber[key as keyof VerifyNumber]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className={`w-16 h-16 text-center text-2xl font-semibold 
                bg-white dark:bg-gray-800 
                rounded-lg border-2 outline-none transition-all duration-200
                ${
                  invalidError
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }
                focus:border-blue-500 dark:focus:border-blue-400
                focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
                text-gray-900 dark:text-white`}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={verificationHandler}
          className="w-full py-3 px-4 text-sm font-medium text-white 
            bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
            rounded-lg transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify OTP
        </button>

        {/* Sign In Link */}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Go back to sign in?{" "}
          <button
            onClick={() => setRoute("Login")}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 
              font-medium transition-colors duration-200"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Verification;
