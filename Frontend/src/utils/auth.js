export const getAdminToken = () => {
    return localStorage.getItem(
        "adminToken"
    );
};

export const getAdminData = () => {
    const adminData =
        localStorage.getItem("adminData");

    if (!adminData) {
        return null;
    }

    try {
        return JSON.parse(adminData);
    } catch (error) {
        return null;
    }
};

export const isAdminLoggedIn = () => {
    return Boolean(
        localStorage.getItem("adminToken")
    );
};

export const adminLogout = () => {
    localStorage.removeItem(
        "adminToken"
    );

    localStorage.removeItem(
        "adminData"
    );

    window.location.href =
        "/admin/login";
};