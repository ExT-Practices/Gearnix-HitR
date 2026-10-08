import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const OrderDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [payment, setPayment] = useState(null);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);


    const fetchOrder = async () => {

        try {

            const response =
                await api.get(
                    `/admin/orders/${id}`
                );


            setOrder(
                response.data.data.order
            );

            setItems(
                response.data.data.items || []
            );

            setPayment(
                response.data.data.payment
            );

        } catch (error) {

            console.error(
                "Order details error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load order"
            );

            navigate("/admin/orders");

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchOrder();
    }, [id]);


    const updateStatus = async (
        newStatus
    ) => {

        try {

            setUpdating(true);


            await api.put(
                `/admin/orders/${id}/status`,
                {
                    order_status: newStatus,
                }
            );


            setOrder((previous) => ({
                ...previous,
                order_status: newStatus,
            }));


            alert(
                "Order status updated"
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to update status"
            );

        } finally {

            setUpdating(false);

        }

    };


    if (loading) {

        return (
            <div className="p-6">
                Loading order...
            </div>
        );

    }


    if (!order) {
        return null;
    }


    return (

        <div className="p-6">

            <button
                onClick={() =>
                    navigate("/admin/orders")
                }
                className="text-gray-600 hover:text-black mb-6"
            >
                ← Back to Orders
            </button>


            {/* Header */}

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div>

                        <p className="text-sm text-gray-500">
                            Order Number
                        </p>

                        <h1 className="text-2xl font-bold">
                            {order.order_number}
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            {new Date(
                                order.created_at
                            ).toLocaleString()}
                        </p>

                    </div>


                    <div>

                        <label className="block text-sm text-gray-500 mb-2">
                            Order Status
                        </label>

                        <select
                            value={order.order_status}
                            disabled={updating}
                            onChange={(e) =>
                                updateStatus(
                                    e.target.value
                                )
                            }
                            className="border rounded-lg px-4 py-2"
                        >

                            <option value="pending">
                                Pending
                            </option>

                            <option value="confirmed">
                                Confirmed
                            </option>

                            <option value="processing">
                                Processing
                            </option>

                            <option value="shipped">
                                Shipped
                            </option>

                            <option value="delivered">
                                Delivered
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>

                        </select>

                    </div>

                </div>

            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


                {/* ==================================
            Customer
        =================================== */}

                <div className="bg-white rounded-xl shadow-sm p-6">

                    <h2 className="text-xl font-bold mb-5">
                        Customer
                    </h2>

                    <div className="space-y-2">

                        <p>
                            <span className="text-gray-500">
                                Name:
                            </span>{" "}
                            {order.customer_name}
                        </p>

                        <p>
                            <span className="text-gray-500">
                                Email:
                            </span>{" "}
                            {order.customer_email}
                        </p>

                    </div>

                </div>


                {/* ==================================
            Payment
        =================================== */}

                <div className="bg-white rounded-xl shadow-sm p-6">

                    <h2 className="text-xl font-bold mb-5">
                        Payment
                    </h2>

                    <div className="space-y-3">

                        <p>
                            <span className="text-gray-500">
                                Status:
                            </span>{" "}

                            <span
                                className={`ml-2 px-3 py-1 rounded-full text-sm ${order.payment_status === "paid"
                                        ? "bg-green-100 text-green-700"
                                        : order.payment_status === "failed"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {order.payment_status}
                            </span>

                        </p>


                        {payment && (

                            <>

                                <p>
                                    <span className="text-gray-500">
                                        Payment ID:
                                    </span>{" "}
                                    {payment.razorpay_payment_id ||
                                        "N/A"}
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Razorpay Order:
                                    </span>{" "}
                                    {payment.razorpay_order_id}
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Amount:
                                    </span>{" "}
                                    ₹
                                    {Number(
                                        payment.amount
                                    ).toFixed(2)}
                                </p>

                            </>

                        )}

                    </div>

                </div>


                {/* ==================================
            Shipping
        =================================== */}

                <div className="bg-white rounded-xl shadow-sm p-6">

                    <h2 className="text-xl font-bold mb-5">
                        Shipping Address
                    </h2>

                    <div className="space-y-1 text-gray-600">

                        <p className="font-semibold text-black">
                            {order.shipping_name}
                        </p>

                        <p>
                            {order.shipping_phone}
                        </p>

                        <p>
                            {order.shipping_address}
                        </p>

                        <p>
                            {order.shipping_city},{" "}
                            {order.shipping_state}
                        </p>

                        <p>
                            {order.shipping_pincode}
                        </p>

                    </div>

                </div>

            </div>


            {/* ==================================
          Products
      =================================== */}

            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">

                <h2 className="text-xl font-bold mb-6">
                    Order Items
                </h2>


                <div className="space-y-5">

                    {items.map(
                        (item) => (

                            <div
                                key={item.order_item_id}
                                className="flex items-center gap-5 border-b pb-5"
                            >

                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">

                                    {item.image ? (

                                        <img
                                            src={item.image}
                                            alt={item.product_name}
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>

                                    )}

                                </div>


                                <div className="flex-1">

                                    <h3 className="font-semibold">
                                        {item.product_name}
                                    </h3>

                                    <p className="text-gray-500 text-sm">
                                        ₹
                                        {Number(
                                            item.product_price
                                        ).toFixed(2)}
                                        {" × "}
                                        {item.quantity}
                                    </p>

                                </div>


                                <div className="font-bold">

                                    ₹
                                    {Number(
                                        item.subtotal
                                    ).toFixed(2)}

                                </div>

                            </div>

                        )
                    )}

                </div>


                <div className="border-t mt-6 pt-5 flex justify-between text-xl font-bold">

                    <span>
                        Total
                    </span>

                    <span>
                        ₹
                        {Number(
                            order.total_amount
                        ).toFixed(2)}
                    </span>

                </div>

            </div>

        </div>

    );

};

export default OrderDetails;