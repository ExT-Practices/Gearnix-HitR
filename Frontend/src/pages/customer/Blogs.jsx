import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import api from "../../services/api";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import BlogGrid from "../../components/customer/BlogGrid";
import Footer from "../../components/Footer";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/blogs");
      setBlogs(response.data.blogs || response.data.data || response.data || []);
    } catch (error) {
      console.error("Fetch blogs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(search.toLowerCase()) ||
    blog.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#19181d] text-white flex flex-col justify-between">
      <div>
        <CustomerNavbar />

        <main className="mx-auto max-w-7xl px-6 py-12">
          {/* Section Heading: Our Blog */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-wide text-white md:text-5xl">
              Our Blog
            </h1>

            <p className="mt-3 text-sm text-gray-400 md:text-base">
              Explore the cutting edge of technology and innovation
            </p>
          </div>

          {/* Filters */}
          <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-gray-800 bg-[#29282e] p-4 shadow-lg md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-[#1e1d22] py-3 pl-11 pr-4 text-white outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Blog Content */}
          {loading ? (
            <div className="py-20 text-center text-gray-400">
              Loading blogs...
            </div>
          ) : (
            <BlogGrid blogs={filteredBlogs} />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Blogs;
