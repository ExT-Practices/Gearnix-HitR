const db = require("../config/db");


// Dashboard statistics
const getDashboardStats = async () => {

    const [result] = await db.query(
        "CALL sp_get_dashboard_stats()"
    );

    return result[0][0];
};


// Recent users
const getRecentUsers = async (limit = 5) => {

    const [result] = await db.query(
        "CALL sp_get_recent_users(?)",
        [limit]
    );

    return result[0];
};

// Recent orders
const getRecentOrders = async () => {
    const [result] = await db.query(
        "CALL sp_get_recent_orders()"
    );

    return result[0];
};

// Monthly revenue
const getMonthlyRevenue = async () => {
    const [result] = await db.query(
        "CALL sp_get_monthly_revenue()"
    );

    return result[0];
};

const getDashboardStatsByDate = async (startDate, endDate) => {
    const [result] = await db.query(
        "CALL sp_get_dashboard_stats_by_date(?, ?)",
        [startDate, endDate]
    );

    return result[0][0];
};

const getRecentOrdersByDate = async (startDate, endDate) => {
    const [result] = await db.query(
        "CALL sp_get_recent_orders_by_date(?, ?)",
        [startDate, endDate]
    );

    return result[0];
};

const getRevenueByDate = async (startDate, endDate) => {
    const [result] = await db.query(
        "CALL sp_get_revenue_by_date(?, ?)",
        [startDate, endDate]
    );

    return result[0];
};


module.exports = {
    getDashboardStats,
    getRecentUsers,
    getRecentOrders,
    getMonthlyRevenue,
    getDashboardStatsByDate,
    getRecentOrdersByDate,
    getRevenueByDate
};