"use client";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/courseApi";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "../Course/CourseCard";
import Loader from "../Loader";

type Props = {};

const Courses = (props: Props) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    setCourses(data?.courses);
  }, [data]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) return <Loader />;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />

      <div className="relative container mx-auto px-4 py-20">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16 space-y-4"
        >
          <h1 className="font-Poppins text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Expand Your Career{" "}
            <span className="text-[#39c1f3]">Opportunity</span>
            <br />
            <span className="relative">
              With Our Courses
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#39c1f3]" />
            </span>
          </h1>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8"
        >
          {courses?.map((item: any, index: number) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="transform hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="h-full">
                <CourseCard item={item} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {(!courses || courses.length === 0) && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No courses available at the moment.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;
