import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const CategoryModal = ({ isOpen, onClose, onSubmit, editingCategory }) => {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        status: "active",
    });

    useEffect(() => {
        if (editingCategory) {
            setFormData({
                name: editingCategory.name || "",
                slug: editingCategory.slug || "",
                status: editingCategory.status || "active",
            });
        } else {
            setFormData({
                name: "",
                slug: "",
                status: "active",
            });
        }
    }, [editingCategory, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Category name is required");
            return;
        }

        const generatedSlug =
            formData.slug.trim() ||
            formData.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");

        onSubmit({
            ...formData,
            slug: generatedSlug,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {editingCategory ? "Edit Category" : "Add Category"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        <FiX size={22} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Name */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Category Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        />
                    </div>

                    {/* Slug */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Slug
                        </label>

                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="category-slug"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        />
                    </div>

                    {/* Status */}
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Status
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            {editingCategory ? "Update Category" : "Add Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
