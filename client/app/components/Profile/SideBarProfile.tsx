import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UserCircle,
  KeyRound,
  BookOpen,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import avatarDefault from "../../../public/assets/avatar.jpg";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: () => void;
};

const SideBarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logoutHandler,
}) => {
  const menuItems = [
    {
      id: 1,
      label: "My Account",
      icon: UserCircle,
      onClick: () => setActive(1),
    },
    {
      id: 2,
      label: "Change Password",
      icon: KeyRound,
      onClick: () => setActive(2),
    },
    {
      id: 3,
      label: "Enrolled Courses",
      icon: BookOpen,
      onClick: () => setActive(3),
    },
    ...(user.role === "admin"
      ? [
          {
            id: 6,
            label: "Admin Dashboard",
            icon: ShieldCheck,
            isLink: true,
            href: "/admin",
          },
        ]
      : []),
    {
      id: 4,
      label: "Logout",
      icon: LogOut,
      onClick: logoutHandler,
    },
  ];

  const renderMenuItem = (item: any) => {
    const className = `w-full flex items-center gap-3 px-4 py-3 rounded-lg
      transition-colors duration-200
      ${
        active === item.id
          ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`;

    if (item.isLink) {
      return (
        <Link href={item.href} className={className}>
          <item.icon className="w-5 h-5" />
          <span className="font-medium">{item.label}</span>
        </Link>
      );
    }

    return (
      <button onClick={item.onClick} className={className}>
        <item.icon className="w-5 h-5" />
        <span className="font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 px-4">
        <div className="relative w-12 h-12">
          <Image
            src={user.avatar?.url || avatar || avatarDefault}
            alt={user.name || "User"}
            className="rounded-full object-cover"
            fill
            sizes="48px"
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.role}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>{renderMenuItem(item)}</div>
        ))}
      </div>
    </div>
  );
};

export default SideBarProfile;
