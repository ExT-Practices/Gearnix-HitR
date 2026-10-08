import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

import api from "../../services/api";

import CategoryTable from "../../components/admin/CategoryTable";
import CategoryModal from "../../components/admin/CategoryModal";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingCategory, setEditingCategory] = useState(null);

    // ----------------------------------
    // Fetch Categories
    // ----------------------------------

    const fetchCategories = async () => {
        try {
            setLoading(true);

            const response = await api.get("/categories");

            setCategories(response.data.categories || response.data.data || []);
        } catch (error) {
            console.error(error);

            alert(error.response?.data?.message || "Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // ----------------------------------
    // Add / Update
    // ----------------------------------

    const handleSubmit = async (formData) => {
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory.id}`, formData);

                alert("Category updated successfully");
            } else {
                await api.post("/categories", formData);

                alert("Category added successfully");
            }

            setIsModalOpen(false);
            setEditingCategory(null);

            fetchCategories();
        } catch (error) {
            console.error(error);

            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    // ----------------------------------
    // Edit
    // ----------------------------------

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    // ----------------------------------
    // Delete
    // ----------------------------------

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?",
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/categories/${id}`);

            alert("Category deleted successfully");

            fetchCategories();
        } catch (error) {
            console.error(error);

            alert(error.response?.data?.message || "Failed to delete category");
        }
    };

    // ----------------------------------
    // Status
    // ----------------------------------

    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";

        try {
            await api.put(`/categories/${id}`, {
                status: newStatus,
            });

            fetchCategories();
        } catch (error) {
            console.error(error);

            alert("Failed to update status");
        }
    };

    // ----------------------------------
    // Search
    // ----------------------------------

    const filteredCategories = categories.filter(
        (category) =>
            category.name?.toLowerCase().includes(search.toLowerCase()) ||
            category.slug?.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your product categories
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                    <FiPlus size={18} />
                    Add Category
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search categories..."
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-black"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading categories...
                    </div>
                ) : (
                    <CategoryTable
                        categories={filteredCategories}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                    />
                )}
            </div>

            {/* Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                }}
                onSubmit={handleSubmit}
                editingCategory={editingCategory}
            />
        </div>
    );
};

export default Categories;
