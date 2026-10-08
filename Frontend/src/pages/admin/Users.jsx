import { useEffect, useState } from "react";
import { FaSearch, FaUsers, FaPlus } from "react-icons/fa";
import api from "../../services/api";
import UserTable from "../../components/admin/UserTable";
import UserDetailsModal from "../../components/admin/UserDetailsModal";
import UserFormModal from "../../components/admin/UserFormModal";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/users");
            setUsers(response.data.users || []);
        } catch (error) {
            console.log("Users error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewUser = async (id) => {
        try {
            const response = await api.get(`/users/${id}`);
            setSelectedUser(response.data.user);
        } catch (error) {
            console.log("User details error:", error);
        }
    };

    const handleStatusChange = async (user) => {
        const newStatus = user.status === "active" ? "inactive" : "active";
        const confirmChange = window.confirm(
            `Are you sure you want to ${newStatus === "active" ? "activate" : "deactivate"} this user?`
        );

        if (!confirmChange) return;

        try {
            await api.put(`/users/${user.id}/status`, { status: newStatus });
            setUsers((prev) =>
                prev.map((item) =>
                    item.id === user.id ? { ...item, status: newStatus } : item
                )
            );
        } catch (error) {
            console.log("Status update error:", error);
        }
    };

    const handleEditUser = (user) => {
        setUserToEdit(user);
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (userToEdit) {
                // Update
                const response = await api.put(`/users/${userToEdit.id}`, formData);
                if (response.data.success) {
                    setUsers((prev) =>
                        prev.map((item) =>
                            item.id === userToEdit.id ? response.data.user : item
                        )
                    );
                }
            } else {
                // Create
                const response = await api.post(`/users`, formData);
                if (response.data.success) {
                    setUsers([response.data.user, ...users]);
                }
            }
            setIsFormModalOpen(false);
            setUserToEdit(null);
        } catch (error) {
            console.error("Form submit error:", error);
            alert("Failed to save user. Please check the console for details.");
        }
    };

    const filteredUsers = users.filter((user) => {
        const searchText = search.toLowerCase();
        return (
            user.name?.toLowerCase().includes(searchText) ||
            user.email?.toLowerCase().includes(searchText) ||
            String(user.id).includes(searchText) ||
            user.phone?.toLowerCase().includes(searchText)
        );
    });

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-gray-900 text-white flex items-center justify-center">
                            <FaUsers />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                            <p className="text-gray-500 text-sm">Manage registered users</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
                        />
                    </div>
                    
                    {/* Add User Button */}
                    <button
                        onClick={() => {
                            setUserToEdit(null);
                            setIsFormModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shrink-0"
                    >
                        <FaPlus />
                        <span className="hidden sm:inline">Add User</span>
                    </button>
                </div>
            </div>

            {/* User Count */}
            <div className="mb-4 text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of{" "}
                <span className="font-semibold text-gray-900">{users.length}</span> users
            </div>

            {/* Loading */}
            {loading ? (
                <div className="bg-white rounded-xl p-10 text-center">
                    <p className="text-gray-500">Loading users...</p>
                </div>
            ) : (
                <UserTable
                    users={filteredUsers}
                    onView={handleViewUser}
                    onEdit={handleEditUser}
                    onStatusChange={handleStatusChange}
                />
            )}

            {/* Details Modal */}
            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}

            {/* Form Modal */}
            <UserFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setUserToEdit(null);
                }}
                onSubmit={handleFormSubmit}
                userToEdit={userToEdit}
            />
        </div>
    );
};

export default Users;