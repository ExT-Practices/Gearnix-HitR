const express = require("express");

const customerAuthMiddleware = require("../middleware/customerAuthMiddleware");

const {
    createCustomerOrder,
    getCustomerOrders,
    getCustomerOrderById,
} = require("../controllers/orderController");


const router = express.Router();


router.use(customerAuthMiddleware);


router.post(
    "/",
    createCustomerOrder
);

router.get(
    "/",
    getCustomerOrders
);

router.get(
    "/:id",
    getCustomerOrderById
);


module.exports = router;