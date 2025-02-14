"use client";
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBarProfile from "./SideBarProfile";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/courseApi";
import CourseCard from "../Course/CourseCard";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const router = useRouter();
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [logout, setLogout] = useState(false);
  const [courses, setCourses] = useState([]);
  const [active, setActive] = useState(1);

  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const {} = useLogoutQuery(undefined, { skip: !logout });

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 85);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (data) {
      const filteredCourses = user.courses
        .map((userCourse: any) =>
          data.courses.find((course: any) => course._id === userCourse._id)
        )
        .filter((course: any) => course !== undefined);
      setCourses(filteredCourses);
    }
  }, [data, user.courses]);

  const logoutHandler = async () => {
    try {
      setLogout(true);
      await signOut({ redirect: false });
      router.push("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderContent = () => {
    switch (active) {
      case 1:
        return (
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <ProfileInfo avatar={avatar} user={user} />
          </div>
        );
      case 2:
        return (
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <ChangePassword />
          </div>
        );
      case 3:
        return (
          <div className="w-full p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((item: any, index: number) => (
                <CourseCard item={item} key={index} isProfile={true} />
              ))}
            </div>
            {courses.length === 0 && (
              <div className="text-center py-8">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                  No Courses Found
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  You haven't enrolled in any courses yet.
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-[150px]">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div
            className={`sticky ${
              scroll ? "top-24" : "top-8"
            } transition-all duration-200`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <SideBarProfile
                user={user}
                active={active}
                avatar={avatar}
                setActive={setActive}
                logoutHandler={logoutHandler}
              />
            </div>
          </div>
        </aside>
        <main className="flex-1">
          <div className="transition-all duration-200 ease-in-out">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
