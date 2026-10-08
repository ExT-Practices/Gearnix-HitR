import { useEffect, useState } from "react";

import {
    getRoles,
    getModulesWithPermissions,
    getRolePermissions,
    saveRolePermissions
} from "../../services/roleService";


const RolePermissions = () => {

    // ==============================
    // STATE
    // ==============================

    const [roles, setRoles] = useState([]);

    const [modules, setModules] = useState([]);

    const [selectedRole, setSelectedRole] = useState("");

    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);


    // ==============================
    // LOAD ROLES + MODULES
    // ==============================

    useEffect(() => {

        const loadData = async () => {

            try {

                const [
                    rolesResponse,
                    modulesResponse
                ] = await Promise.all([
                    getRoles(),
                    getModulesWithPermissions()
                ]);


                console.log(
                    "Roles response:",
                    rolesResponse
                );

                console.log(
                    "Modules response:",
                    modulesResponse
                );


                // ------------------------------
                // Roles
                // ------------------------------

                setRoles(
                    rolesResponse.data || []
                );


                // ------------------------------
                // Modules
                // ------------------------------

                setModules(
                    modulesResponse.data || []
                );


            } catch (error) {

                console.error(
                    "Load permission data error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, []);


    // ==============================
    // LOAD ROLE PERMISSIONS
    // ==============================

    useEffect(() => {

        if (!selectedRole) {

            setSelectedPermissions([]);

            return;

        }


        const loadPermissions = async () => {

            try {

                const response =
                    await getRolePermissions(
                        selectedRole
                    );


                console.log(
                    "Role permissions response:",
                    response
                );


                /*
                    API response:

                    {
                        success: true,
                        data: [
                            {
                                permission_id: 2
                            },
                            {
                                permission_id: 16
                            }
                        ]
                    }
                */


                const ids =
                    (response.data || [])
                        .map(
                            (item) =>
                                Number(
                                    item.permission_id
                                )
                        );


                setSelectedPermissions(ids);


            } catch (error) {

                console.error(
                    "Load role permissions error:",
                    error
                );

                setSelectedPermissions([]);

            }

        };


        loadPermissions();

    }, [selectedRole]);


    // ==============================
    // TOGGLE PERMISSION
    // ==============================

    const togglePermission = (
        permissionId
    ) => {

        const id = Number(permissionId);


        setSelectedPermissions(
            (previous) => {

                if (
                    previous.includes(id)
                ) {

                    return previous.filter(
                        (previousId) =>
                            previousId !== id
                    );

                }


                return [
                    ...previous,
                    id
                ];

            }
        );

    };


    // ==============================
    // SAVE PERMISSIONS
    // ==============================

    const handleSave = async () => {

        if (!selectedRole) {

            alert(
                "Please select a role"
            );

            return;

        }


        try {

            setSaving(true);


            await saveRolePermissions(
                selectedRole,
                selectedPermissions
            );


            alert(
                "Permissions saved successfully"
            );


        } catch (error) {

            console.error(
                "Save permissions error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to save permissions"
            );


        } finally {

            setSaving(false);

        }

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (
            <div className="p-6">
                Loading...
            </div>
        );

    }


    // ==============================
    // UI
    // ==============================

    return (

        <div className="p-6">

            {/* =================================
                PAGE HEADER
            ================================= */}

            <div className="mb-6">

                <h1 className="text-2xl font-bold">
                    Role Permissions
                </h1>

                <p className="text-gray-500">
                    Assign module and action permissions
                </p>

            </div>


            {/* =================================
                ROLE SELECTION
            ================================= */}

            <div className="bg-white rounded-xl shadow p-5 mb-6">

                <label className="block font-medium mb-2">
                    Select Role
                </label>


                <select
                    value={selectedRole}
                    onChange={(e) =>
                        setSelectedRole(
                            e.target.value
                        )
                    }
                    className="w-full md:w-96 border rounded-lg p-3"
                >

                    <option value="">
                        -- Select Role --
                    </option>


                    {roles
                        .filter(
                            (role) =>
                                role.slug !==
                                "super_admin"
                        )
                        .map((role) => (

                            <option
                                key={role.id}
                                value={role.id}
                            >
                                {role.name}
                            </option>

                        ))}

                </select>

            </div>


            {/* =================================
                MODULES + PERMISSIONS
            ================================= */}

            {selectedRole && (

                <div className="space-y-4">

                    {modules.map((module) => (

                        <div
                            key={module.id}
                            className="bg-white rounded-xl shadow"
                        >

                            {/* ==========================
                                MODULE HEADER
                            ========================== */}

                            <div className="px-5 py-4 border-b">

                                <h2 className="font-semibold text-lg">
                                    {module.name}
                                </h2>

                            </div>


                            {/* ==========================
                                PERMISSIONS
                            ========================== */}

                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                {module.permissions?.map(
                                    (permission) => {

                                        const permissionId =
                                            Number(
                                                permission.id
                                            );


                                        return (

                                            <label
                                                key={
                                                    permission.id
                                                }
                                                className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedPermissions.includes(
                                                            permissionId
                                                        )
                                                    }
                                                    onChange={() =>
                                                        togglePermission(
                                                            permissionId
                                                        )
                                                    }
                                                    className="w-4 h-4"
                                                />


                                                <span className="capitalize">
                                                    {
                                                        permission.action
                                                    }
                                                </span>

                                            </label>

                                        );

                                    }
                                )}

                            </div>

                        </div>

                    ))}


                    {/* =================================
                        SAVE BUTTON
                    ================================= */}

                    <div className="flex justify-end pt-2">

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 bg-black text-white rounded-lg disabled:opacity-50"
                        >

                            {saving
                                ? "Saving..."
                                : "Save Permissions"}

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

};


export default RolePermissions;