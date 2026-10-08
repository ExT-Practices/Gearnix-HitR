import { useEffect, useState } from "react";
import {
    FiPlus,
    FiSearch,
} from "react-icons/fi";

import api from "../../services/api";

import BlogTable from "../../components/admin/BlogTable";
import BlogModal from "../../components/admin/BlogModal";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [editingBlog, setEditingBlog] =
        useState(null);

    // -------------------------------
    // Fetch Blogs
    // -------------------------------

    const fetchBlogs = async () => {
        try {
            setLoading(true);

            const response =
                await api.get("/blogs/admin/all");

            setBlogs(response.data.blogs || []);
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to load blogs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // -------------------------------
    // Add / Update
    // -------------------------------

    const handleSubmit = async (formData) => {
        try {
            if (editingBlog) {
                await api.put(
                    `/blogs/${editingBlog.id}`,
                    formData
                );

                alert("Blog updated successfully");
            } else {
                await api.post(
                    "/blogs",
                    formData
                );

                alert("Blog added successfully");
            }

            setIsModalOpen(false);
            setEditingBlog(null);

            fetchBlogs();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    // -------------------------------
    // Edit
    // -------------------------------

    const handleEdit = async (blog) => {
        try {
            const response = await api.get(`/blogs/${blog.id}`);
            const fullBlog = response.data.blog || blog;

            setEditingBlog({
                ...blog,
                ...fullBlog,
                content: fullBlog.content ?? blog.content ?? "",
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to load blog content");
        }
    };

    // -------------------------------
    // Delete
    // -------------------------------

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this blog?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/blogs/${id}`);

            alert("Blog deleted successfully");

            fetchBlogs();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete blog"
            );
        }
    };

    // -------------------------------
    // Status
    // -------------------------------

    const handleStatusChange = async (
        id,
        currentStatus
    ) => {
        const newStatus =
            currentStatus === "published"
                ? "draft"
                : "published";

        try {
            await api.put(`/blogs/${id}`, {
                status: newStatus,
            });

            fetchBlogs();
        } catch (error) {
            console.error(error);

            alert("Failed to update blog status");
        }
    };

    // -------------------------------
    // Search
    // -------------------------------

    const filteredBlogs = blogs.filter(
        (blog) =>
            blog.title
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            blog.slug
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            blog.author
                ?.toLowerCase()
                .includes(search.toLowerCase())
    );

    return (
        <div className="p-6">

            {/* Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Blogs
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your store blogs
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingBlog(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                    <FiPlus size={18} />
                    Add Blog
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
                <div className="relative max-w-md">
                    <FiSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />

                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-black"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading blogs...
                    </div>
                ) : (
                    <BlogTable
                        blogs={filteredBlogs}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                    />
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <BlogModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingBlog(null);
                    }}
                    onSubmit={handleSubmit}
                    editingBlog={editingBlog}
                />
            )}

        </div>
    );
};

export default Blogs;