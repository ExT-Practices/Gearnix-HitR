import { useState } from "react";
import { FiX } from "react-icons/fi";
import { getImageUrl } from "../../utils/imageUrl";

const BlogModal = ({
    isOpen,
    onClose,
    onSubmit,
    editingBlog,
}) => {
    const [formData, setFormData] = useState(() => ({
        title: editingBlog?.title || "",
        slug: editingBlog?.slug || "",
        content: editingBlog?.content || "",
        image: editingBlog?.image || "",
        author: editingBlog?.author || "",
        status: editingBlog?.status || "draft",
    }));
    
    const [imageFile, setImageFile] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        if (e.target.name === "imageFile") {
            setImageFile(e.target.files[0] || null);
            setFormData((current) => ({ ...current, image: "" }));
            return;
        }

        if (e.target.name === "image") {
            setImageFile(null);
        }

        setFormData((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));
    };

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        setFormData({
            ...formData,
            slug,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert("Blog title is required");
            return;
        }

        if (!formData.content.trim()) {
            alert("Blog content is required");
            return;
        }

        const submitData = new FormData();
        submitData.append("title", formData.title);
        submitData.append("slug", formData.slug);
        submitData.append("content", formData.content);
        submitData.append("author", formData.author);
        submitData.append("status", formData.status);
        
        if (imageFile) {
            submitData.append("image", imageFile);
        } else if (formData.image) {
            submitData.append("image", formData.image);
        }

        onSubmit(submitData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
            <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-5 py-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {editingBlog ? "Edit Blog" : "Add Blog"}
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
                        {/* Title & Author */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Blog Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter title"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    placeholder="Author name"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                                />
                            </div>
                        </div>

                        {/* Status & Slug */}
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
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
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
                                    placeholder="blog-slug"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                                />
                            </div>
                        </div>

                        {/* Image */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                Image
                            </label>
                            <input
                                type="file"
                                name="imageFile"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black file:mr-2 file:rounded-md file:border-0 file:bg-black file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-gray-800"
                            />
                            <label className="mb-1 mt-3 block text-xs font-medium text-gray-700">
                                Or use an image URL
                            </label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                            />
                            {formData.image && (
                                <img
                                    src={getImageUrl(formData.image)}
                                    alt="Blog preview"
                                    onError={(event) => {
                                        event.currentTarget.hidden = true;
                                    }}
                                    className="mt-2 h-20 w-28 rounded-md object-cover"
                                />
                            )}
                        </div>

                        {/* Content */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                Content *
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="6"
                                placeholder="Write your blog content..."
                                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
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
                            {editingBlog ? "Update Blog" : "Add Blog"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogModal;