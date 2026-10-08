import React, { useEffect, useState } from "react";
import api from "../../services/api";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import ProductGrid from "../../components/customer/ProductGrid";
import BlogGrid from "../../components/customer/BlogGrid";
import Footer from "../../components/Footer";
import Home from "../Home";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Blogs
  const fetchBlogs = async () => {
    try {
      setBlogsLoading(true);
      const response = await api.get("/blogs");
      setBlogs(response.data.blogs || response.data.data || response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBlogs();
  }, []);

  // Filter
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory ||
      String(product.category_id) === String(selectedCategory);

    return matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#19181d] text-white">
      <CustomerNavbar />
      <Home />
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Section Title: New Arrivals */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-wide text-white md:text-5xl">
            New Arrivals
          </h1>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm font-medium md:text-base">
            <button
              onClick={() => setSelectedCategory("")}
              className={`cursor-pointer transition ${
                !selectedCategory
                  ? "border-b-2 border-pink-500 pb-1 font-bold text-pink-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              All Gear
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(String(cat.id))}
                className={`cursor-pointer transition ${
                  String(selectedCategory) === String(cat.id)
                    ? "border-b-2 border-pink-500 pb-1 font-bold text-pink-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            Loading products...
          </div>
        ) : (
          <ProductGrid products={filteredProducts} isSlider={true} />
        )}

        {/* Blog Section: Our Blog */}
        <section className="mt-24 border-t border-gray-800/80 pt-16">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold tracking-wide text-white md:text-5xl">
              Our Blog
            </h2>

            <p className="mt-3 text-sm text-gray-400 md:text-base">
              Explore the cutting edge of technology and innovation
            </p>
          </div>

          {blogsLoading ? (
            <div className="py-12 text-center text-gray-400">
              Loading blogs...
            </div>
          ) : (
            <BlogGrid blogs={blogs} isSlider={true} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
