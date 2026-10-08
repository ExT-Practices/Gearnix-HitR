const permissionMiddleware =
    require("../middleware/permissionMiddleware");

    router.post(
    "/",
    adminAuthMiddleware,
    permissionMiddleware("blogs.add"),
    createBlog
);

router.put(
    "/:id",
    adminAuthMiddleware,
    permissionMiddleware("blogs.edit"),
    updateBlog
);

router.delete(
    "/:id",
    adminAuthMiddleware,
    permissionMiddleware("blogs.delete"),
    deleteBlog
);

router.get(
    "/admin/all",
    adminAuthMiddleware,
    permissionMiddleware("blogs.view"),
    getAllBlogs
);

router.get("/", getPublicBlogs);

router.get(
    "/slug/:slug",
    getBlogBySlug
);

router.post(
    "/",
    adminAuthMiddleware,
    permissionMiddleware("categories.add"),
    createCategory
);

router.put(
    "/:id",
    adminAuthMiddleware,
    permissionMiddleware("categories.edit"),
    updateCategory
);

router.delete(
    "/:id",
    adminAuthMiddleware,
    permissionMiddleware("categories.delete"),
    deleteCategory
);

router.get(
    "/admin/all",
    adminAuthMiddleware,
    permissionMiddleware("categories.view"),
    getAllCategories
);

router.get(
    "/",
    adminAuthMiddleware,
    permissionMiddleware("users.view"),
    getAllUsers
);

router.put(
    "/:id/status",
    adminAuthMiddleware,
    permissionMiddleware("users.edit"),
    updateUserStatus
);

router.get(
    "/orders",
    adminAuthMiddleware,
    permissionMiddleware("orders.view"),
    getAllOrders
);

router.get(
    "/orders/:id",
    adminAuthMiddleware,
    permissionMiddleware("orders.view"),
    getOrderDetails
);

router.put(
    "/orders/:id/status",
    adminAuthMiddleware,
    permissionMiddleware("orders.edit"),
    updateOrderStatus
);

router.get(
    "/payments",
    adminAuthMiddleware,
    permissionMiddleware("payments.view"),
    getPaymentHistory
);

router.get(
    "/admins",
    adminAuthMiddleware,
    permissionMiddleware("admins.view"),
    getAllAdmins
);

router.post(
    "/admins",
    adminAuthMiddleware,
    permissionMiddleware("admins.add"),
    createSubAdmin
);

router.put(
    "/admins/:id",
    adminAuthMiddleware,
    permissionMiddleware("admins.edit"),
    updateAdmin
);

router.delete(
    "/admins/:id",
    adminAuthMiddleware,
    permissionMiddleware("admins.delete"),
    deleteAdmin
);

router.get(
    "/admin/all",
    adminAuthMiddleware,
    permissionMiddleware("products.view"),
    getAllProducts
);

router.get(
    "/:id",
    getProductById
);