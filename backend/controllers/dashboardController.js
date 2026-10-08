const dashboardService = require("../services/dashboardService");

// Dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const stats = await dashboardService.getDashboardStats();

        return res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
};

// Recent users
const getRecentUsers = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 5;
        const users = await dashboardService.getRecentUsers(limit);

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recent users",
            error: error.message
        });
    }
};

const getDashboardData = async (req, res) => {
    try {
        const [
            stats,
            recentOrders,
            monthlyRevenue
        ] = await Promise.all([
            dashboardService.getDashboardStats(),
            dashboardService.getRecentOrders(),
            dashboardService.getMonthlyRevenue()
        ]);

        return res.status(200).json({
            success: true,
            data: {
                stats,
                recentOrders,
                monthlyRevenue
            }
        });
    } catch (error) {
        console.error(
            "Dashboard data error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.sqlMessage || error.message
        });
    }
};

const getDateRange = (req) => {
    const { filter, startDate, endDate } = req.query;

    const now = new Date();

    let start;
    let end;

    if (filter === "today") {
        start = new Date();
        start.setHours(0, 0, 0, 0);

        end = new Date();
        end.setHours(23, 59, 59, 999);
    } else if (filter === "week") {
        start = new Date();
        const day = start.getDay();
        const difference = day === 0 ? 6 : day - 1;

        start.setDate(start.getDate() - difference);
        start.setHours(0, 0, 0, 0);

        end = new Date();
        end.setHours(23, 59, 59, 999);
    } else if (filter === "month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);

        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
    } else if (filter === "custom") {
        if (!startDate || !endDate) {
            throw new Error("Start date and end date are required");
        }

        start = new Date(`${startDate}T00:00:00`);
        end = new Date(`${endDate}T23:59:59`);
    } else {
        start = new Date(0);
        end = new Date();
        end.setHours(23, 59, 59, 999);
    }

    return {
        startDate: start,
        endDate: end
    };
};

const getFilteredDashboard = async (req, res) => {
    try {
        const { startDate, endDate } = getDateRange(req);

        const [
            stats,
            recentOrders,
            revenue
        ] = await Promise.all([
            dashboardService.getDashboardStatsByDate(
                startDate,
                endDate
            ),
            dashboardService.getRecentOrdersByDate(
                startDate,
                endDate
            ),
            dashboardService.getRevenueByDate(
                startDate,
                endDate
            )
        ]);

        return res.status(200).json({
            success: true,
            data: {
                stats,
                recentOrders,
                revenue
            }
        });
    } catch (error) {
        console.error("Filtered dashboard error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDashboardStats,
    getRecentUsers,
    getDashboardData,
    getFilteredDashboard
};
