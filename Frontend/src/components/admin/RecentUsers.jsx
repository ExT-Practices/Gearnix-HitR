const RecentUsers = ({ users }) => {

    return (

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

            <div className="p-5 border-b border-gray-200">

                <h2 className="text-lg font-semibold">
                    Recent Users
                </h2>

            </div>


            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="text-left px-5 py-3 text-sm">
                                Name
                            </th>

                            <th className="text-left px-5 py-3 text-sm">
                                Email
                            </th>

                            <th className="text-left px-5 py-3 text-sm">
                                Status
                            </th>

                            <th className="text-left px-5 py-3 text-sm">
                                Joined
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {users.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="text-center py-8 text-gray-500"
                                >
                                    No users found
                                </td>

                            </tr>

                        ) : (

                            users.map((user) => (

                                <tr
                                    key={user.id}
                                    className="border-t border-gray-100"
                                >

                                    <td className="px-5 py-4">
                                        {user.name}
                                    </td>

                                    <td className="px-5 py-4 text-gray-500">
                                        {user.email}
                                    </td>

                                    <td className="px-5 py-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs
                                            ${
                                                user.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {user.status}
                                        </span>

                                    </td>

                                    <td className="px-5 py-4 text-gray-500">
                                        {new Date(
                                            user.created_at
                                        ).toLocaleDateString()}
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


export default RecentUsers;