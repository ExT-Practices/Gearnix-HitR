import React from "react";
import { Link } from "react-router-dom";

const RecentOrders = ({ orders = [] }) => {
    const safeOrders = Array.isArray(orders) ? orders : [];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">

            <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                    Recent Orders
                </h2>

                <Link
                    to="/admin/orders"
                    className="text-sm text-blue-600 hover:underline"
                >
                    View All
                </Link>
            </div>


            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                Order
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                Customer
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                Amount
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                Payment
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody className="divide-y divide-gray-100">

                        {safeOrders.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    No orders found
                                </td>
                            </tr>

                        ) : (

                            safeOrders.map((order) => (

                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50"
                                >

                                    <td className="px-6 py-4">

                                        <Link
                                            to={`/admin/orders/${order.id}`}
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            {order.order_number}
                                        </Link>

                                    </td>


                                    <td className="px-6 py-4">

                                        <p className="font-medium text-gray-800">
                                            {order.customer_name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {order.customer_email}
                                        </p>

                                    </td>


                                    <td className="px-6 py-4 font-medium">
                                        ₹{Number(order.total_amount).toFixed(2)}
                                    </td>


                                    <td className="px-6 py-4">

                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                order.payment_status === "paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : order.payment_status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {order.payment_status}
                                        </span>

                                    </td>


                                    <td className="px-6 py-4">

                                        <span className="text-sm capitalize text-gray-700">
                                            {order.order_status}
                                        </span>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default RecentOrders;