import { Link } from "react-router-dom";
import {
    FiLogOut,
    FiUser
} from "react-icons/fi";

import { adminLogout } from "../../utils/auth";

const Topbar = () => {
    return (
        <header className="flex flex-wrap items-center justify-between gap-4 border-b bg-white px-6 py-4">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">
                    Admin Panel
                </h2>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    to="/admin/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                    <FiUser />

                    My Profile
                </Link>

                {/* <button
                    type="button"
                    onClick={adminLogout}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                >
                    <FiLogOut />

                    Logout
                </button> */}
            </div>
        </header>
    );
};

export default Topbar;
