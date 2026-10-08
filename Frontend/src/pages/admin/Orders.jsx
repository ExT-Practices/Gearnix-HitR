import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Orders = () => {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchOrders = async () => {

        try {

            const response =
                await api.get("/admin/orders");

            setOrders(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Orders error:",
                error
            );

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


    const getPaymentClass = (
        status
    ) => {

        if (status === "paid") {
            return "bg-green-100 text-green-700";
        }

        if (status === "failed") {
            return "bg-red-100 text-red-700";
        }

        return "bg-yellow-100 text-yellow-700";

    };


    const getOrderClass = (
        status
    ) => {

        if (status === "delivered") {
            return "bg-green-100 text-green-700";
        }

        if (status === "cancelled") {
            return "bg-red-100 text-red-700";
        }

        if (status === "shipped") {
            return "bg-purple-100 text-purple-700";
        }

        return "bg-blue-100 text-blue-700";

    };


    if (loading) {

        return (
            <div className="p-6">
                Loading orders...
            </div>
        );

    }


    return (

        <div className="p-6">

            <div className="flex items-center justify-between mb-6">

                <div>

                    <h1 className="text-2xl font-bold">
                        Orders
                    </h1>

                    <p className="text-gray-500">
                        Manage customer orders
                    </p>

                </div>

                <div className="bg-white px-5 py-3 rounded-lg shadow-sm">

                    <span className="text-gray-500">
                        Total Orders
                    </span>

                    <span className="font-bold ml-2">
                        {orders.length}
                    </span>

                </div>

            </div>


            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left px-5 py-4">
                                    Order
                                </th>

                                <th className="text-left px-5 py-4">
                                    Customer
                                </th>

                                <th className="text-left px-5 py-4">
                                    Items
                                </th>

                                <th className="text-left px-5 py-4">
                                    Amount
                                </th>

                                <th className="text-left px-5 py-4">
                                    Payment
                                </th>

                                <th className="text-left px-5 py-4">
                                    Status
                                </th>

                                <th className="text-left px-5 py-4">
                                    Date
                                </th>

                                <th className="text-left px-5 py-4">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {orders.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No orders found
                                    </td>

                                </tr>

                            ) : (

                                orders.map(
                                    (order) => (

                                        <tr
                                            key={order.order_id}
                                            className="border-t hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4">

                                                <p className="font-semibold">
                                                    {order.order_number}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    #{order.order_id}
                                                </p>

                                            </td>


                                            <td className="px-5 py-4">

                                                <p className="font-medium">
                                                    {order.customer_name}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {order.customer_email}
                                                </p>

                                            </td>


                                            <td className="px-5 py-4">
                                                {order.total_items}
                                            </td>


                                            <td className="px-5 py-4 font-semibold">

                                                ₹
                                                {Number(
                                                    order.total_amount
                                                ).toFixed(2)}

                                            </td>


                                            <td className="px-5 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${getPaymentClass(
                                                        order.payment_status
                                                    )}`}
                                                >
                                                    {order.payment_status}
                                                </span>

                                            </td>


                                            <td className="px-5 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${getOrderClass(
                                                        order.order_status
                                                    )}`}
                                                >
                                                    {order.order_status}
                                                </span>

                                            </td>


                                            <td className="px-5 py-4 text-sm">

                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString()}

                                            </td>


                                            <td className="px-5 py-4">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/orders/${order.order_id}`
                                                        )
                                                    }
                                                    className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};

export default Orders;