export const adminLogout = () => {
    const confirmed = window.confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(
        "adminToken"
    );

    localStorage.removeItem(
        "adminData"
    );

    window.location.href =
        "/admin/login";
};