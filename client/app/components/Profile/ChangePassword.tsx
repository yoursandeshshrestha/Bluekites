import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

  const passwordChangeHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmPassword !== newPassword) {
      toast.error("Passwords do not match");
    } else {
      await updatePassword({ oldPassword, newPassword });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password changed successfully");
      // Clear form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  const InputField = ({
    label,
    value,
    onChange,
    showPassword,
    togglePassword,
  }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showPassword: boolean;
    togglePassword: () => void;
  }) => (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2.5 rounded-lg border 
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            border-gray-300 dark:border-gray-600
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            focus:border-transparent dark:focus:border-transparent
            placeholder-gray-400 dark:placeholder-gray-500"
          required
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 
            text-gray-400 hover:text-gray-500 
            dark:text-gray-500 dark:hover:text-gray-400"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Change Password
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Please enter your old password and choose a new one
        </p>
      </div>

      <form onSubmit={passwordChangeHandler} className="space-y-6">
        <InputField
          label="Current Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          showPassword={showOldPassword}
          togglePassword={() => setShowOldPassword(!showOldPassword)}
        />

        <InputField
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          showPassword={showNewPassword}
          togglePassword={() => setShowNewPassword(!showNewPassword)}
        />

        <InputField
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPassword={showConfirmPassword}
          togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <button
          type="submit"
          className="w-full px-4 py-2.5 text-sm font-medium text-white 
            bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
            rounded-lg transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
