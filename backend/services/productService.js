const db = require("../config/db");


// CREATE PRODUCT
const createProduct = async (
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
) => {

    const [result] = await db.query(
        "CALL sp_create_product(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
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
        ]
    );

    return result[0][0];
};


// GET ALL PRODUCTS
const getProducts = async () => {

    const [result] = await db.query(
        "CALL sp_get_products()"
    );

    return result[0];
};


// GET PRODUCT BY ID
const getProductById = async (id) => {

    const [result] = await db.query(
        "CALL sp_get_product_by_id(?)",
        [id]
    );

    return {
        product: result[0][0],
        images: result[1]
    };
};


// UPDATE PRODUCT
const updateProduct = async (
    id,
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
) => {

    const [result] = await db.query(
        "CALL sp_update_product(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            id,
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
        ]
    );

    return result[0][0];
};


// DELETE PRODUCT
const deleteProduct = async (id) => {

    const [result] = await db.query(
        "CALL sp_delete_product(?)",
        [id]
    );

    return result[0][0];
};


// ADD IMAGE
const addProductImage = async (
    product_id,
    image,
    is_primary
) => {

    const [result] = await db.query(
        "CALL sp_add_product_image(?, ?, ?)",
        [
            product_id,
            image,
            is_primary
        ]
    );

    return result[0][0];
};


// GET IMAGES
const getProductImages = async (product_id) => {

    const [result] = await db.query(
        "CALL sp_get_product_images(?)",
        [product_id]
    );

    return result[0];
};


// DELETE IMAGE
const deleteProductImage = async (id) => {

    const [result] = await db.query(
        "CALL sp_delete_product_image(?)",
        [id]
    );

    return result[0][0];
};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addProductImage,
    getProductImages,
    deleteProductImage
};