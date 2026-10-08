import React, { useState } from "react";
import { FaStar, FaShoppingCart, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from "../../utils/imageUrl";
import api from "../../services/api";

const ProductCard = ({ product }) => {
  const [addingCart, setAddingCart] = useState(false);
  const [addingWishlist, setAddingWishlist] = useState(false);

  const image = product.primary_image || product.image;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAddingCart(true);
      const token =
        localStorage.getItem("customerToken") ||
        localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await api.post("/cart", {
        product_id: product.id,
        quantity: 1,
      });

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
      alert(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    } finally {
      setAddingCart(false);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAddingWishlist(true);
      const token =
        localStorage.getItem("customerToken") ||
        localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await api.post("/wishlist", {
        product_id: product.id,
      });

      alert(
        response.data?.message ||
          "Product added to wishlist"
      );
    } catch (error) {
      console.error("Add to wishlist error:", error);
      if (error.response?.status === 401) {
        alert("Please login first");
        return;
      }
      alert(
        error.response?.data?.message ||
          "Failed to add product to wishlist"
      );
    } finally {
      setAddingWishlist(false);
    }
  };

  const price = Number(product.price || 0);
  const discountPrice =
    product.discount_price !== null && product.discount_price !== undefined
      ? Number(product.discount_price)
      : null;

  return (
    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] bg-[#29282e] p-5 border border-gray-800/80 transition-all duration-300 hover:border-pink-500/60 hover:shadow-[0_0_25px_rgba(236,72,153,0.35)]">
      {/* Floating Action Buttons (Top Right - Shown only on hover) */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2.5 opacity-0 translate-x-3 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto">
        {/* Wishlist Star */}
        <button
          type="button"
          onClick={handleAddToWishlist}
          disabled={addingWishlist}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-gray-800 shadow-md transition hover:bg-pink-500 hover:text-white disabled:opacity-50"
          title="Add to Wishlist"
        >
          <FaStar
            size={13}
            className={addingWishlist ? "animate-pulse text-pink-500" : ""}
          />
        </button>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={addingCart || Number(product.stock || 0) <= 0}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-gray-800 shadow-md transition hover:bg-pink-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          title="Add to Cart"
        >
          <FaShoppingCart size={13} />
        </button>

        {/* View Details Eye */}
        <Link
          to={`/products/${product.id}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-800 shadow-md transition hover:bg-pink-500 hover:text-white"
          title="View Details"
        >
          <FaEye size={13} />
        </Link>
      </div>

      {/* Product Image */}
      <div className="flex h-56 w-full items-center justify-center overflow-hidden rounded-[16px] bg-transparent p-4">
        {image ? (
          <img
            src={getImageUrl(image)}
            alt={product.name}
            className="max-h-52 w-full object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = DEFAULT_PRODUCT_IMAGE;
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-4 flex flex-col items-center text-center">
        {/* Title */}
        <Link to={`/products/${product.id}`} className="w-full">
          <h3 className="line-clamp-1 text-base font-semibold text-white transition hover:text-pink-500">
            {product.name}
          </h3>
        </Link>

        {/* Rating Stars */}
        <div className="my-2.5 flex items-center justify-center gap-1 text-amber-400">
          <FaStar size={13} />
          <FaStar size={13} />
          <FaStar size={13} />
          <FaStar size={13} />
          <FaStar size={13} />
        </div>

        {/* Price */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-bold text-white">
            ₹
            {(discountPrice && discountPrice > 0
              ? discountPrice
              : price
            ).toLocaleString("en-IN")}
          </span>

          {discountPrice && discountPrice > 0 && discountPrice < price && (
            <span className="text-sm font-normal text-gray-400 line-through">
              ₹{price.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;