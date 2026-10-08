const productService =
    require("../services/productService");

const createProduct = async (req, res) => {

    try {

        const {
            category_id,
            name,
            slug,
            short_description,
            description,
            price,
            discount_price,
            stock,
            sku,
            brand
        } = req.body;


        if (
            !category_id ||
            !name ||
            !slug ||
            !price ||
            stock === undefined
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Category, name, slug, price and stock are required"
            });

        }


        const product =
            await productService.createProduct(
                category_id,
                name,
                slug,
                short_description,
                description,
                price,
                discount_price || null,
                stock,
                sku || null,
                brand || null
            );


        const extractImages = (req) => {
            let files = [];
            if (req.files) {
                if (Array.isArray(req.files)) {
                    files = req.files;
                } else if (typeof req.files === "object") {
                    files = Object.values(req.files).flat();
                }
            }
            if (req.file) {
                files.push(req.file);
            }
            return files;
        };

        const uploadedImages = extractImages(req);

        if (uploadedImages.length > 0) {

            for (let i = 0; i < uploadedImages.length; i++) {

                const imagePath =
                    `/uploads/products/${uploadedImages[i].filename}`;

                await productService.addProductImage(
                    product.id,
                    imagePath,
                    i === 0
                );

            }

        } else if (req.body.image && typeof req.body.image === "string" && req.body.image.trim()) {

            await productService.addProductImage(
                product.id,
                req.body.image.trim(),
                true
            );

        }


        return res.status(201).json({

            success: true,

            message:
                "Product created successfully",

            product

        });

    } catch (error) {

        console.log(error);

        if (error.code === "ER_DUP_ENTRY" && error.message.includes("products.slug")) {
            return res.status(409).json({
                success: false,
                message: "A product with this slug already exists",
                field: "slug"
            });
        }

        return res.status(500).json({

            success: false,

            message:
                "Failed to create product",

            error: error.message

        });

    }
};

const getProducts = async (req, res) => {

    try {

        const products =
            await productService.getProducts();

        return res.status(200).json({

            success: true,

            products

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch products",

            error: error.message

        });

    }
};

const getProductById = async (req, res) => {

    try {

        const { id } = req.params;

        const result =
            await productService.getProductById(id);


        if (!result.product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        return res.status(200).json({

            success: true,

            product: result.product,

            images: result.images

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch product",

            error: error.message

        });

    }
};


const updateProduct = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            category_id,
            name,
            slug,
            short_description,
            description,
            price,
            discount_price,
            stock,
            sku,
            brand,
            status
        } = req.body;


        if (
            !category_id ||
            !name ||
            !slug ||
            !price ||
            stock === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Required product fields are missing"

            });

        }


        const product =
            await productService.updateProduct(
                id,
                category_id,
                name,
                slug,
                short_description,
                description,
                price,
                discount_price || null,
                stock,
                sku || null,
                brand || null,
                status || "active"
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        let uploadedImages = [];
        if (req.files) {
            if (Array.isArray(req.files)) {
                uploadedImages = req.files;
            } else if (typeof req.files === "object") {
                uploadedImages = Object.values(req.files).flat();
            }
        }
        if (req.file) {
            uploadedImages.push(req.file);
        }

        if (uploadedImages.length > 0) {
            for (let i = 0; i < uploadedImages.length; i++) {
                const imagePath = `/uploads/products/${uploadedImages[i].filename}`;
                await productService.addProductImage(
                    id,
                    imagePath,
                    i === 0
                );
            }
        } else if (req.body.image && typeof req.body.image === "string" && req.body.image.trim()) {
            await productService.addProductImage(
                id,
                req.body.image.trim(),
                true
            );
        }


        return res.status(200).json({

            success: true,

            message:
                "Product updated successfully",

            product

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Failed to update product",

            error: error.message

        });

    }
};


const deleteProduct = async (req, res) => {

    try {

        const { id } = req.params;

        let result =
            await productService.deleteProduct(id);

        if (Array.isArray(result)) {
            result = result[0];
        }


        if (!result.success) {

            return res.status(400).json({

                success: false,

                message: result.message

            });

        }


        return res.status(200).json({

            success: true,

            message: result.message

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Failed to delete product",

            error: error.message

        });

    }
};

const deleteProductImage = async (req, res) => {

    try {

        const { id } = req.params;

        let result =
            await productService.deleteProductImage(id);

        if (Array.isArray(result)) {
            result = result[0];
        }


        return res.status(200).json({

            success: true,

            message: result.message

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Failed to delete product image",

            error: error.message

        });

    }
};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    deleteProductImage
};