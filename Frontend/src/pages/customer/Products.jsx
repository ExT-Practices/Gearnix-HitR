import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import api from "../../services/api";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import ProductGrid from "../../components/customer/ProductGrid";
import Footer from "../../components/Footer";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to load products"
      );
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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      String(product.category_id) === String(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#19181d] text-white flex flex-col justify-between">
      <div>
        <CustomerNavbar />

        <main className="mx-auto max-w-7xl px-6 py-12">
          {/* Section Title */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-wide text-white md:text-5xl">
              All Products
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

          {/* Filters / Search Bar */}
          <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-gray-800 bg-[#29282e] p-4 shadow-lg md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-[#1e1d22] py-3 pl-11 pr-4 text-white outline-none focus:border-pink-500"
              />
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-gray-700 bg-[#1e1d22] px-4 py-3 text-white outline-none focus:border-pink-500 md:w-64"
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="py-20 text-center text-gray-400">
              Loading products...
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Products;