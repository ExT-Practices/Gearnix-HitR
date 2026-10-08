import React, { useEffect, useState } from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

import api from "../../services/api";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import { getImageUrl } from "../../utils/imageUrl";

const ProductDetails = () => {
  const { id } = useParams();

  // =========================
  // STATES
  // =========================

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // =========================
  // FETCH PRODUCT
  // =========================

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/products/${id}`);

      console.log("Product response:", response.data);

      const prod = response.data.product;
      const imgs = response.data.images || [];
      const mainImage = prod?.primary_image || prod?.image || (imgs.length > 0 ? imgs[0].image : null);

      setProduct({
        ...prod,
        primary_image: mainImage,
      });
      setImages(imgs);
      setSelectedImage(mainImage);
    } catch (error) {
      console.error("Fetch product error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load product"
      );

      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // =========================
  // ADD TO WISHLIST
  // =========================

  const handleAddToWishlist = async () => {
    if (!product) {
      return;
    }

    try {
      setWishlistLoading(true);

      const token = localStorage.getItem("customerToken") || localStorage.getItem("token");

      // No token
      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await api.post(
        "/wishlist",
        {
          product_id: product.id,
        }
      );

      console.log(
        "Wishlist response:",
        response.data
      );

      alert(
        response.data?.message ||
          "Product added to wishlist"
      );
    } catch (error) {
      console.error(
        "Add wishlist error:",
        error
      );

      if (error.response?.status === 401) {
        alert("Please login first");
        return;
      }

      if (error.response?.status === 403) {
        alert(
          "Customer login required. Please logout and login again."
        );
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to add product to wishlist"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    try {
      setCartLoading(true);

      const token = localStorage.getItem("customerToken") || localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await api.post(
        "/cart",
        {
          product_id: product.id,
          quantity: quantity,
        }
      );

      console.log(
        "Cart response:",
        response.data
      );

      alert(
        response.data?.message ||
          "Product added to cart"
      );
    } catch (error) {
      console.error("Add to cart error:", error);

      if (error.response?.status === 401) {
        alert("Please login first");
        return;
      }

      if (error.response?.status === 403) {
        alert(
          "Customer login required. Please logout and login again."
        );
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    } finally {
      setCartLoading(false);
    }
  };

  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQuantity = () => {
    if (!product) {
      return;
    }

    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNavbar />

        <div className="flex min-h-[500px] items-center justify-center">
          <p className="text-lg text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNavbar />

        <div className="flex min-h-[500px] flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Product not found
          </h2>

          <Link
            to="/products"
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // =========================
  // PRICE CALCULATION
  // =========================

  const price = Number(product.price || 0);

  const discountPrice =
    product.discount_price !== null &&
    product.discount_price !== undefined
      ? Number(product.discount_price)
      : null;

  const currentPrice =
    discountPrice !== null &&
    discountPrice > 0
      ? discountPrice
      : price;

  const totalPrice =
    currentPrice * quantity;

  // =========================
  // JSX
  // =========================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <CustomerNavbar />

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <Link
            to="/products"
            className="hover:text-black"
          >
            Products
          </Link>

          <span className="mx-2">/</span>

          <span className="text-gray-700">
            {product.name}
          </span>
        </div>

        {/* Product Card */}
        <div className="grid grid-cols-1 gap-10 rounded-2xl bg-white p-6 shadow-sm lg:grid-cols-2 lg:p-10">
          {/* PRODUCT IMAGE & GALLERY */}
          {/* ========================= */}

          <div className="flex flex-col gap-4">
            <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-gray-100 p-6 overflow-hidden">
              {selectedImage || product.primary_image || product.image ? (
                <img
                  src={getImageUrl(selectedImage || product.primary_image || product.image)}
                  alt={product.name}
                  className="max-h-[450px] w-full object-contain rounded-lg transition duration-300"
                />
              ) : (
                <span className="text-gray-400">
                  No Image
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images && images.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((imgObj, idx) => (
                  <button
                    key={imgObj.id || idx}
                    type="button"
                    onClick={() => setSelectedImage(imgObj.image)}
                    className={`h-16 w-16 flex-shrink-0 rounded-lg border-2 overflow-hidden transition ${
                      selectedImage === imgObj.image
                        ? "border-black shadow-md"
                        : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={getImageUrl(imgObj.image)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ========================= */}
          {/* PRODUCT DETAILS */}
          {/* ========================= */}

          <div className="flex flex-col justify-center">
            {/* Category */}
            {product.category_name && (
              <p className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
                {product.category_name}
              </p>
            )}

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* SKU */}
            {product.sku && (
              <p className="mt-3 text-sm text-gray-500">
                SKU: {product.sku}
              </p>
            )}

            {/* Brand */}
            {product.brand && (
              <p className="mt-2 text-sm text-gray-500">
                Brand: {product.brand}
              </p>
            )}

            {/* Price */}
            <div className="mt-5 flex items-center gap-4">
              <p className="text-3xl font-bold text-gray-900">
                ₹
                {currentPrice.toLocaleString(
                  "en-IN"
                )}
              </p>

              {discountPrice !== null &&
                discountPrice > 0 &&
                discountPrice < price && (
                  <p className="text-lg text-gray-400 line-through">
                    ₹
                    {price.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                )}
            </div>

            {/* Description */}
            <div className="mt-6 border-t pt-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Description
              </h3>

              <p className="leading-7 text-gray-600">
                {product.description ||
                  "No description available."}
              </p>
            </div>

            {/* Stock */}
            <div className="mt-6">
              {Number(product.stock) > 0 ? (
                <span className="font-medium text-green-600">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="font-medium text-red-600">
                  Out of Stock
                </span>
              )}
            </div>

            {/* ========================= */}
            {/* QUANTITY */}
            {/* ========================= */}

            {Number(product.stock) > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium">
                  Quantity
                </p>

                <div className="flex w-fit items-center rounded-lg border border-gray-300">
                  {/* Minus */}
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="cursor-pointer p-3 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiMinus size={16} />
                  </button>

                  {/* Quantity */}
                  <span className="min-w-12 text-center font-medium">
                    {quantity}
                  </span>

                  {/* Plus */}
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={
                      quantity >=
                      Number(product.stock)
                    }
                    className="cursor-pointer p-3 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ========================= */}
            {/* TOTAL */}
            {/* ========================= */}

            {Number(product.stock) > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  Total
                </p>

                <p className="text-2xl font-bold text-gray-900">
                  ₹
                  {totalPrice.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            )}

            {/* ========================= */}
            {/* BUTTONS */}
            {/* ========================= */}

            <div className="mt-8 flex gap-3">
              {/* Add To Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  Number(product.stock) <= 0 ||
                  cartLoading
                }
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-black px-6 py-4 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <FiShoppingCart size={19} />

                {cartLoading
                  ? "Adding..."
                  : "Add to Cart"}
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={handleAddToWishlist}
                disabled={wishlistLoading}
                className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="Add to Wishlist"
              >
                <FiHeart size={20} />

                {wishlistLoading && (
                  <span className="sr-only">
                    Adding to wishlist...
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;