import { useEffect, useState } from "react";

const initialForm = {
    name: "",
    email: "",
    phone: "",
    password: "",
    roleId: ""
};

const AdminFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    roles,
    editingAdmin
}) => {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (editingAdmin) {
            setForm({
                name: editingAdmin.name || "",
                email: editingAdmin.email || "",
                phone: editingAdmin.phone || "",
                password: "",
                roleId: editingAdmin.role_id
                    ? String(editingAdmin.role_id)
                    : ""
            });
        } else {
            setForm(initialForm);
        }
    }, [editingAdmin, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        await onSubmit(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingAdmin
                            ? "Edit Admin"
                            : "Create Admin"}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl text-gray-500 hover:text-red-500"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Enter admin name"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Enter admin email"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required={!editingAdmin}
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                            placeholder={
                                editingAdmin
                                    ? "Leave blank to keep old password"
                                    : "Enter password"
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Select Role
                        </label>

                        <select
                            name="roleId"
                            value={form.roleId}
                            onChange={handleChange}
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                        >
                            <option value="">
                                Select role
                            </option>

                            {roles.map((role) => (
                                <option
                                    key={role.id}
                                    value={role.id}
                                >
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            {editingAdmin
                                ? "Update Admin"
                                : "Create Admin"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminFormModal;