import {
    FiEdit,
    FiTrash2,
} from "react-icons/fi";
import { getImageUrl } from "../../utils/imageUrl";

const BlogTable = ({
    blogs,
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
                            Blog
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Author
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Status
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Created
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {blogs.length === 0 ? (
                        <tr>
                            <td
                                colSpan="6"
                                className="px-6 py-10 text-center text-gray-500"
                            >
                                No blogs found
                            </td>
                        </tr>
                    ) : (
                        blogs.map((blog) => (
                            <tr
                                key={blog.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                            >
                                {/* ID */}
                                <td className="px-6 py-4 text-sm">
                                    #{blog.id}
                                </td>

                                {/* Blog */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                            No Image
                                            {getImageUrl(blog.image) && (
                                                <img
                                                    src={getImageUrl(blog.image)}
                                                    alt=""
                                                    onError={(event) => event.currentTarget.remove()}
                                                    className="absolute inset-0 h-full w-full rounded-lg object-cover"
                                                />
                                            )}
                                        </div>

                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {blog.title}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                /{blog.slug}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Author */}
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {blog.author || "Admin"}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() =>
                                            onStatusChange(
                                                blog.id,
                                                blog.status
                                            )
                                        }
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${blog.status === "published"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {blog.status}
                                    </button>
                                </td>

                                {/* Created */}
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {blog.created_at
                                        ? new Date(
                                            blog.created_at
                                        ).toLocaleDateString("en-IN")
                                        : "-"}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => onEdit(blog)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit"
                                        >
                                            <FiEdit size={18} />
                                        </button>

                                        <button
                                            onClick={() =>
                                                onDelete(blog.id)
                                            }
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

export default BlogTable;