import {
    FaEye,
    FaToggleOn,
    FaToggleOff,
    FaEdit
} from "react-icons/fa";


const UserTable = ({
    users,
    onView,
    onEdit,
    onStatusChange
}) => {

    return (

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                ID
                            </th>

                            <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                User
                            </th>

                            <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                Email
                            </th>

                            <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                Phone
                            </th>

                            <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                Status
                            </th>

                            <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                Joined
                            </th>

                            <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {users.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center py-10 text-gray-500"
                                >
                                    No users found
                                </td>

                            </tr>

                        ) : (

                            users.map((user) => (

                                <tr
                                    key={user.id}
                                    className="border-t border-gray-100 hover:bg-gray-50"
                                >

                                    <td className="px-5 py-4 text-sm">
                                        #{user.id}
                                    </td>


                                    <td className="px-5 py-4">

                                        <div>

                                            <p className="font-medium text-gray-900">
                                                {user.name}
                                            </p>

                                        </div>

                                    </td>


                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        {user.email}
                                    </td>


                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        {user.phone || "-"}
                                    </td>


                                    <td className="px-5 py-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                user.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {user.status}
                                        </span>

                                    </td>


                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        {user.created_at
                                            ? new Date(
                                                user.created_at
                                            ).toLocaleDateString()
                                            : "-"
                                        }
                                    </td>


                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            {/* View */}

                                            <button
                                                onClick={() =>
                                                    onView(user.id)
                                                }
                                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                                                title="View User"
                                            >
                                                <FaEye />
                                            </button>

                                            {/* Edit */}
                                            <button
                                                onClick={() => onEdit(user)}
                                                className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                title="Edit User"
                                            >
                                                <FaEdit />
                                            </button>


                                            {/* Status */}

                                            <button
                                                onClick={() =>
                                                    onStatusChange(
                                                        user
                                                    )
                                                }
                                                className={`p-2 rounded-lg ${
                                                    user.status === "active"
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}
                                                title={
                                                    user.status === "active"
                                                        ? "Deactivate"
                                                        : "Activate"
                                                }
                                            >

                                                {user.status === "active"
                                                    ? <FaToggleOn />
                                                    : <FaToggleOff />
                                                }

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};


export default UserTable;