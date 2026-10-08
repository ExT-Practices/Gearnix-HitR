import React, { useEffect, useState } from "react";
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from "../../utils/imageUrl";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [form, setForm] = useState({
    shipping_name: "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_pincode: "",
  });

  // =====================================================
  // LOAD RAZORPAY SCRIPT
  // =====================================================

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // =====================================================
  // GET CART
  // =====================================================

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await api.get("/cart");

      console.log("CART API RESPONSE:", response.data);

      // -------------------------------------------------
      // Handle different possible backend response shapes
      // -------------------------------------------------

      const cartData =
        response.data?.data ||
        response.data?.cart ||
        response.data?.items ||
        [];

      const items = Array.isArray(cartData)
        ? cartData
        : [];

      // -------------------------------------------------
      // Normalize cart items
      // -------------------------------------------------

      const normalizedItems = items.map((item) => {
        const price = Number(
          item?.discount_price ??
            item?.price ??
            item?.product_price ??
            0
        );

        const quantity = Number(item?.quantity ?? 0);

        const itemTotal = Number(
          item?.item_total ??
            item?.total_price ??
            price * quantity
        );

        return {
          ...item,

          cart_item_id:
            item?.cart_item_id ??
            item?.id,

          name:
            item?.name ??
            item?.product_name ??
            "Product",

          slug:
            item?.slug ??
            "",

          image:
            item?.image ??
            item?.primary_image ??
            item?.product_image ??
            "",

          price: Number.isFinite(price)
            ? price
            : 0,

          quantity: Number.isFinite(quantity)
            ? quantity
            : 0,

          item_total: Number.isFinite(itemTotal)
            ? itemTotal
            : 0,
        };
      });

      setCart(normalizedItems);

      // -------------------------------------------------
      // Calculate total from cart items
      // -------------------------------------------------

      const calculatedTotal =
        normalizedItems.reduce(
          (sum, item) => {
            return (
              sum +
              Number(item.item_total || 0)
            );
          },
          0
        );

      setTotal(
        Number.isFinite(calculatedTotal)
          ? calculatedTotal
          : 0
      );

    } catch (error) {
      console.error("Cart error:", error);

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

  useEffect(() => {
    fetchCart();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // VALIDATE SHIPPING
  // =====================================================

  const validateForm = () => {
    if (!form.shipping_name.trim()) {
      alert("Please enter your name");
      return false;
    }

    if (!form.shipping_phone.trim()) {
      alert("Please enter your phone number");
      return false;
    }

    if (!/^[0-9]{10}$/.test(form.shipping_phone.trim())) {
      alert("Please enter a valid 10-digit phone number");
      return false;
    }

    if (!form.shipping_address.trim()) {
      alert("Please enter your address");
      return false;
    }

    if (!form.shipping_city.trim()) {
      alert("Please enter your city");
      return false;
    }

    if (!form.shipping_state.trim()) {
      alert("Please enter your state");
      return false;
    }

    if (!form.shipping_pincode.trim()) {
      alert("Please enter your pincode");
      return false;
    }

    if (
      !/^[0-9]{6}$/.test(
        form.shipping_pincode.trim()
      )
    ) {
      alert("Please enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  // =====================================================
  // CREATE DATABASE ORDER
  // =====================================================

  const createOrder = async () => {
    const response = await api.post(
      "/orders",
      {
        shipping_name:
          form.shipping_name.trim(),

        shipping_phone:
          form.shipping_phone.trim(),

        shipping_address:
          form.shipping_address.trim(),

        shipping_city:
          form.shipping_city.trim(),

        shipping_state:
          form.shipping_state.trim(),

        shipping_pincode:
          form.shipping_pincode.trim(),
      }
    );

    console.log(
      "CREATE ORDER RESPONSE:",
      response.data
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to create order"
      );
    }

    return response.data.data;
  };

  // =====================================================
  // CREATE RAZORPAY ORDER
  // =====================================================

  const createRazorpayOrder = async (orderId) => {
    const response = await api.post(
      "/payment/create-order",
      {
        order_id: orderId,
      }
    );

    console.log(
      "RAZORPAY ORDER RESPONSE:",
      response.data
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to create Razorpay order"
      );
    }

    return response.data.data;
  };

  // =====================================================
  // VERIFY PAYMENT
  // =====================================================

  const verifyPayment = async (
    paymentResponse,
    orderId
  ) => {
    const response = await api.post(
      "/payment/verify",
      {
        order_id: orderId,

        razorpay_order_id:
          paymentResponse.razorpay_order_id,

        razorpay_payment_id:
          paymentResponse.razorpay_payment_id,

        razorpay_signature:
          paymentResponse.razorpay_signature,
      }
    );

    console.log(
      "PAYMENT VERIFY RESPONSE:",
      response.data
    );

    return response.data;
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (placingOrder) {
      return;
    }

    // -----------------------------------------------
    // Validate form
    // -----------------------------------------------

    if (!validateForm()) {
      return;
    }

    // -----------------------------------------------
    // Validate cart
    // -----------------------------------------------

    if (!Array.isArray(cart) || cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // -----------------------------------------------
    // Validate total
    // -----------------------------------------------

    const safeTotal = Number(total);

    if (
      !Number.isFinite(safeTotal) ||
      safeTotal <= 0
    ) {
      console.error(
        "Invalid checkout total:",
        total
      );

      alert(
        "Invalid order total. Please refresh the cart and try again."
      );

      return;
    }

    // -----------------------------------------------
    // Check Razorpay
    // -----------------------------------------------

    if (
      typeof window.Razorpay ===
      "undefined"
    ) {
      alert(
        "Razorpay is still loading. Please try again."
      );

      return;
    }

    try {
      setPlacingOrder(true);

      console.log(
        "CHECKOUT TOTAL:",
        safeTotal
      );

      // =================================================
      // STEP 1 - CREATE DATABASE ORDER
      // =================================================

      const order =
        await createOrder();

      if (!order?.order_id) {
        throw new Error(
          "Order ID was not returned from server"
        );
      }

      console.log(
        "DATABASE ORDER:",
        order
      );

      // =================================================
      // STEP 2 - CREATE RAZORPAY ORDER
      // =================================================

      const razorpayOrder =
        await createRazorpayOrder(
          order.order_id
        );

      if (
        !razorpayOrder?.razorpay_order_id
      ) {
        throw new Error(
          "Razorpay order ID was not returned"
        );
      }

      if (
        !razorpayOrder?.amount ||
        Number(razorpayOrder.amount) <= 0
      ) {
        throw new Error(
          "Invalid Razorpay amount"
        );
      }

      console.log(
        "RAZORPAY ORDER:",
        razorpayOrder
      );

      // =================================================
      // STEP 3 - RAZORPAY CHECKOUT
      // =================================================

      const options = {
        key: razorpayOrder.key_id,

        amount: Number(
          razorpayOrder.amount
        ),

        currency:
          razorpayOrder.currency || "INR",

        name: "Gearnix",

        description:
          `Payment for ${
            order.order_number ||
            "Gearnix Order"
          }`,

        order_id:
          razorpayOrder.razorpay_order_id,

        prefill: {
          name:
            form.shipping_name,

          contact:
            form.shipping_phone,
        },

        notes: {
          order_number:
            order.order_number ||
            String(order.order_id),
        },

        theme: {
          color: "#000000",
        },

        // =================================================
        // PAYMENT SUCCESS
        // =================================================

        handler: async (
          paymentResponse
        ) => {
          try {
            console.log(
              "RAZORPAY PAYMENT RESPONSE:",
              paymentResponse
            );

            // ---------------------------------------------
            // STEP 4 - VERIFY PAYMENT
            // ---------------------------------------------

            const verification =
              await verifyPayment(
                paymentResponse,
                order.order_id
              );

            if (
              verification?.success
            ) {
              // -------------------------------------------
              // STEP 5 - SUCCESS PAGE
              // -------------------------------------------

              navigate(
                "/order-success",
                {
                  state: {
                    order_id:
                      order.order_id,

                    order_number:
                      order.order_number,

                    total_amount:
                      order.total_amount,

                    payment_id:
                      paymentResponse
                        .razorpay_payment_id,
                  },
                }
              );
            } else {
              alert(
                verification?.message ||
                  "Payment verification failed"
              );
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert(
              error.response?.data
                ?.message ||
                error.message ||
                "Payment verification failed"
            );
          }
        },

        // =================================================
        // MODAL DISMISS
        // =================================================

        modal: {
          ondismiss: () => {
            console.log(
              "Razorpay checkout closed"
            );
          },
        },
      };

      // =================================================
      // OPEN RAZORPAY
      // =================================================

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Payment failed:",
            response?.error
          );

          alert(
            response?.error?.description ||
              "Payment failed"
          );
        }
      );

      razorpay.open();

    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to start payment"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Loading checkout...
        </p>
      </div>
    );
  }

  // =====================================================
  // CHECKOUT PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* =========================================
              SHIPPING INFORMATION
          ========================================== */}

          <div className="bg-white rounded-xl p-6 shadow-sm">

            <h2 className="text-xl font-semibold mb-6">
              Shipping Information
            </h2>

            <form
              onSubmit={handlePlaceOrder}
              className="space-y-4"
            >

              <input
                type="text"
                name="shipping_name"
                placeholder="Full Name"
                value={
                  form.shipping_name
                }
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                type="tel"
                name="shipping_phone"
                placeholder="Phone Number"
                value={
                  form.shipping_phone
                }
                onChange={handleChange}
                required
                maxLength={10}
                className="w-full border rounded-lg px-4 py-3"
              />

              <textarea
                name="shipping_address"
                placeholder="Full Address"
                value={
                  form.shipping_address
                }
                onChange={handleChange}
                required
                rows="4"
                className="w-full border rounded-lg px-4 py-3"
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="text"
                  name="shipping_city"
                  placeholder="City"
                  value={
                    form.shipping_city
                  }
                  onChange={handleChange}
                  required
                  className="border rounded-lg px-4 py-3"
                />

                <input
                  type="text"
                  name="shipping_state"
                  placeholder="State"
                  value={
                    form.shipping_state
                  }
                  onChange={handleChange}
                  required
                  className="border rounded-lg px-4 py-3"
                />

              </div>

              <input
                type="text"
                name="shipping_pincode"
                placeholder="Pincode"
                value={
                  form.shipping_pincode
                }
                onChange={handleChange}
                required
                maxLength={6}
                className="w-full border rounded-lg px-4 py-3"
              />

              <button
                type="submit"
                disabled={
                  placingOrder ||
                  cart.length === 0
                }
                className="w-full bg-black text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
              >
                {placingOrder
                  ? "Processing..."
                  : "Pay with Razorpay"}
              </button>

            </form>
          </div>

          {/* =========================================
              ORDER SUMMARY
          ========================================== */}

          <div className="bg-white rounded-xl p-6 shadow-sm h-fit">

            <h2 className="text-xl font-semibold mb-6">
              Order Summary
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  Your cart is empty
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">

                  {cart.map((item, index) => {

                    const price =
                      Number(
                        item.price || 0
                      );

                    const quantity =
                      Number(
                        item.quantity || 0
                      );

                    const itemTotal =
                      Number(
                        item.item_total ||
                          price * quantity
                      );

                    return (
                      <div
                        key={
                          item.cart_item_id ||
                          item.id ||
                          index
                        }
                        className="flex gap-4 border-b pb-4"
                      >

                        {/* PRODUCT IMAGE */}

                        <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">

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

                        {/* PRODUCT DETAILS */}

                        <div className="flex-1">

                          <h3 className="font-medium">
                            {item.name}
                          </h3>

                          <p className="text-gray-500 text-sm">
                            Quantity:{" "}
                            {quantity}
                          </p>

                          <p className="text-gray-500 text-sm">
                            Price: ₹
                            {price.toFixed(
                              2
                            )}
                          </p>

                          <p className="font-semibold mt-1">
                            ₹
                            {Number.isFinite(
                              itemTotal
                            )
                              ? itemTotal.toFixed(
                                  2
                                )
                              : "0.00"}
                          </p>

                        </div>

                      </div>
                    );
                  })}

                </div>

                {/* TOTALS */}

                <div className="border-t mt-6 pt-6">

                  <div className="flex justify-between mb-3">
                    <span>
                      Subtotal
                    </span>

                    <span>
                      ₹
                      {Number(
                        total
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between mb-3">
                    <span>
                      Shipping
                    </span>

                    <span className="text-green-600">
                      FREE
                    </span>
                  </div>

                  <div className="flex justify-between text-xl font-bold">
                    <span>
                      Total
                    </span>

                    <span>
                      ₹
                      {Number(
                        total
                      ).toFixed(2)}
                    </span>
                  </div>

                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;