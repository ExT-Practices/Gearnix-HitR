import { useEffect, useState } from "react";
import api from "../../services/api";

const Payments = () => {

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchPayments = async () => {

        try {

            const response =
                await api.get(
                    "/admin/payments"
                );

            setPayments(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Payment history error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load payment history"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchPayments();
    }, []);


    if (loading) {

        return (
            <div className="p-6">
                Loading payment history...
            </div>
        );

    }


    return (

        <div className="p-6">

            <div className="mb-6">

                <h1 className="text-2xl font-bold">
                    Payment History
                </h1>

                <p className="text-gray-500">
                    View customer payments
                </p>

            </div>


            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left px-5 py-4">
                                    Customer
                                </th>

                                <th className="text-left px-5 py-4">
                                    Order
                                </th>

                                <th className="text-left px-5 py-4">
                                    Amount
                                </th>

                                <th className="text-left px-5 py-4">
                                    Payment ID
                                </th>

                                <th className="text-left px-5 py-4">
                                    Status
                                </th>

                                <th className="text-left px-5 py-4">
                                    Date
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {payments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No payments found
                                    </td>

                                </tr>

                            ) : (

                                payments.map(
                                    (payment) => (

                                        <tr
                                            key={payment.payment_id}
                                            className="border-t hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4">

                                                <p className="font-semibold">
                                                    {payment.customer_name}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {payment.customer_email}
                                                </p>

                                            </td>


                                            <td className="px-5 py-4">

                                                {payment.order_number}

                                            </td>


                                            <td className="px-5 py-4 font-bold">

                                                ₹
                                                {Number(
                                                    payment.amount
                                                ).toFixed(2)}

                                            </td>


                                            <td className="px-5 py-4 text-sm">

                                                {payment.razorpay_payment_id ||
                                                    "N/A"}

                                            </td>


                                            <td className="px-5 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${payment.payment_status ===
                                                            "paid"
                                                            ? "bg-green-100 text-green-700"
                                                            : payment.payment_status ===
                                                                "failed"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {payment.payment_status}
                                                </span>

                                            </td>


                                            <td className="px-5 py-4 text-sm">

                                                {new Date(
                                                    payment.created_at
                                                ).toLocaleString()}

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

export default Payments;