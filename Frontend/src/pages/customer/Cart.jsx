import React, { useEffect, useState } from "react";
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from "../../utils/imageUrl";
import { FaMinus, FaPlus, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // ==============================
  // Get Cart
  // ==============================

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await api.get("/cart");

      setCart(response.data.data || []);
      setTotal(Number(response.data.total || 0));
    } catch (error) {
      console.error("Get cart error:", error);

      if (error.response?.status === 401) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Load Cart
  // ==============================

  useEffect(() => {
    fetchCart();
  }, []);

  // ==============================
  // Update Quantity
  // ==============================

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      await api.put(`/cart/${cartItemId}`, {
        quantity,
      });

      await fetchCart();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update quantity"
      );
    }
  };

  // ==============================
  // Remove Item
  // ==============================

  const removeItem = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);

      await fetchCart();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    }
  };

  // ==============================
  // Clear Cart
  // ==============================

  const clearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete("/cart");

      setCart([]);
      setTotal(0);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to clear cart"
      );
    }
  };

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading cart...
        </p>
      </div>
    );
  }

  // ==============================
  // Empty Cart
  // ==============================

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">

        <div className="max-w-6xl mx-auto">

          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black mb-6 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm transition duration-200 w-fit"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Products</span>
          </button>

          <h1 className="text-3xl font-bold mb-8">
            My Cart
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-12 text-center">

            <div className="text-6xl mb-5">
              🛒
            </div>

            <h2 className="text-2xl font-semibold mb-2">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mb-6">
              You haven't added any products to your cart yet.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==============================
  // Cart Page
  // ==============================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">

      <div className="max-w-7xl mx-auto">

        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black mb-6 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm transition duration-200 w-fit"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back to Products</span>
        </button>

        {/* Header */}

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              My Cart
            </h1>

            <p className="text-gray-500 mt-1">
              {cart.length}{" "}
              {cart.length === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>

        </div>

        {/* Main Content */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ==========================
              Cart Items
          =========================== */}

          <div className="lg:col-span-2 space-y-4">

            {cart.map((item) => (

              <div
                key={item.cart_item_id}
                className="bg-white rounded-xl shadow-sm p-5"
              >

                <div className="flex gap-5">

                  {/* Product Image */}

                  <div
                    className="w-28 h-28 sm:w-36 sm:h-36 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/products/${item.product_id}`
                      )
                    }
                  >

                    <img
                      src={getImageUrl(item.image || item.primary_image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_PRODUCT_IMAGE;
                      }}
                    />

                  </div>

                  {/* Product Information */}

                  <div className="flex-1">

                    <div className="flex justify-between gap-4">

                      <div>

                        <h2
                          className="text-lg font-semibold cursor-pointer hover:text-gray-600"
                          onClick={() =>
                            navigate(
                              `/products/${item.product_id}`
                            )
                          }
                        >
                          {item.name}
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                          ₹
                          {Number(item.price).toFixed(2)}
                          {" "}per item
                        </p>

                      </div>

                      {/* Remove */}

                      <button
                        onClick={() =>
                          removeItem(
                            item.cart_item_id
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                        title="Remove"
                      >
                        <FaTrash />
                      </button>

                    </div>

                    {/* Bottom */}

                    <div className="flex items-center justify-between mt-6">

                      {/* Quantity */}

                      <div className="flex items-center border rounded-lg">

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.cart_item_id,
                              Number(item.quantity) - 1
                            )
                          }
                          disabled={
                            Number(item.quantity) <= 1
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                        >
                          <FaMinus size={11} />
                        </button>

                        <span className="w-10 text-center font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.cart_item_id,
                              Number(item.quantity) + 1
                            )
                          }
                          disabled={
                            Number(item.quantity) >=
                            Number(item.stock)
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                        >
                          <FaPlus size={11} />
                        </button>

                      </div>

                      {/* Item Total */}

                      <div className="text-right">

                        <p className="text-lg font-bold">
                          ₹
                          {Number(
                            item.item_total
                          ).toFixed(2)}
                        </p>

                      </div>

                    </div>

                    {/* Stock */}

                    {Number(item.stock) > 0 &&
                      Number(item.quantity) >=
                        Number(item.stock) && (
                        <p className="text-orange-500 text-sm mt-2">
                          Maximum available stock reached
                        </p>
                      )}

                  </div>

                </div>

              </div>

            ))}

            {/* Continue Shopping */}

            <button
              onClick={() => navigate("/products")}
              className="text-gray-700 hover:text-black font-medium"
            >
              ← Continue Shopping
            </button>

          </div>

          {/* ==========================
              Order Summary
          =========================== */}

          <div className="lg:col-span-1">

            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">

              <h2 className="text-xl font-bold mb-6">
                Order Summary
              </h2>

              {/* Items */}

              <div className="space-y-3">

                <div className="flex justify-between text-gray-600">
                  <span>
                    Items
                  </span>

                  <span>
                    {cart.reduce(
                      (sum, item) =>
                        sum +
                        Number(item.quantity),
                      0
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>
                    Shipping
                  </span>

                  <span className="text-green-600 font-medium">
                    FREE
                  </span>
                </div>

              </div>

              {/* Divider */}

              <div className="border-t my-5"></div>

              {/* Total */}

              <div className="flex justify-between text-xl font-bold mb-6">

                <span>
                  Total
                </span>

                <span>
                  ₹{total.toFixed(2)}
                </span>

              </div>

              {/* Checkout */}

              <button
                onClick={() => navigate("/checkout")}
                disabled={cart.length === 0}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>

              {/* Payment Message */}

              <p className="text-xs text-gray-500 text-center mt-4">
                Taxes and payment will be calculated
                during checkout.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;