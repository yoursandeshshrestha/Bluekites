"use client";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { motion } from "framer-motion";
import Loader from "../Loader";

type Props = {};

const Hero: FC<Props> = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data, isLoading } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data) {
      setTitle(data?.layout?.banner.title);
      setSubTitle(data?.layout?.banner.subTitle);
      setImage(data?.layout?.banner?.image?.url);
    }
  }, [data]);

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/courses?title=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />

      {/* Hero Container */}
      <div className="relative container mx-auto px-4 py-8 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen gap-8 lg:gap-4">
          {/* Content Section */}
          <div className="w-full lg:w-[60%] flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 pt-20 lg:pt-0">
            {/* Title with highlight effect */}
            <div className="relative">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-Poppins text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                         font-bold leading-tight text-gray-900 dark:text-white"
              >
                {/* Add proper word spacing */}
                {"Tomorrow it was a dream, Today it's an achievement"
                  .split("  ")
                  .map((word, index) => (
                    <span
                      key={index}
                      className="inline-block hover:text-[#39c1f3] transition-colors duration-300"
                    >
                      {word}
                      {index !==
                        "Tomorrow it was a dream, Today it's an achievement".split(
                          " "
                        ).length -
                          1 && " "}
                    </span>
                  ))}
              </motion.h1>
              <div className="absolute -bottom-2 left-0 w-24 h-1 bg-[#39c1f3]" />
            </div>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-2xl"
            >
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search Courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full h-16 px-6 rounded-xl
                           bg-white dark:bg-gray-800 
                           border-2 border-gray-100 dark:border-gray-700
                           text-gray-900 dark:text-white text-lg
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           focus:border-[#39c1f3] dark:focus:border-[#39c1f3]
                           outline-none
                           transition-all duration-300
                           shadow-sm hover:shadow-md"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-2 
                           h-12 px-8
                           bg-[#39c1f3] hover:bg-[#2bb1e8]
                           text-white font-medium
                           rounded-lg
                           flex items-center gap-2
                           transition-all duration-300
                           transform hover:scale-105"
                >
                  <BiSearch className="text-2xl" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-[40%] flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-xl">
              {/* Image Decoration */}
              <div className="absolute -inset-4 bg-[#39c1f3] opacity-5 blur-xl rounded-full" />
              <div className="absolute -inset-4 bg-grid-pattern opacity-10 dark:opacity-20" />

              <img
                src={image}
                alt="Hero"
                className="relative w-full h-auto object-contain
                         rounded-2xl
                         transform hover:scale-105 hover:rotate-1
                         transition-all duration-500 ease-out"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
