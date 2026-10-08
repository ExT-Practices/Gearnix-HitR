// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:5000/api",
// });

// api.interceptors.request.use(
//     (config) => {

//         // Get admin token
//         const adminToken =
//             localStorage.getItem("adminToken");

//         // Get customer token
//         const customerToken =
//             localStorage.getItem("customerToken");

//         // Dashboard/admin APIs use admin token
//         const isAdminRoute =
//             typeof window !== "undefined" &&
//             window.location?.pathname?.startsWith("/admin");

//         const isAdminEndpoint =
//             config.url?.startsWith("/dashboard") ||
//             config.url?.startsWith("/admin") ||
//             config.url?.startsWith("/users") ||
//             config.url?.includes("/admin");

//         if (isAdminRoute || isAdminEndpoint) {
//             if (adminToken) {
//                 config.headers.Authorization =
//                     `Bearer ${adminToken}`;
//             }
//         } else {
//             // Customer APIs
//             if (customerToken) {
//                 config.headers.Authorization =
//                     `Bearer ${customerToken}`;
//             }
//         }

//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//             const isAuthReq = error.config?.url?.includes("/login") || error.config?.url?.includes("/auth");
//             const isAdminPath = typeof window !== "undefined" && window.location?.pathname?.startsWith("/admin");
            
//             if (isAdminPath && !isAuthReq) {
//                 console.warn("Admin authorization failed (401/403). Clearing admin token.");
//                 localStorage.removeItem("adminToken");
//                 if (window.location.pathname !== "/admin/login") {
//                     window.location.href = "/admin/login";
//                 }
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// export default api;

import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {
        const adminToken =
            localStorage.getItem("adminToken");

        const customerToken =
            localStorage.getItem("customerToken") ||
            localStorage.getItem("token");

        const isAdminRoute =
            typeof window !== "undefined" &&
            window.location?.pathname?.startsWith("/admin");

        const isAdminEndpoint =
            config.url?.startsWith("/dashboard") ||
            config.url?.startsWith("/admin") ||
            config.url?.includes("/admin");

        if (isAdminRoute || isAdminEndpoint) {
            if (adminToken) {
                config.headers.Authorization =
                    `Bearer ${adminToken}`;
            }
        } else {
            if (customerToken) {
                config.headers.Authorization =
                    `Bearer ${customerToken}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (
            error.response?.status === 401 &&
            error.response?.data?.message
                ?.toLowerCase()
                .includes("token")
        ) {
            const adminToken =
                localStorage.getItem("adminToken");

            if (adminToken) {
                localStorage.removeItem(
                    "adminToken"
                );

                localStorage.removeItem(
                    "adminData"
                );

                window.location.href =
                    "/admin/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;