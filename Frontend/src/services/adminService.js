import api from "./api";


// Admin Login
export const adminLogin = async (credentials) => {
    const response = await api.post(
        "/admin/login",
        credentials
    );

    return response.data;
};


// Get admins
export const getAdmins = async () => {

    const response = await api.get(
        "/admin/admins"
    );

    return response.data;
};


// Get roles
export const getAdminRoles = async () => {

    const response = await api.get(
        "/admin/roles"
    );

    return response.data;
};


// Create admin
export const createAdmin = async (data) => {
    const response = await api.post(
        "/admin/admins",
        data
    );

    return response.data;
};


// Update admin
export const updateAdmin = async (adminId, data) => {
    const response = await api.put(
        `/admin/admins/${adminId}`,
        data
    );

    return response.data;
};


// Assign role
export const assignAdminRole = async (
    adminId,
    roleId
) => {

    const response = await api.put(
        `/admin/admins/${adminId}/roles`,
        {
            roleId
        }
    );

    return response.data;
};


// Update status
export const updateAdminStatus = async (
    adminId,
    status
) => {

    const response = await api.put(
        `/admin/admins/${adminId}/status`,
        {
            status
        }
    );

    return response.data;
};


// Delete admin
export const deleteAdmin = async (
    adminId
) => {

    const response = await api.delete(
        `/admin/admins/${adminId}`
    );

    return response.data;
};

// Get admin profile
export const getAdminProfile = async () => {
    const response = await api.get("/admin/profile");

    return response.data;
};

// update admin profile
export const updateAdminProfile = async (profileData) => {
    const response = await api.put(
        "/admin/profile",
        profileData
    );

    return response.data;
};

// change admin password
export const changeAdminPassword = async (passwordData) => {
    const response = await api.put(
        "/admin/change-password",
        passwordData
    );

    return response.data;
};