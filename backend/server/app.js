const express = require("express");

const app = express();

// ==========================================
// Webhook routes MUST come before
// express.json()
// ==========================================

const webhookRoutes = require("./routes/webhookRoutes");

app.use("/api/webhook", webhookRoutes);

// ==========================================
// Normal JSON parser
// ==========================================

app.use(express.json());

// ==========================================
// Other routes
// ==========================================

const customerAuthRoutes = require("./routes/customerAuthRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminManagementRoutes = require("./routes/adminManagementRoutes");
// const adminManagementRoutes = require("./routes/adminManagementRoutes");

app.use("/api/customer/auth", customerAuthRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin",adminOrderRoutes);
app.use("/api/admin",adminManagementRoutes);
// app.use("/api/admin",adminManagementRoutes);

module.exports = app;