import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utils/imageUrl";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Get Order Details
  // ==========================================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/${id}`);

      console.log("ORDER DETAILS API RESPONSE:", response.data);

      // ------------------------------------------
      // Handle different API response structures
      // ------------------------------------------

      const responseData =
        response.data?.data || response.data || {};

      // ------------------------------------------
      // Get order
      // ------------------------------------------

      const orderData =
        responseData?.order ||
        responseData?.orders ||
        null;

      // ------------------------------------------
      // Get items
      // ------------------------------------------

      let orderItems =
        responseData?.items ||
        responseData?.order_items ||
        [];

      // ------------------------------------------
      // Make sure items is always an array
      // ------------------------------------------

      if (!Array.isArray(orderItems)) {
        if (orderItems && typeof orderItems === "object") {
          orderItems = [orderItems];
        } else {
          orderItems = [];
        }
      }

      setOrder(orderData);
      setItems(orderItems);

    } catch (error) {
      console.error("Get order details error:", error);

      // ------------------------------------------
      // Unauthorized
      // ------------------------------------------

      if (error.response?.status === 401) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      // ------------------------------------------
      // Forbidden
      // ------------------------------------------

      if (error.response?.status === 403) {
        alert("You are not authorized to view this order");
        navigate("/orders");
        return;
      }

      // ------------------------------------------
      // Not found
      // ------------------------------------------

      if (error.response?.status === 404) {
        alert("Order not found");
        navigate("/orders");
        return;
      }

      const message =
        error.response?.data?.message ||
        "Failed to load order";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Load order
  // ==========================================

  useEffect(() => {
    if (!id) {
      setError("Order ID is missing");
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [id]);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>

          <p className="text-gray-500">
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md w-full">

          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Unable to Load Order
          </h2>

          <p className="text-gray-600 mb-6">
            {error}
          </p>

          <button
            onClick={() => navigate("/orders")}
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Back to Orders
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // No order
  // ==========================================

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">

          <h2 className="text-2xl font-bold mb-4">
            Order not found
          </h2>

          <button
            onClick={() => navigate("/orders")}
            className="text-blue-600 hover:underline"
          >
            Back to Orders
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // Calculate item count
  // ==========================================

  const totalItems = Array.isArray(items)
    ? items.reduce(
        (total, item) =>
          total + Number(item?.quantity || 0),
        0
      )
    : 0;

  // ==========================================
  // Format date
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString();
  };

  // ==========================================
  // Format price
  // ==========================================

  const formatPrice = (price) => {
    const number = Number(price);

    if (Number.isNaN(number)) {
      return "0.00";
    }

    return number.toFixed(2);
  };

  // ==========================================
  // Get product image
  // ==========================================

  const getProductImage = (item) => {
    return (
      item?.primary_image ||
      item?.image ||
      item?.product_image ||
      null
    );
  };

  // ==========================================
  // Page
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">

      <div className="max-w-6xl mx-auto">

        {/* ==================================
            Back Button
        =================================== */}

        <button
          onClick={() => navigate("/orders")}
          className="text-gray-600 hover:text-black mb-6 transition"
        >
          ← Back to Orders
        </button>

        {/* ==================================
            Order Header
        =================================== */}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <p className="text-sm text-gray-500">
                Order Number
              </p>

              <h1 className="text-2xl font-bold">
                {order.order_number || `#${order.id}`}
              </h1>

              <p className="text-gray-500 mt-1">
                {formatDate(
                  order.created_at ||
                  order.order_created_at
                )}
              </p>

            </div>

            {/* Status */}

            <div className="flex flex-wrap gap-3">

              <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium capitalize">
                {order.order_status || "Pending"}
              </span>

              <span
                className={`px-4 py-2 rounded-full font-medium capitalize ${
                  order.payment_status === "paid"
                    ? "bg-green-100 text-green-700"
                    : order.payment_status === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.payment_status || "Pending"}
              </span>

            </div>

          </div>

        </div>

        {/* ==================================
            Main Grid
        =================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ==================================
              Products
          =================================== */}

          <div className="lg:col-span-2">

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold mb-6">
                Ordered Products
              </h2>

              {/* No products */}

              {items.length === 0 ? (

                <div className="text-center py-10 text-gray-500">
                  No products found in this order.
                </div>

              ) : (

                <div className="space-y-5">

                  {items.map((item, index) => {

                    const image =
                      getProductImage(item);

                    return (
                      <div
                        key={
                          item?.order_item_id ||
                          item?.id ||
                          index
                        }
                        className="flex gap-4 border-b pb-5 last:border-b-0"
                      >

                        {/* ==================================
                            Product Image
                        =================================== */}

                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">

                          {image ? (

                            <img
                              src={getImageUrl(image)}
                              alt={
                                item?.product_name ||
                                item?.name ||
                                "Product"
                              }
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />

                          ) : (

                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              No Image
                            </div>

                          )}

                        </div>

                        {/* ==================================
                            Product Information
                        =================================== */}

                        <div className="flex-1">

                          <h3 className="font-semibold text-lg">
                            {item?.product_name ||
                              item?.name ||
                              "Product"}
                          </h3>

                          <p className="text-gray-500 mt-1">
                            ₹
                            {formatPrice(
                              item?.product_price ||
                              item?.price
                            )}

                            {" "}×{" "}

                            {item?.quantity || 0}
                          </p>

                        </div>

                        {/* ==================================
                            Subtotal
                        =================================== */}

                        <div className="font-bold text-right">

                          ₹
                          {formatPrice(
                            item?.subtotal ||
                            item?.item_total
                          )}

                        </div>

                      </div>
                    );
                  })}

                </div>

              )}

              {/* ==================================
                  Total
              =================================== */}

              <div className="border-t mt-6 pt-5 flex justify-between text-xl font-bold">

                <span>
                  Total
                </span>

                <span>
                  ₹
                  {formatPrice(
                    order.total_amount
                  )}
                </span>

              </div>

            </div>

          </div>

          {/* ==================================
              Right Side
          =================================== */}

          <div>

            {/* ==================================
                Shipping Address
            =================================== */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold mb-6">
                Shipping Address
              </h2>

              <div className="space-y-2 text-gray-600">

                <p className="font-semibold text-black">
                  {order.shipping_name || "N/A"}
                </p>

                <p>
                  {order.shipping_phone || "N/A"}
                </p>

                <p>
                  {order.shipping_address || "N/A"}
                </p>

                <p>
                  {order.shipping_city || ""}
                  {order.shipping_city &&
                  order.shipping_state
                    ? ", "
                    : ""}
                  {order.shipping_state || ""}
                </p>

                <p>
                  Pincode:{" "}
                  {order.shipping_pincode || "N/A"}
                </p>

              </div>

            </div>

            {/* ==================================
                Order Summary
            =================================== */}

            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">

              <h2 className="text-xl font-bold mb-4">
                Order Summary
              </h2>

              {/* Items */}

              <div className="flex justify-between mb-3">

                <span className="text-gray-600">
                  Items
                </span>

                <span>
                  {totalItems}
                </span>

              </div>

              {/* Shipping */}

              <div className="flex justify-between mb-3">

                <span className="text-gray-600">
                  Shipping
                </span>

                <span className="text-green-600">
                  FREE
                </span>

              </div>

              {/* Payment */}

              <div className="flex justify-between mb-3">

                <span className="text-gray-600">
                  Payment
                </span>

                <span className="capitalize">
                  {order.payment_status ||
                    "Pending"}
                </span>

              </div>

              {/* Total */}

              <div className="border-t pt-4 flex justify-between font-bold text-lg">

                <span>
                  Total
                </span>

                <span>
                  ₹
                  {formatPrice(
                    order.total_amount
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderDetails;