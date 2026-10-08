import api from "./api";


// Get all roles
export const getRoles = async () => {
    const response = await api.get(
        "/admin/roles"
    );

    return response.data;
};


// Get single role
export const getRoleById = async (id) => {
    const response = await api.get(
        `/admin/roles/${id}`
    );

    return response.data;
};


// Create role
export const createRole = async (data) => {
    const response = await api.post(
        "/admin/roles",
        data
    );

    return response.data;
};


// Update role
export const updateRole = async (
    id,
    data
) => {

    const response = await api.put(
        `/admin/roles/${id}`,
        data
    );

    return response.data;
};


// Delete role
export const deleteRole = async (id) => {

    const response = await api.delete(
        `/admin/roles/${id}`
    );

    return response.data;
};


// Get modules and permissions
export const getModulesWithPermissions =
    async () => {

        const response = await api.get(
            "/admin/permissions/modules"
        );

        return response.data;
    };


// Get role permissions
export const getRolePermissions =
    async (roleId) => {

        const response = await api.get(
            `/admin/roles/${roleId}/permissions`
        );

        return response.data;
    };


// Save role permissions
export const saveRolePermissions =
    async (
        roleId,
        permissionIds
    ) => {

        const response = await api.put(
            `/admin/roles/${roleId}/permissions`,
            {
                permissionIds
            }
        );

        return response.data;
    };