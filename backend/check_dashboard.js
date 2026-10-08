const express = require('express');
const app = express();
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

console.log("Checking dashboardRoutes layer:");
const routerLayer = app._router.stack.find(l => l.name === 'router');
if (routerLayer) {
    console.log(routerLayer.handle.stack.map(s => s.route ? s.route.path : s.name));
}
