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
  const {} = useLogoutQuery(undefined, {
    skip: !logout,
  });

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 85);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle course data
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
      window.location.reload(); // Force reload the page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderContent = () => {
    switch (active) {
      case 1:
        return (
          <div className="w-full h-full bg-transparent mt-[80px]">
            <ProfileInfo avatar={avatar} user={user} />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full bg-transparent mt-[80px]">
            <ChangePassword />
          </div>
        );
      case 3:
        return (
          <div className="w-full pl-7 px-2 800px:px-10 mt-[80px] 800px:pl-8">
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-3 xl:gap-[35px]">
              {courses.map((item: any, index: number) => (
                <CourseCard item={item} key={index} isProfile={true} />
              ))}
            </div>
            {courses.length === 0 && (
              <h1 className="text-center text-[18px] font-Poppins">
                You don&apos;t have any purchased courses!
              </h1>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-white bg-opacity-90 border dark:border-[#ffffff1d] border-[#00000014] rounded-[5px] shadow-sm dark:shadow-sm mt-[80px] mb-[80px] sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logoutHandler={logoutHandler}
        />
      </div>
      {renderContent()}
    </div>
  );
};

export default Profile;
