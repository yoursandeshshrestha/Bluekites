import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import avatarIcon from "../../../public/assets/avatar.jpg";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user?.name || "");
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: updateError }] =
    useEditProfileMutation();
  const [loadUser, setLoadUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {} = useLoadUserQuery(undefined, { skip: !loadUser });

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        updateAvatar(fileReader.result);
      }
    };
    fileReader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isSuccess || success) {
      setLoadUser(true);
      setIsLoading(false);
    }
    if (error || updateError) {
      console.log(error);
      setIsLoading(false);
    }
    if (success) {
      toast.success("Profile updated successfully");
    }
  }, [isSuccess, error, success, updateError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() !== "") {
      setIsLoading(true);
      await editProfile({ name: name.trim() });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-blue-500 dark:border-blue-400 p-1">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={user.avatar?.url || avatar || avatarIcon}
                alt={user.name || "Profile"}
                fill
                className="object-cover"
                sizes="(max-width: 128px) 100vw, 128px"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png, image/jpg, image/jpeg, image/webp"
            disabled={isLoading}
          />
          <label
            htmlFor="avatar"
            className="absolute bottom-0 right-0 p-2 bg-blue-500 dark:bg-blue-600 
                            rounded-full cursor-pointer transform translate-x-1/4 
                            hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="w-5 h-5 text-white" />
          </label>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border 
                                bg-white dark:bg-gray-800
                                text-gray-900 dark:text-white
                                border-gray-300 dark:border-gray-600
                                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                focus:border-transparent dark:focus:border-transparent
                                placeholder-gray-400 dark:placeholder-gray-500"
              required
              disabled={isLoading}
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={user?.email}
              className="w-full px-4 py-2.5 rounded-lg border 
                                bg-gray-50 dark:bg-gray-700
                                text-gray-900 dark:text-white
                                border-gray-300 dark:border-gray-600
                                cursor-not-allowed opacity-75"
              readOnly
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 text-sm font-medium text-white 
                        bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                        rounded-lg transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-blue-500 dark:focus:ring-offset-gray-800
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileInfo;
