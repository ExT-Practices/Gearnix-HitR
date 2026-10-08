const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Database connection
const db = require("./config/db");

const ensureDefaultAccounts = async () => {
    const adminEmail = "admin@gearnix.com";
    const adminPassword = "123456";
    const customerEmail = "customer@gearnix.com";
    const customerPassword = "password";

    try {
        const [adminRows] = await db.query(
            "SELECT id FROM admins WHERE email = ?",
            [adminEmail]
        );

        const adminHash = await bcrypt.hash(adminPassword, 10);

        if (adminRows.length > 0) {
            await db.query(
                "UPDATE admins SET password = ? WHERE email = ?",
                [adminHash, adminEmail]
            );
        } else {
            await db.query(
                "INSERT INTO admins (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)",
                ["Super Admin", adminEmail, adminHash, "admin", "active"]
            );
        }

        const [customerRows] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [customerEmail]
        );

        const customerHash = await bcrypt.hash(customerPassword, 10);

        if (customerRows.length > 0) {
            await db.query(
                "UPDATE users SET password = ?, status = 'active' WHERE email = ?",
                [customerHash, customerEmail]
            );
        } else {
            await db.query(
                "INSERT INTO users (name, email, password, phone, status) VALUES (?, ?, ?, ?, ?)",
                ["Test Customer", customerEmail, customerHash, "1234567890", "active"]
            );
        }
    } catch (error) {
        console.error("Default account setup failed:", error.message);
    }
};

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const blogRoutes = require("./routes/blogRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./server/routes/orderRoutes");
const paymentRoutes = require("./server/routes/paymentRoutes");
const adminManagementRoutes = require("./server/routes/adminManagementRoutes");
const adminProfileRoutes = require("./server/routes/adminProfileRoutes");


const app = express();

// ================================
// Middleware
// ================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// Routes
// ================================

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/customer/auth", authRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminManagementRoutes);

// Category routes
app.use("/api/categories", categoryRoutes);

// Product routes
app.use("/api/products", productRoutes);

// Blog routes
app.use("/api/blogs", blogRoutes);

// Cart routes
app.use("/api/cart", cartRoutes);

// Wishlist routes
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Dashboard routes
app.use("/api/dashboard", dashboardRoutes);

// Uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// User routes
app.use("/api/users", userRoutes);

// Admin profile routes
app.use(
    "/api/admin",
    adminProfileRoutes
);

// ================================
// API Status
// ================================

app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        message: "API is running"
    });
});

// ================================
// Root Route
// ================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Gearnix Backend API is running"
    });
});

// ================================
// 404 Handler
// ================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// ================================
// Start Server
// ================================

const PORT = process.env.PORT || 5000;

ensureDefaultAccounts();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});