import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { Menu, X, User } from "lucide-react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import {
  useLogoutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/ٍSignUp";
import Verification from "./Auth/Verification";
import avatar from "../../public/assets/avatar.jpg";
import toast from "react-hot-toast";

import Logo from "@/public/assets/logo.png";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const UserProfile: FC<{ userData: any; activeItem: number }> = ({
  userData,
  activeItem,
}) => (
  <Link href="/profile">
    <div className="relative w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
      <Image
        src={userData?.user?.avatar ? userData.user.avatar.url : avatar}
        alt="Profile"
        fill
        className="object-cover"
        style={{
          border: activeItem === 5 ? "2px solid #37a39a" : "none",
        }}
      />
    </div>
  </Link>
);

const MobileSidebar: FC<{
  open: boolean;
  onClose: () => void;
  userData: any;
  activeItem: number;
  setOpen: (open: boolean) => void;
}> = ({ open, onClose, userData, activeItem, setOpen }) => (
  <div
    className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${
      open ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
    onClick={onClose}
  >
    <div
      className={`fixed right-0 top-0 h-screen w-[300px] bg-white dark:bg-gray-900 shadow-xl 
                 transform transition-transform duration-300 ease-in-out
                 ${open ? "translate-x-0" : "translate-x-full"}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 flex justify-end">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>
      <div className="px-4">
        <NavItems activeItem={activeItem} isMobile={true} />
        {userData ? (
          <UserProfile userData={userData} activeItem={activeItem} />
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <User className="w-5 h-5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
      <div className="absolute bottom-4 left-4 text-sm text-gray-500 dark:text-gray-400">
        Copyright © {new Date().getFullYear()} Bluekites
      </div>
    </div>
  </div>
);

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);
  const {
    data: userData,
    isLoading,
    refetch,
  } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useLogoutQuery(undefined, { skip: !logout });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoading && !userData && session?.user) {
      socialAuth({
        email: session.user.email,
        name: session.user.name,
        avatar: session.user.image,
      });
      refetch();
    }
    if (session === null && !isLoading && !userData) {
      setLogout(true);
    }
  }, [session, userData, isLoading]);

  return (
    <div className="w-full relative">
      <header
        className={`fixed top-0 left-0 w-full h-20 z-50 transition-all duration-300
                   ${
                     isScrolled
                       ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg"
                       : "bg-white dark:bg-gray-900"
                   }
                   border-b border-gray-200 dark:border-gray-800`}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-semibold text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <Image
              src={Logo}
              alt="Logo"
              className="w-[300px] h-[150px] object-cover"
            />
          </Link>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <NavItems activeItem={activeItem} isMobile={false} />
            </div>

            <ThemeSwitcher />

            <div className="md:hidden">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <div className="hidden md:block">
              {userData ? (
                <UserProfile userData={userData} activeItem={activeItem} />
              ) : (
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userData={userData}
        activeItem={activeItem}
        setOpen={setOpen}
      />

      {/* Auth Modals */}
      {route === "Login" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Login}
          refetch={refetch}
        />
      )}

      {route === "Sign-Up" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={SignUp}
        />
      )}

      {route === "Verification" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Verification}
        />
      )}
    </div>
  );
};

export default Header;
