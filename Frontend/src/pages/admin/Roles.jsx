import { useEffect, useState } from "react";
import {
    getRoles,
    createRole,
    updateRole,
    deleteRole
} from "../../services/roleService";

import {
    FaPlus,
    FaEdit,
    FaTrash
} from "react-icons/fa";


const Roles = () => {

    const [roles, setRoles] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [showModal, setShowModal] =
        useState(false);

    const [editingRole, setEditingRole] =
        useState(null);

    const [formData, setFormData] = useState({
        name: "",
        slug: ""
    });


    const loadRoles = async () => {

        try {

            setLoading(true);

            const response =
                await getRoles();

            setRoles(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Load roles error:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadRoles();

    }, []);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });
    };


    const openCreateModal = () => {

        setEditingRole(null);

        setFormData({
            name: "",
            slug: ""
        });

        setShowModal(true);
    };


    const openEditModal = (role) => {

        setEditingRole(role);

        setFormData({
            name: role.name || "",
            slug: role.slug || ""
        });

        setShowModal(true);
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingRole) {

                await updateRole(
                    editingRole.id,
                    formData
                );

            } else {

                await createRole(
                    formData
                );
            }

            setShowModal(false);

            await loadRoles();

        } catch (error) {

            console.error(
                "Save role error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to save role"
            );
        }
    };


    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this role?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteRole(id);

            await loadRoles();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete role"
            );
        }
    };


    if (loading) {

        return (
            <div className="p-6">
                Loading roles...
            </div>
        );
    }


    return (

        <div className="p-6">

            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-2xl font-bold">
                        Roles
                    </h1>

                    <p className="text-gray-500">
                        Manage admin roles and permissions
                    </p>
                </div>


                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
                >
                    <FaPlus />
                    Create Role
                </button>

            </div>


            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-4 text-left">
                                #
                            </th>

                            <th className="p-4 text-left">
                                Role
                            </th>

                            <th className="p-4 text-left">
                                Slug
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                            <th className="p-4 text-left">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {roles.map(
                            (role, index) => (

                                <tr
                                    key={role.id}
                                    className="border-t"
                                >

                                    <td className="p-4">
                                        {index + 1}
                                    </td>

                                    <td className="p-4 font-medium">
                                        {role.name}
                                    </td>

                                    <td className="p-4">
                                        {role.slug}
                                    </td>

                                    <td className="p-4">
                                        {role.status}
                                    </td>

                                    <td className="p-4">

                                        <div className="flex gap-3">

                                            <button
                                                onClick={() =>
                                                    openEditModal(role)
                                                }
                                                className="text-blue-600"
                                            >
                                                <FaEdit />
                                            </button>


                                            {role.slug !==
                                                "super_admin" && (

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            role.id
                                                        )
                                                    }
                                                    className="text-red-600"
                                                >
                                                    <FaTrash />
                                                </button>

                                            )}

                                        </div>

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>


            {showModal && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-xl p-6 w-full max-w-md"
                    >

                        <h2 className="text-xl font-bold mb-5">

                            {editingRole
                                ? "Edit Role"
                                : "Create Role"}

                        </h2>


                        <div className="mb-4">

                            <label className="block mb-2">
                                Role Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                                placeholder="Blog Manager"
                                required
                            />

                        </div>


                        <div className="mb-5">

                            <label className="block mb-2">
                                Slug
                            </label>

                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                                placeholder="blog_manager"
                                required
                            />

                        </div>


                        <div className="flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="px-4 py-2 bg-black text-white rounded-lg"
                            >
                                Save
                            </button>

                        </div>

                    </form>

                </div>

            )}

        </div>
    );
};

export default Roles;