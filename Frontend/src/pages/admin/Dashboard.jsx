import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

import StatCard from "../../components/admin/StatCard";
import DashboardDateFilter from "../../components/admin/DashboardDateFilter";
import { getFilteredDashboard } from "../../services/dashboardService";

const emptyDashboard = {
    stats: {},
    recentOrders: [],
    revenue: []
};

const Dashboard = () => {
    const [filter, setFilter] = useState("today");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dashboard, setDashboard] = useState(emptyDashboard);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        getFilteredDashboard({ filter: "today" })
            .then((response) => {
                if (isMounted) {
                    setDashboard(response.data || emptyDashboard);
                }
            })
            .catch((error) => {
                console.error("Dashboard fetch error:", error);

                if (isMounted) {
                    alert(
                        error.response?.data?.message ||
                        "Failed to load dashboard"
                    );
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const params = { filter };

            if (filter === "custom") {
                params.startDate = startDate;
                params.endDate = endDate;
            }

            const response = await getFilteredDashboard(params);
            setDashboard(response.data || emptyDashboard);
        } catch (error) {
            console.error("Dashboard fetch error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleApplyFilter = () => {
        if (filter === "custom" && (!startDate || !endDate)) {
            alert("Please select start date and end date");
            return;
        }

        if (filter === "custom" && startDate > endDate) {
            alert("Start date cannot be greater than end date");
            return;
        }

        fetchDashboard();
    };

    const stats = dashboard.stats || {};
    const recentOrders = dashboard.recentOrders || [];
    const revenue = dashboard.revenue || [];

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="text-sm text-gray-500">
                    View your store performance
                </p>
            </div>

            <DashboardDateFilter
                filter={filter}
                setFilter={setFilter}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onApply={handleApplyFilter}
            />

            {loading && (
                <p className="text-blue-600">
                    Loading dashboard...
                </p>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={stats.total_users || 0}
                />

                <StatCard
                    title="Total Orders"
                    value={stats.total_orders || 0}
                />

                <StatCard
                    title="Total Products"
                    value={stats.total_products || 0}
                />

                <StatCard
                    title="Total Revenue"
                    value={`₹${Number(
                        stats.total_revenue || 0
                    ).toLocaleString("en-IN")}`}
                />
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    Revenue Report
                </h2>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="revenue_date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#2563eb"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    Recent Orders
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-5 text-center text-gray-500"
                                    >
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b"
                                    >
                                        <td className="p-3">
                                            #{order.id}
                                        </td>

                                        <td className="p-3">
                                            {order.customer_name}
                                        </td>

                                        <td className="p-3">
                                            ₹{Number(
                                                order.total_amount || 0
                                            ).toLocaleString("en-IN")}
                                        </td>

                                        <td className="p-3">
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                                                {order.payment_status}
                                            </span>
                                        </td>

                                        <td className="p-3">
                                            {order.created_at
                                                ? new Date(
                                                    order.created_at
                                                ).toLocaleDateString("en-IN")
                                                : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
