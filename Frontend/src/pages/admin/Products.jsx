import React, { useEffect, useState } from "react";
import {
    FiPlus,
    FiSearch,
} from "react-icons/fi";

import api from "../../services/api";

import ProductTable from "../../components/admin/ProductTable";
import ProductModal from "../../components/admin/ProductModal";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [editingProduct, setEditingProduct] =
        useState(null);

    // ----------------------------------
    // Fetch Products
    // ----------------------------------

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await api.get("/products");

            setProducts(response.data.products || response.data.data || []);
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to load products"
            );
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------
    // Fetch Categories
    // ----------------------------------

    const fetchCategories = async () => {
        try {
            const response =
                await api.get("/categories");

            setCategories(response.data.categories || response.data.data || []);
        } catch (error) {
            console.error(error);

            alert("Failed to load categories");
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // ----------------------------------
    // Add / Update Product
    // ----------------------------------

    const handleSubmit = async (formData, imageFile) => {
        try {
            let payload;

            if (imageFile) {
                payload = new FormData();
                Object.keys(formData).forEach((key) => {
                    if (formData[key] !== null && formData[key] !== undefined) {
                        payload.append(key, formData[key]);
                    }
                });
                payload.append("image", imageFile);
            } else {
                payload = formData;
            }

            if (editingProduct) {
                await api.put(
                    `/products/${editingProduct.id}`,
                    payload
                );

                alert("Product updated successfully");
            } else {
                await api.post(
                    "/products",
                    payload
                );

                alert("Product added successfully");
            }

            setIsModalOpen(false);
            setEditingProduct(null);

            fetchProducts();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    // ----------------------------------
    // Edit
    // ----------------------------------

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    // ----------------------------------
    // Delete
    // ----------------------------------

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/products/${id}`);

            alert("Product deleted successfully");

            fetchProducts();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };

    // ----------------------------------
    // Status
    // ----------------------------------

    const handleStatusChange = async (
        id,
        currentStatus
    ) => {
        const newStatus =
            currentStatus === "active"
                ? "inactive"
                : "active";

        try {
            await api.put(`/products/${id}`, {
                status: newStatus,
            });

            fetchProducts();
        } catch (error) {
            console.error(error);

            alert("Failed to update product status");
        }
    };

    // ----------------------------------
    // Search
    // ----------------------------------

    const filteredProducts = products.filter(
        (product) =>
            product.name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            product.slug
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            product.category_name
                ?.toLowerCase()
                .includes(search.toLowerCase())
    );

    return (
        <div className="p-6">

            {/* Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Products
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your store products
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                    <FiPlus size={18} />
                    Add Product
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
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search products..."
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-black"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading products...
                    </div>
                ) : (
                    <ProductTable
                        products={filteredProducts}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                    />
                )}
            </div>

            {/* Modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                }}
                onSubmit={handleSubmit}
                editingProduct={editingProduct}
                categories={categories}
            />
        </div>
    );
};

export default Products;