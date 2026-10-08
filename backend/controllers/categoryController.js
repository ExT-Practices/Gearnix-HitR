const categoryService = require("../services/categoryService");

// create

const createCategory = async (req, res) => {

    try {

        const {
            name,
            slug,
            description,
            image
        } = req.body;

        if (!name || !slug) {

            return res.status(400).json({
                success: false,
                message: "Name and slug are required"
            });
        }

        const category =
            await categoryService.createCategory(
                name,
                slug,
                description,
                image
            );

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: error.message
        });
    }
};

// Get All

const getCategories = async (req, res) => {

    try {

        const categories =
            await categoryService.getCategories();

        return res.status(200).json({
            success: true,
            categories
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};

// Get by ID\
const getCategoryById = async (req, res) => {

    try {

        const { id } = req.params;

        const category =
            await categoryService.getCategoryById(id);

        if (!category) {

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            category
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch category",
            error: error.message
        });
    }
};

// Update

const updateCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            slug,
            description,
            image,
            status
        } = req.body;

        if (!name || !slug) {

            return res.status(400).json({
                success: false,
                message: "Name and slug are required"
            });
        }

        const category =
            await categoryService.updateCategory(
                id,
                name,
                slug,
                description,
                image,
                status
            );

        if (!category) {

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to update category",
            error: error.message
        });
    }
};

// delete

const deleteCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const result =
            await categoryService.deleteCategory(id);

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
            message: "Failed to delete category",
            error: error.message
        });
    }
};


module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
