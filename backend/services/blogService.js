const db = require("../config/db");


// CREATE
const createBlog = async (
    title,
    slug,
    content,
    image,
    author,
    status
) => {

    const [result] = await db.query(
        "CALL sp_create_blog(?, ?, ?, ?, ?, ?)",
        [
            title,
            slug,
            content,
            image,
            author,
            status
        ]
    );

    return result[0][0];
};


// PUBLIC BLOGS
const getPublishedBlogs = async () => {

    const [result] = await db.query(
        "CALL sp_get_published_blogs()"
    );

    return result[0];
};


// BLOG BY ID
const getBlogById = async (id) => {

    const [rows] = await db.query(
        `SELECT
            id,
            title,
            slug,
            short_description,
            content,
            image,
            author,
            status,
            created_at,
            updated_at
        FROM blogs
        WHERE id = ?
        LIMIT 1`,
        [id]
    );

    return rows[0];
};


// BLOG BY SLUG
const getBlogBySlug = async (slug) => {

    const [result] = await db.query(
        "CALL sp_get_blog_by_slug(?)",
        [slug]
    );

    return result[0][0];
};


// ADMIN ALL BLOGS
const getAllBlogsAdmin = async () => {

    const [result] = await db.query(
        "CALL sp_get_all_blogs_admin()"
    );

    return result[0];
};


// UPDATE
const updateBlog = async (
    id,
    title,
    slug,
    content,
    image,
    author,
    status
) => {

    const [result] = await db.query(
        "CALL sp_update_blog(?, ?, ?, ?, ?, ?, ?)",
        [
            id,
            title,
            slug,
            content,
            image,
            author,
            status
        ]
    );

    return result[0][0];
};


// DELETE
const deleteBlog = async (id) => {

    const [result] = await db.query(
        "CALL sp_delete_blog(?)",
        [id]
    );

    return result[0][0];
};


module.exports = {
    createBlog,
    getPublishedBlogs,
    getBlogById,
    getBlogBySlug,
    getAllBlogsAdmin,
    updateBlog,
    deleteBlog
};