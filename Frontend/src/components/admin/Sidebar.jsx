import {
    FaHome,
    FaUsers,
    FaBox,
    FaTags,
    FaBlog,
    FaShoppingCart,
    FaCreditCard,
    FaSignOutAlt
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import {
    FaUsersCog,
    FaUserShield
} from "react-icons/fa";
import {
    FaUserCog
} from "react-icons/fa";


const Sidebar = () => {

    const navigate = useNavigate();


    const handleLogout = () => {

        localStorage.removeItem("adminToken");

        navigate("/admin/login");
    };


    const menuItems = [

        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: <FaHome />
        },

        {
            name: "Users",
            path: "/admin/users",
            icon: <FaUsers />
        },

        {
            name: "Categories",
            path: "/admin/categories",
            icon: <FaTags />
        },

        {
            name: "Products",
            path: "/admin/products",
            icon: <FaBox />
        },

        {
            name: "Orders",
            path: "/admin/orders",
            icon: <FaShoppingCart />
        },

        {
            name: "Payments",
            path: "/admin/payments",
            icon: <FaCreditCard />
        },

        {
            name: "Blogs",
            path: "/admin/blogs",
            icon: <FaBlog />
        },

        {
            name: "Roles",
            path: "/admin/roles",
            icon: <FaUserShield />
        },

        {
            name: "Permissions",
            path: "/admin/role-permissions",
            icon: <FaUsersCog />
        },

        {
            name: "Admins",
            path: "/admin/admins",
            icon: <FaUserCog />
        }

    ];


    return (

        <aside className="w-64 min-h-screen bg-gray-900 text-white fixed left-0 top-0">

            {/* Logo */}

            <div className="h-16 flex items-center px-6 border-b border-gray-800">

                <h1 className="text-2xl font-bold">
                    GEARNIX
                </h1>

            </div>


            {/* Navigation */}

            <nav className="p-4 space-y-2">

                {menuItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition
                            ${
                                isActive
                                    ? "bg-white text-gray-900"
                                    : "text-gray-300 hover:bg-gray-800"
                            }`
                        }
                    >

                        <span>
                            {item.icon}
                        </span>

                        <span>
                            {item.name}
                        </span>

                    </NavLink>

                ))}


                {/* Logout */}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 transition mt-5"
                >

                    <FaSignOutAlt />

                    <span>
                        Logout
                    </span>

                </button>

            </nav>

        </aside>
    );
};


export default Sidebar;