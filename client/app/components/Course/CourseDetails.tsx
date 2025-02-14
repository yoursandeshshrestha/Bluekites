import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "timeago.js";
import { Elements } from "@stripe/react-stripe-js";
import {
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from "react-icons/io";
import { VscVerifiedFilled } from "react-icons/vsc";
import { Stripe } from "@stripe/stripe-js";

import { styles } from "@/app/styles/styles";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import ContentCourseList from "./ContentCourseList";
import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import defaultImage from "../../../public/assets/avatar.jpg";

// Define all necessary interfaces
interface UserCourse {
  _id: string;
  // Add other course properties as needed
}

interface User {
  _id: string;
  name: string;
  avatar?: {
    url: string;
  };
  role?: string;
  courses?: UserCourse[];
}

interface Review {
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
  commentReplies: Array<{
    user: User;
    comment: string;
    createdAt: string;
  }>;
}

interface CourseLink {
  title: string;
  url: string;
  _id: string;
}

interface CourseData {
  videoUrl: string;
  title: string;
  videoSection: string;
  description: string;
  videoLength: number;
  links: CourseLink[];
  suggestion?: string;
  questions: any[]; // Define a proper interface if needed
  _id: string;
}

interface Course {
  _id: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  estimatedPrice: number;
  demoUrl: string;
  ratings: number;
  purchased: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  level: string;
  tags: string;
  benefits: Array<{ title: string; _id: string }>;
  prerequisites: Array<{ title: string; _id: string }>;
  courseData: CourseData[];
  reviews: Review[];
}

interface CourseDetailsProps {
  data: Course;
  clientSecret: string;
  stripePromise: Promise<Stripe | null>;
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
}

// Format price in Indian Rupees
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const CourseDetails: React.FC<CourseDetailsProps> = ({
  data,
  clientSecret,
  stripePromise,
  setRoute,
  setOpen: openAuthModal,
}) => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (userData?.user) {
      setUser(userData.user);
    }
  }, [userData]);

  const discountPercentage = Math.round(
    ((data.estimatedPrice - data.price) / data.estimatedPrice) * 100
  );

  const isPurchased =
    user?.courses?.some((course) => course._id === data._id) ?? false;

  const handlePurchase = () => {
    if (user) {
      setCheckoutOpen(true);
    } else {
      setRoute("Login");
      openAuthModal(true);
    }
  };

  // Sub-components with proper typing
  const CourseSection: React.FC<{
    title: string;
    children: React.ReactNode;
  }> = ({ title, children }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold font-Poppins mb-4 text-black dark:text-white">
        {title}
      </h2>
      {children}
    </div>
  );

  const BenefitItem: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center py-2">
      <IoMdCheckmarkCircleOutline
        size={20}
        className="text-black dark:text-white"
      />
      <p className="pl-2 text-black dark:text-white">{title}</p>
    </div>
  );

  const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="w-full pb-4">
      <div className="flex">
        <Image
          src={review.user.avatar?.url || defaultImage}
          width={50}
          height={50}
          alt={`${review.user.name}'s avatar`}
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <div className="pl-2 flex-1">
          <div className="flex items-center">
            <h5 className="text-lg font-medium text-black dark:text-white mr-2">
              {review.user.name}
            </h5>
            <Ratings rating={review.rating} />
          </div>
          <p className="text-black dark:text-white my-1">{review.comment}</p>
          <small className="text-gray-600 dark:text-gray-400">
            {format(review.createdAt)}
          </small>
        </div>
      </div>

      {review.commentReplies.map((reply, index) => (
        <div key={index} className="ml-16 mt-4">
          <div className="flex">
            <Image
              src={reply.user.avatar?.url || defaultImage}
              width={40}
              height={40}
              alt={`${reply.user.name}'s avatar`}
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
            <div className="pl-2 flex-1">
              <div className="flex items-center">
                <h5 className="text-base font-medium text-black dark:text-white">
                  {reply.user.name}
                </h5>
                {reply.user.role === "admin" && (
                  <VscVerifiedFilled className="text-blue-500 ml-2 text-lg" />
                )}
              </div>
              <p className="text-black dark:text-white my-1">{reply.comment}</p>
              <small className="text-gray-600 dark:text-gray-400">
                {format(reply.createdAt)}
              </small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-[100px]">
      {/* Course Header Section */}
      <div className="mb-8">
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden mb-6">
          <Image
            src={data.thumbnail.url}
            alt={data.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            {data.name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Level: {data.level}</span>
          <span>Tags: {data.tags}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <CourseSection title="What you will learn">
            {data.benefits?.map((item) => (
              <BenefitItem key={item._id} title={item.title} />
            ))}
          </CourseSection>

          <CourseSection title="Prerequisites">
            {data.prerequisites?.map((item) => (
              <BenefitItem key={item._id} title={item.title} />
            ))}
          </CourseSection>

          <CourseSection title="Course Overview">
            <ContentCourseList data={data.courseData} isDemo={true} />
          </CourseSection>

          <CourseSection title="Course Details">
            <p className="text-lg whitespace-pre-line text-black dark:text-white">
              {data.description}
            </p>
          </CourseSection>

          <CourseSection title="Reviews">
            <div className="flex items-center gap-4 mb-6">
              <Ratings rating={data.ratings} />
              <span className="text-black dark:text-white">
                ({data.reviews.length} Reviews)
              </span>
            </div>
            {data.reviews
              .slice()
              .reverse()
              .map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
          </CourseSection>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            <CoursePlayer
              videoUrl={data.demoUrl}
              title={data.title || data.name}
            />

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-black dark:text-white">
                  {data.price === 0 ? "Free" : formatPrice(data.price)}
                </span>
                {data.price !== data.estimatedPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(data.estimatedPrice)}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="text-green-500 font-medium">
                    {discountPercentage}% off
                  </span>
                )}
              </div>

              {isPurchased ? (
                <Link
                  href={`/course-access/${data._id}`}
                  className={`${styles.button} w-full text-center`}
                >
                  Go to Course
                </Link>
              ) : (
                <button
                  onClick={handlePurchase}
                  className={`${styles.button} w-full`}
                >
                  Buy Now {formatPrice(data.price)}
                </button>
              )}

              <ul className="mt-6 space-y-2">
                <li className="flex items-center gap-2 text-black dark:text-white">
                  <IoMdCheckmarkCircleOutline className="text-green-500" />
                  Lifetime Access
                </li>
                <li className="flex items-center gap-2 text-black dark:text-white">
                  <IoMdCheckmarkCircleOutline className="text-green-500" />
                  Source Code Included
                </li>
                <li className="flex items-center gap-2 text-black dark:text-white">
                  <IoMdCheckmarkCircleOutline className="text-green-500" />
                  Certificate of Completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {checkoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
            <div className="flex justify-end">
              <button
                onClick={() => setCheckoutOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdCloseCircleOutline size={30} />
              </button>
            </div>
            {stripePromise && clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckOutForm
                  setOpen={setCheckoutOpen}
                  data={data}
                  user={user}
                />
              </Elements>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
