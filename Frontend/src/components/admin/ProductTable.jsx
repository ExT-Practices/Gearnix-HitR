import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { getImageUrl } from "../../utils/imageUrl";

const ProductTable = ({ products, onEdit, onDelete, onStatusChange }) => {
    const getImageSrc = (product) => {
        return getImageUrl(
            product.primary_image ||
            product.image ||
            product.image_path
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            ID
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Product
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Category
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Price
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Stock
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Status
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                No products found
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => {
                            const imageSrc = getImageSrc(product);

                            return (
                                <tr
                                    key={product.id}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    {/* ID */}
                                    <td className="px-6 py-4 text-sm">#{product.id}</td>

                                    {/* Product */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={product.name}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                                    No Image
                                                </div>
                                            )}

                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {product.name}
                                                </p>

                                                <p className="text-xs text-gray-500">{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {product.category_name || "N/A"}
                                    </td>

                                    {/* Price */}
                                    <td className="px-6 py-4 text-sm font-medium">
                                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                                    </td>

                                    {/* Stock */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={
                                                product.stock <= 5
                                                    ? "font-semibold text-red-600"
                                                    : "text-gray-700"
                                            }
                                        >
                                            {product.stock}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => onStatusChange(product.id, product.status)}
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${product.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {product.status}
                                        </button>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <FiEdit size={18} />
                                            </button>

                                            <button
                                                onClick={() => onDelete(product.id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
