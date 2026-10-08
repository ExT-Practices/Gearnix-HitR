const express = require("express");

const {
    getAllUsers,
    getUserById,
    updateUserStatus,
    createUser,
    updateUser
} = require("../controllers/userController");


const {
    authMiddleware,
    adminMiddleware
} = require("../middleware/authMiddleware");


const router = express.Router();


// All users
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);

// Create user
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createUser
);


// User details
router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getUserById
);

// Update user details
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateUser
);


// Update status
router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateUserStatus
);


module.exports = router;