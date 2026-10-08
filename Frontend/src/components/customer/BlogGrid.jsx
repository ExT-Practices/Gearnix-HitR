import React from "react";
import BlogCard from "./BlogCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const BlogGrid = ({ blogs, isSlider = false }) => {
  if (!blogs || !blogs.length) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-semibold text-gray-800">
          No blogs found
        </h3>

        <p className="mt-2 text-gray-500">
          Check back later for new articles.
        </p>
      </div>
    );
  }

  if (isSlider && blogs.length > 4) {
    return (
      <div className="relative px-2">
        <Swiper
          modules={[Autoplay, Pagination ]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="!pb-10"
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog.id} className="!h-auto flex pb-2 mt-5">
              <div className="w-full h-full">
                <BlogCard blog={blog} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogGrid;

