const express = require("express");

const router = express.Router();

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword
} = require("../controllers/adminProfileController");

router.get(
    "/profile",
    adminAuthMiddleware,
    getAdminProfile
);

router.put(
    "/profile",
    adminAuthMiddleware,
    updateAdminProfile
);

router.put(
    "/change-password",
    adminAuthMiddleware,
    changeAdminPassword
);

module.exports = router;