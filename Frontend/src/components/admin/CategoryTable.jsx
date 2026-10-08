import React from "react";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";

const CategoryTable = ({
    categories,
    onEdit,
    onDelete,
    onStatusChange,
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            ID
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Category
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Slug
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Products
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
                    {categories.length === 0 ? (
                        <tr>
                            <td
                                colSpan="6"
                                className="px-6 py-10 text-center text-gray-500"
                            >
                                No categories found
                            </td>
                        </tr>
                    ) : (
                        categories.map((category) => (
                            <tr
                                key={category.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 text-sm">
                                    #{category.id}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">
                                        {category.name}
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {category.slug}
                                </td>

                                <td className="px-6 py-4 text-sm">
                                    {category.product_count ?? 0}
                                </td>

                                <td className="px-6 py-4">
                                    <button
                                        onClick={() =>
                                            onStatusChange(
                                                category.id,
                                                category.status
                                            )
                                        }
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${category.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {category.status}
                                    </button>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => onEdit(category)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit"
                                        >
                                            <FiEdit size={18} />
                                        </button>

                                        <button
                                            onClick={() => onDelete(category.id)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;