import api from "./api";

export const getDashboardData = async () => {
    const response = await api.get(
        "/dashboard"
    );

    return response.data;
};

export const getFilteredDashboard = async (params) => {
    const response = await api.get("/dashboard/filtered", {
        params
    });

    return response.data;
};