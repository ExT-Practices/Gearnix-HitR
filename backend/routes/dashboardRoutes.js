const express = require("express");

const {
    getDashboardStats,
    getRecentUsers,
    getDashboardData,
    getFilteredDashboard
} = require("../controllers/dashboardController");

const {
    authMiddleware,
    adminMiddleware
} = require("../middleware/authMiddleware");
const adminAuthMiddleware =
    require("../server/middleware/adminAuthMiddleware");
const permissionMiddleware =
    require("../server/middleware/permissionMiddleware");


const router = express.Router();

// Filtered dashboard data
router.get(
    "/filtered",
    adminAuthMiddleware,
    permissionMiddleware("dashboard.view"),
    getFilteredDashboard
);

// Test route
router.get("/test", (req, res) => res.json({ msg: "dashboard router is mounted" }));

// Complete dashboard data
const dashboardDataHandler = [
    adminAuthMiddleware,
    permissionMiddleware("dashboard.view"),
    getDashboardData
];

router.get("/", ...dashboardDataHandler);
router.get("", ...dashboardDataHandler);

// Dashboard statistics
router.get(
    "/stats",
    adminAuthMiddleware,
    getDashboardStats
);

// Recent users
router.get(
    "/recent-users",
    adminAuthMiddleware,
    getRecentUsers
);


module.exports = router;