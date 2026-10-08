const blogService =
    require("../services/blogService");


const createBlog = async (req, res) => {

    try {

        const {
            title,
            slug,
            content,
            author,
            status
        } = req.body;

        let image = req.body.image;
        if (req.file) {
            image = `/uploads/blogs/${req.file.filename}`;
        }


        if (!title || !slug || !content) {

            return res.status(400).json({
                success: false,
                message:
                    "Title, slug and content are required"
            });
        }


        const blog =
            await blogService.createBlog(
                title,
                slug,
                content,
                image || null,
                author || "Gearnix",
                status || "draft"
            );


        return res.status(201).json({

            success: true,

            message:
                "Blog created successfully",

            blog

        });

    } catch (error) {

        console.log(error);

        if (error.code === "ER_DUP_ENTRY" && error.message.includes("blogs.slug")) {
            return res.status(409).json({
                success: false,
                message: "A blog with this slug already exists",
                field: "slug"
            });
        }

        return res.status(500).json({

            success: false,

            message:
                "Failed to create blog",

            error: error.message,
            stack: error.stack

        });

    }
};

const getPublishedBlogs = async (req, res) => {

    try {

        const blogs =
            await blogService.getPublishedBlogs();

        return res.status(200).json({

            success: true,

            blogs

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch blogs",

            error: error.message

        });

    }
};

const getBlogById = async (req, res) => {

    try {

        const { id } = req.params;

        const blog =
            await blogService.getBlogById(id);


        if (!blog) {

            return res.status(404).json({

                success: false,

                message:
                    "Blog not found"

            });

        }


        return res.status(200).json({

            success: true,

            blog

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch blog",

            error: error.message

        });

    }
};

const getBlogBySlug = async (req, res) => {

    try {

        const { slug } = req.params;

        const blog =
            await blogService.getBlogBySlug(slug);


        if (!blog) {

            return res.status(404).json({

                success: false,

                message:
                    "Published blog not found"

            });

        }


        return res.status(200).json({

            success: true,

            blog

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch blog",

            error: error.message

        });

    }
};

const getAllBlogsAdmin = async (req, res) => {

    try {

        const blogs =
            await blogService.getAllBlogsAdmin();


        return res.status(200).json({

            success: true,

            blogs

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch admin blogs",

            error: error.message

        });

    }
};

const updateBlog = async (req, res) => {

    try {

        const { id } = req.params;
        const existingBlog = await blogService.getBlogById(id);

        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const title = req.body.title || existingBlog.title;
        const slug = req.body.slug || existingBlog.slug;
        const content = req.body.content?.trim()
            ? req.body.content
            : existingBlog.content;
        const author = req.body.author || existingBlog.author || "Gearnix";
        const status = req.body.status || existingBlog.status || "draft";

        let image = req.body.image || existingBlog.image;
        if (req.file) {
            image = `/uploads/blogs/${req.file.filename}`;
        }


        if (!title || !slug || !content) {

            return res.status(400).json({

                success: false,

                message:
                    "Title, slug and content are required"

            });

        }


        const blog =
            await blogService.updateBlog(
                id,
                title,
                slug,
                content,
                image || null,
                author,
                status
            );


        if (!blog) {

            return res.status(404).json({

                success: false,

                message:
                    "Blog not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Blog updated successfully",

            blog

        });

    } catch (error) {

        console.log(error);

        if (error.code === "ER_DUP_ENTRY" && error.message.includes("blogs.slug")) {
            return res.status(409).json({
                success: false,
                message: "A blog with this slug already exists",
                field: "slug"
            });
        }

        return res.status(500).json({

            success: false,

            message:
                "Failed to update blog",

            error: error.message

        });

    }
};

const deleteBlog = async (req, res) => {

    try {

        const { id } = req.params;

        let result =
            await blogService.deleteBlog(id);

        if (Array.isArray(result)) {
            result = result[0];
        }


        if (!result.success) {

            return res.status(404).json({

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
                "Failed to delete blog",

            error: error.message

        });

    }
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