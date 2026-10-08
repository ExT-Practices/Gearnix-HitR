import { FaTimes } from "react-icons/fa";


const UserDetailsModal = ({
    user,
    onClose
}) => {

    if (!user) {
        return null;
    }


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">

                {/* Header */}

                <div className="flex items-center justify-between px-6 py-4 border-b">

                    <h2 className="text-xl font-semibold">
                        User Details
                    </h2>


                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <FaTimes />
                    </button>

                </div>


                {/* Content */}

                <div className="p-6 space-y-5">

                    <div>

                        <p className="text-sm text-gray-500">
                            Name
                        </p>

                        <p className="font-medium mt-1">
                            {user.name}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p className="font-medium mt-1">
                            {user.email}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-gray-500">
                            Phone
                        </p>

                        <p className="font-medium mt-1">
                            {user.phone || "-"}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-gray-500">
                            Address
                        </p>

                        <p className="font-medium mt-1">
                            {user.address || "-"}
                        </p>

                    </div>


                    <div className="grid grid-cols-3 gap-4">

                        <div>

                            <p className="text-sm text-gray-500">
                                City
                            </p>

                            <p className="font-medium mt-1">
                                {user.city || "-"}
                            </p>

                        </div>


                        <div>

                            <p className="text-sm text-gray-500">
                                State
                            </p>

                            <p className="font-medium mt-1">
                                {user.state || "-"}
                            </p>

                        </div>


                        <div>

                            <p className="text-sm text-gray-500">
                                Pincode
                            </p>

                            <p className="font-medium mt-1">
                                {user.pincode || "-"}
                            </p>

                        </div>

                    </div>


                    <div>

                        <p className="text-sm text-gray-500">
                            Status
                        </p>

                        <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                                user.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {user.status}
                        </span>

                    </div>


                    <div>

                        <p className="text-sm text-gray-500">
                            Joined
                        </p>

                        <p className="font-medium mt-1">
                            {user.created_at
                                ? new Date(
                                    user.created_at
                                ).toLocaleString()
                                : "-"
                            }
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default UserDetailsModal;