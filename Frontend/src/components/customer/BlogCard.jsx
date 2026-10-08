import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from "../../utils/imageUrl";

const BlogCard = ({ blog }) => {
  const dateFormatted = blog.created_at
    ? new Date(blog.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "Aug 03, 2024";

  return (
    <div className="group flex h-full flex-col justify-between overflow-hidden rounded-[24px] bg-[#29282e] p-4 transition-all duration-300 hover:-translate-y-1 border border-gray-800/80 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]">
      {/* Top Image Container */}
      <div className="relative h-56 w-full overflow-hidden rounded-[20px] bg-[#1e1d22]">
        {blog.image ? (
          <img
            src={getImageUrl(blog.image)}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = DEFAULT_PRODUCT_IMAGE;
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No Image
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute left-3.5 top-3.5 rounded-lg bg-[#3f2249]/80 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md shadow-sm">
          {dateFormatted}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between px-2 pb-2 pt-4">
        <div>
          {/* Author */}
          <p className="text-xs text-gray-400 font-normal">
            By {blog.author || "Gearnix"}
          </p>

          {/* Title */}
          <Link to={`/blogs/${blog.id}`}>
            <h3 className="mt-2 line-clamp-2 text-base md:text-lg font-bold leading-snug text-white transition hover:text-pink-500">
              {blog.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-400">
            {blog.short_description ||
              blog.content?.replace(/<[^>]*>?/gm, "").substring(0, 110) + "..."}
          </p>
        </div>

        {/* Read More Link */}
        <div className="mt-4 pt-2">
          <Link
            to={`/blogs/${blog.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white transition hover:text-pink-500"
          >
            <span>Read more</span>
            <FiArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
