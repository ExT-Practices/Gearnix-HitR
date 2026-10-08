import { Navigate, Outlet } from "react-router-dom";

import { isTokenExpired } from "../../utils/jwt";

const ProtectedAdminRoute = ({
    children
}) => {
    const token =
        localStorage.getItem("adminToken");

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");

        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }

    if (children) {
        return children;
    }

    return <Outlet />;
};

export default ProtectedAdminRoute;