import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";

import AdminFormModal from "../../components/admin/AdminFormModal";

import {
    getAdmins,
    getAdminRoles,
    createAdmin,
    updateAdmin,
    updateAdminStatus,
    deleteAdmin
} from "../../services/adminService";

const fetchAdminData = async () => {
    const [adminsResponse, rolesResponse] =
        await Promise.all([
            getAdmins(),
            getAdminRoles()
        ]);

    return {
        admins: adminsResponse.data ||
            adminsResponse.admins ||
            [],
        roles: rolesResponse.data ||
            rolesResponse.roles ||
            []
    };
};

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [roles, setRoles] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);

    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await fetchAdminData();
            setAdmins(data.admins);
            setRoles(data.roles);
        } catch (error) {
            console.error("Load admin data error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load admin data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            try {
                const data = await fetchAdminData();
                if (isMounted) {
                    setAdmins(data.admins);
                    setRoles(data.roles);
                }
            } catch (error) {
                console.error("Load admin data error:", error);

                if (isMounted) {
                    alert(
                        error.response?.data?.message ||
                        "Failed to load admin data"
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleCreate = () => {
        setEditingAdmin(null);
        setIsModalOpen(true);
    };

    const handleEdit = (admin) => {
        setEditingAdmin(admin);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingAdmin) {
                await updateAdmin(
                    editingAdmin.id,
                    formData
                );

                alert("Admin updated successfully");
            } else {
                await createAdmin(formData);

                alert("Admin created successfully");
            }

            setIsModalOpen(false);
            setEditingAdmin(null);

            await loadData();
        } catch (error) {
            console.error("Save admin error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to save admin"
            );
        }
    };

    const handleStatusChange = async (admin) => {
        const nextStatus =
            admin.status === "active"
                ? "inactive"
                : "active";

        try {
            await updateAdminStatus(
                admin.id,
                nextStatus
            );

            await loadData();
        } catch (error) {
            console.error("Status update error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update status"
            );
        }
    };

    const handleDelete = async (adminId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this admin?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteAdmin(adminId);

            alert("Admin deleted successfully");

            await loadData();
        } catch (error) {
            console.error("Delete admin error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete admin"
            );
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Admin Management
                    </h1>

                    <p className="text-sm text-gray-500">
                        Create admins and assign roles
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <FiPlus />

                    Create Admin
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl bg-white shadow">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-5 py-3">
                                ID
                            </th>

                            <th className="px-5 py-3">
                                Name
                            </th>

                            <th className="px-5 py-3">
                                Email
                            </th>

                            <th className="px-5 py-3">
                                Phone
                            </th>

                            <th className="px-5 py-3">
                                Role
                            </th>

                            <th className="px-5 py-3">
                                Status
                            </th>

                            <th className="px-5 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-5 py-6 text-center"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : admins.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-5 py-6 text-center text-gray-500"
                                >
                                    No admins found
                                </td>
                            </tr>
                        ) : (
                            admins.map((admin) => (
                                <tr
                                    key={admin.id}
                                    className="border-t"
                                >
                                    <td className="px-5 py-3">
                                        {admin.id}
                                    </td>

                                    <td className="px-5 py-3 font-medium">
                                        {admin.name}
                                    </td>

                                    <td className="px-5 py-3">
                                        {admin.email}
                                    </td>

                                    <td className="px-5 py-3">
                                        {admin.phone || "-"}
                                    </td>

                                    <td className="px-5 py-3">
                                        {admin.role_name ||
                                            admin.role ||
                                            "No role"}
                                    </td>

                                    <td className="px-5 py-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange(
                                                    admin
                                                )
                                            }
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                admin.status ===
                                                "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {admin.status}
                                        </button>
                                    </td>

                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        admin
                                                    )
                                                }
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit admin"
                                            >
                                                <FiEdit />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        admin.id
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-800"
                                                title="Delete admin"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AdminFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingAdmin(null);
                }}
                onSubmit={handleSubmit}
                roles={roles}
                editingAdmin={editingAdmin}
            />
        </div>
    );
};

export default AdminManagement;
