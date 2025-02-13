import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import Ratings from "@/app/utils/Ratings";
import { BookOpen, Users, Clock, Tag } from "lucide-react";

type Props = {
  item: any;
  isProfile?: boolean;
};

const PriceTag = ({
  price,
  estimatedPrice,
}: {
  price: number;
  estimatedPrice: number;
}) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center">
      <Tag className="w-4 h-4 text-blue-500" />
      <span className="ml-1 font-semibold text-lg text-black dark:text-white">
        {price === 0 ? "Free" : `$${price}`}
      </span>
      {estimatedPrice > price && (
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
          ${estimatedPrice}
        </span>
      )}
    </div>
  </div>
);

const CourseStats = ({
  lectures,
  students,
}: {
  lectures: number;
  students: number;
}) => (
  <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300 text-sm">
    <div className="flex items-center gap-1">
      <BookOpen className="w-4 h-4" />
      <span>{lectures} Lectures</span>
    </div>
    <div className="flex items-center gap-1">
      <Users className="w-4 h-4" />
      <span>{students} Students</span>
    </div>
  </div>
);

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  const courseUrl = !isProfile
    ? `/course/${item._id}`
    : `course-access/${item._id}`;

  return (
    <Link href={courseUrl}>
      <div className="group relative h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Course Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={item?.thumbnail.url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Course Content */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem]">
            {item.name}
          </h2>

          {/* Rating and Students */}
          <div className="flex items-center justify-between">
            <Ratings rating={item.ratings} />
            {!isProfile && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {item.purchased} enrolled
              </span>
            )}
          </div>

          {/* Course Info */}
          <CourseStats
            lectures={item.courseData?.length || 0}
            students={item.purchased}
          />

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <PriceTag price={item.price} estimatedPrice={item.estimatedPrice} />
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 dark:group-hover:bg-blue-500/10 transition-colors duration-300" />
        </div>

        {/* Progress indicator for profile view */}
        {isProfile && item.progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
