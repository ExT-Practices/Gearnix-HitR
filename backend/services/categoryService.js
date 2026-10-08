const db = require("../config/db");


const createCategory = async (
    name,
    slug,
    description,
    image
) => {

    const [result] = await db.query(
        "CALL sp_create_category(?, ?, ?, ?)",
        [
            name,
            slug,
            description,
            image
        ]
    );

    return result[0][0];
};


const getCategories = async () => {

    const [result] = await db.query(
        "CALL sp_get_categories()"
    );

    return result[0];
};


const getCategoryById = async (id) => {

    const [result] = await db.query(
        "CALL sp_get_category_by_id(?)",
        [id]
    );

    return result[0][0];
};


const updateCategory = async (
    id,
    name,
    slug,
    description,
    image,
    status
) => {

    const [result] = await db.query(
        "CALL sp_update_category(?, ?, ?, ?, ?, ?)",
        [
            id,
            name,
            slug,
            description,
            image,
            status
        ]
    );

    return result[0][0];
};


const deleteCategory = async (id) => {

    const [result] = await db.query(
        "CALL sp_delete_category(?)",
        [id]
    );

    return result[0][0];
};


module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};