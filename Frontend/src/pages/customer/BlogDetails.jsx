import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiUser } from "react-icons/fi";
import api from "../../services/api";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import Footer from "../../components/Footer";
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from "../../utils/imageUrl";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data.blog || response.data.data || response.data);
    } catch (error) {
      console.error("Fetch blog error:", error);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNavbar />
        <div className="flex min-h-[500px] items-center justify-center text-gray-500">
          Loading article...
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div>
          <CustomerNavbar />
          <div className="flex min-h-[500px] flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Blog article not found
            </h2>

            <Link to="/blogs" className="mt-4 text-blue-600 hover:underline">
              Back to Blogs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const dateFormatted = blog.created_at
    ? new Date(blog.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recent";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <CustomerNavbar />

        <main className="mx-auto max-w-4xl px-6 py-10">
          {/* Back Button & Breadcrumb */}
          <div className="mb-6 flex items-center gap-4">
            <Link
              to="/blogs"
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
            >
              <FiArrowLeft size={16} />
              <span>Back to Blogs</span>
            </Link>
          </div>

          {/* Article Card */}
          <article className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm lg:p-10">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              {blog.title}
            </h1>

            {/* Author & Date */}
            <div className="mt-4 flex items-center gap-6 border-b border-gray-100 pb-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <FiUser className="text-gray-400" />
                <span className="font-medium text-gray-700">
                  {blog.author || "Gearnix"}
                </span>
              </span>

              <span className="flex items-center gap-2">
                <FiCalendar className="text-gray-400" />
                <span>{dateFormatted}</span>
              </span>
            </div>

            {/* Image */}
            {blog.image && (
              <div className="my-8 overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={getImageUrl(blog.image)}
                  alt={blog.title}
                  className="max-h-[500px] w-full object-cover"
                  onError={(e) => {
                    e.target.src = DEFAULT_PRODUCT_IMAGE;
                  }}
                />
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
              {blog.content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <p>{blog.short_description || "No content available."}</p>
              )}
            </div>
          </article>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetails;
