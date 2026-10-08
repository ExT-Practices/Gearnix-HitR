import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";


const AdminLayout = () => {
    useEffect(() => {
        window.history.pushState(
            null,
            "",
            window.location.href
        );

        const handlePopState = () => {
            window.history.pushState(
                null,
                "",
                window.location.href
            );
        };

        window.addEventListener(
            "popstate",
            handlePopState
        );

        return () => {
            window.removeEventListener(
                "popstate",
                handlePopState
            );
        };
    }, []);

    return (

        <div className="min-h-screen bg-gray-100">

            <Sidebar />


            <div className="ml-64">

                <Topbar />

                <main className="p-6">

                    <Outlet />

                </main>

            </div>

        </div>
    );
};


export default AdminLayout;