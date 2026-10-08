const express = require("express");

const {
    createBlog,
    getPublishedBlogs,
    getBlogById,
    getBlogBySlug,
    getAllBlogsAdmin,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");


const {
    authMiddleware,
    adminMiddleware
} = require("../middleware/authMiddleware");


const uploadBlog = require("../middleware/blogUploadMiddleware");

const router = express.Router();


// =================================
// PUBLIC ROUTES
// =================================

router.get(
    "/",
    getPublishedBlogs
);


// IMPORTANT:
// /slug/:slug and /admin/all
// must come before /:id

router.get(
    "/slug/:slug",
    getBlogBySlug
);


// =================================
// ADMIN ROUTES
// =================================

router.get(
    "/admin/all",
    authMiddleware,
    adminMiddleware,
    getAllBlogsAdmin
);


router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    uploadBlog.single("image"),
    createBlog
);


router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    uploadBlog.single("image"),
    updateBlog
);


router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteBlog
);


// =================================
// PUBLIC DETAILS
// =================================

router.get(
    "/:id",
    getBlogById
);


module.exports = router;