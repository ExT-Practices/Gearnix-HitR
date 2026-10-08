import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const ProductModal = ({
    isOpen,
    onClose,
    onSubmit,
    editingProduct,
    categories,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        image: "",
        status: "active",
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        if (editingProduct) {
            const existingImg =
                editingProduct.image ||
                editingProduct.primary_image ||
                editingProduct.image_path ||
                "";

            setFormData({
                name: editingProduct.name || "",
                slug: editingProduct.slug || "",
                description: editingProduct.description || "",
                price: editingProduct.price || "",
                stock: editingProduct.stock || "",
                category_id: editingProduct.category_id || "",
                image: existingImg,
                status: editingProduct.status || "active",
            });
            setImageFile(null);
            setImagePreview(
                existingImg
                    ? existingImg.startsWith("http") || existingImg.startsWith("data:")
                        ? existingImg
                        : `http://localhost:5000${existingImg.startsWith("/") ? "" : "/"}${existingImg}`
                    : ""
            );
        } else {
            setFormData({
                name: "",
                slug: "",
                description: "",
                price: "",
                stock: "",
                category_id: "",
                image: "",
                status: "active",
            });
            setImageFile(null);
            setImagePreview("");
        }
    }, [editingProduct, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "image") {
            setImagePreview(value);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const generateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        setFormData((prev) => ({
            ...prev,
            slug,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Product name is required");
            return;
        }

        if (!formData.price) {
            alert("Product price is required");
            return;
        }

        if (!formData.category_id) {
            alert("Please select a category");
            return;
        }

        const finalSlug =
            formData.slug.trim() ||
            formData.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

        onSubmit(
            {
                ...formData,
                slug: finalSlug,
            },
            imageFile
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
            <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-5 py-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {editingProduct ? "Edit Product" : "Add Product"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col overflow-y-auto"
                >
                    <div className="space-y-3 p-4 text-sm">
                        {/* Row 1: Name & Category */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Product Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Product Name"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Category *
                                </label>

                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                                >
                                    <option value="">Select Category</option>

                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row 2: Price & Stock */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Price (₹) *
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Stock *
                                </label>

                                <input
                                    type="number"
                                    name="stock"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                                />
                            </div>
                        </div>

                        {/* Row 3: Status & Slug */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <label className="text-xs font-medium text-gray-700">
                                        Slug
                                    </label>

                                    <button
                                        type="button"
                                        onClick={generateSlug}
                                        className="text-[11px] font-medium text-blue-600 hover:underline"
                                    >
                                        Auto-generate
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="product-slug"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-2.5">
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                Product Image (Upload File or URL)
                            </label>

                            <div className="flex items-center gap-3">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-12 w-12 flex-shrink-0 rounded-md border border-gray-200 object-cover"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-[10px] text-gray-400">
                                        No Image
                                    </div>
                                )}

                                <div className="flex-1 space-y-1.5">
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-xs text-gray-500 file:mr-2 file:rounded-md file:border-0 file:bg-black file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-gray-800"
                                    />

                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="Or paste image URL"
                                        className="w-full rounded-md border border-gray-300 px-2.5 py-1 text-xs outline-none focus:border-black"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="2"
                                placeholder="Enter description..."
                                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    {/* Footer / Buttons */}
                    <div className="flex justify-end gap-2.5 border-t bg-gray-50/50 px-5 py-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-black px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
                        >
                            {editingProduct ? "Update Product" : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;