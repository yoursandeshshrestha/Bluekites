"use client";

import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/courseApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/styles";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";

// Define proper types for better type safety
interface Course {
  _id: string;
  name: string;
  categories: string;
  // Add other course properties as needed
}

interface Category {
  _id: string;
  title: string;
}

interface HeroData {
  layout: {
    categories: Category[];
  };
}

const ErrorMessage = ({ message }: { message: string }) => (
  <div
    className="w-full p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
    role="alert"
  >
    {message}
  </div>
);

const CoursesPage = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("title")?.toLowerCase() || "";

  // API queries with proper error handling
  const {
    data: coursesData,
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useGetUsersAllCoursesQuery(undefined, {});

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetHeroDataQuery("Categories", {});

  const [category, setCategory] = useState<string>("All");
  const [headerState, setHeaderState] = useState({
    route: "Login",
    open: false,
  });

  // Memoize filtered courses for better performance
  const filteredCourses = useMemo(() => {
    if (!coursesData?.courses) return [];

    let filtered = coursesData.courses;

    if (category !== "All") {
      filtered = filtered.filter(
        (course: Course) => course.categories === category
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((course: Course) =>
        course.name.toLowerCase().includes(searchQuery)
      );
    }

    return filtered;
  }, [coursesData?.courses, category, searchQuery]);

  // Memoize categories data
  const categories = useMemo(
    () => categoriesData?.layout?.categories || [],
    [categoriesData]
  );

  const CategoryButton = ({
    id,
    title,
    isSelected,
  }: {
    id: string;
    title: string;
    isSelected: boolean;
  }) => (
    <button
      className={`h-[35px] ${
        isSelected ? "bg-[crimson]" : "bg-[#5050cb]"
      } m-3 px-3 rounded-[30px] text-white font-Poppins hover:opacity-90 transition-opacity`}
      onClick={() => setCategory(id)}
    >
      {title}
    </button>
  );

  if (coursesError || categoriesError) {
    return (
      <ErrorMessage message="Failed to load courses. Please try again later." />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        route={headerState.route}
        setRoute={(route) => setHeaderState((prev) => ({ ...prev, route }))}
        open={headerState.open}
        setOpen={(open) => setHeaderState((prev) => ({ ...prev, open }))}
        activeItem={1}
      />

      <main className="flex-grow w-[96%] 800px:w-[85%] mx-auto mt-[100px]">
        <Heading
          title="All Courses - ELearning"
          description="ELearning is a programming community"
          keywords="Programming community, coding skills, expert insights, collaboration, growth"
        />

        {/* Categories filter */}
        <div className="w-full flex items-center flex-wrap mt-8">
          <CategoryButton
            id="All"
            title="All"
            isSelected={category === "All"}
          />
          {categories.map((item: Category) => (
            <CategoryButton
              key={item._id}
              id={item._id}
              title={item.title}
              isSelected={category === item._id}
            />
          ))}
        </div>

        {/* Loading state */}
        {(isCoursesLoading || isCategoriesLoading) && <Loader />}

        {/* Empty state */}
        {!isCoursesLoading && filteredCourses.length === 0 && (
          <p
            className={`${styles.label} justify-center min-h-[50vh] flex items-center`}
          >
            {searchQuery
              ? "No courses found matching your search"
              : "No courses found in this category. Please try another one!"}
          </p>
        )}

        {/* Courses grid */}
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] my-12">
          {filteredCourses.map((course: Course) => (
            <CourseCard key={course._id} item={course} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CoursesPage;
