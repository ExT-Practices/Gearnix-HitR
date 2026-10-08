import { useEffect, useState } from "react";
import { FaBoxOpen, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // Get Orders
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders");

      setOrders(response.data.data || []);

    } catch (error) {
      console.error("Get orders error:", error);

      if (error.response?.status === 401) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to load orders"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Loading orders...
        </p>
      </div>
    );
  }


  // ==========================================
  // Empty Orders
  // ==========================================

  if (orders.length === 0) {
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
            My Orders
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-12 text-center">

            <FaBoxOpen
              className="text-6xl text-gray-300 mx-auto mb-5"
            />

            <h2 className="text-2xl font-semibold mb-2">
              No orders yet
            </h2>

            <p className="text-gray-500 mb-6">
              You haven't placed any orders yet.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-3 rounded-lg"
            >
              Start Shopping
            </button>

          </div>

        </div>

      </div>
    );
  }


  // ==========================================
  // Orders
  // ==========================================

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

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            My Orders
          </h1>

          <p className="text-gray-500 mt-1">
            View and track your orders
          </p>

        </div>


        <div className="space-y-4">

          {orders.map((order) => (

            <div
              key={order.order_id}
              className="bg-white rounded-xl shadow-sm p-6"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                {/* Order Information */}

                <div>

                  <p className="text-sm text-gray-500">
                    Order Number
                  </p>

                  <h2 className="font-bold text-lg">
                    {order.order_number}
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(
                      order.created_at
                    ).toLocaleDateString()}
                  </p>

                </div>


                {/* Items */}

                <div>

                  <p className="text-sm text-gray-500">
                    Items
                  </p>

                  <p className="font-medium">
                    {order.total_items}
                  </p>

                </div>


                {/* Payment Status */}

                <div>

                  <p className="text-sm text-gray-500">
                    Payment
                  </p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                      order.payment_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.payment_status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.payment_status}
                  </span>

                </div>


                {/* Order Status */}

                <div>

                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                      order.order_status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.order_status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.order_status}
                  </span>

                </div>


                {/* Total */}

                <div>

                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="text-lg font-bold">
                    ₹
                    {Number(
                      order.total_amount
                    ).toFixed(2)}
                  </p>

                </div>


                {/* View Button */}

                <button
                  onClick={() =>
                    navigate(
                      `/orders/${order.order_id || order.id}`
                    )
                  }
                  className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
                >
                  View Details
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default Orders;