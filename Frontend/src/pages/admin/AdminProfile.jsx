import { useEffect, useState } from "react";

import {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword
} from "../../services/adminService";

const AdminProfile = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        role_name: ""
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const loadProfile = async () => {
        try {
            setLoading(true);

            const response =
                await getAdminProfile();

            setProfile(
                response.data || {}
            );
        } catch (error) {
            console.error(
                "Load profile error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load profile"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleProfileChange = (event) => {
        const {
            name,
            value
        } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handlePasswordChange = (event) => {
        const {
            name,
            value
        } = event.target;

        setPasswordForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleProfileSubmit = async (event) => {
        event.preventDefault();

        try {
            await updateAdminProfile({
                name: profile.name,
                email: profile.email,
                phone: profile.phone
            });

            alert(
                "Profile updated successfully"
            );

            await loadProfile();
        } catch (error) {
            console.error(
                "Update profile error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();

        if (
            passwordForm.newPassword !==
            passwordForm.confirmPassword
        ) {
            alert("Passwords do not match");

            return;
        }

        try {
            await changeAdminPassword({
                currentPassword:
                    passwordForm.currentPassword,

                newPassword:
                    passwordForm.newPassword
            });

            alert(
                "Password changed successfully"
            );

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            console.error(
                "Change password error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to change password"
            );
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    My Profile
                </h1>

                <p className="text-sm text-gray-500">
                    Manage your admin account
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <form
                    onSubmit={handleProfileSubmit}
                    className="rounded-xl bg-white p-6 shadow"
                >
                    <h2 className="mb-5 text-xl font-semibold">
                        Profile Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={profile.name || ""}
                                onChange={handleProfileChange}
                                required
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={profile.email || ""}
                                onChange={handleProfileChange}
                                required
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Phone
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={profile.phone || ""}
                                onChange={handleProfileChange}
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Role
                            </label>

                            <input
                                type="text"
                                value={
                                    profile.role_name ||
                                    "Admin"
                                }
                                disabled
                                className="w-full rounded-lg border bg-gray-100 px-3 py-2"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                        >
                            Save Profile
                        </button>
                    </div>
                </form>

                <form
                    onSubmit={handlePasswordSubmit}
                    className="rounded-xl bg-white p-6 shadow"
                >
                    <h2 className="mb-5 text-xl font-semibold">
                        Change Password
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Current Password
                            </label>

                            <input
                                type="password"
                                name="currentPassword"
                                value={
                                    passwordForm.currentPassword
                                }
                                onChange={handlePasswordChange}
                                required
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                New Password
                            </label>

                            <input
                                type="password"
                                name="newPassword"
                                value={
                                    passwordForm.newPassword
                                }
                                onChange={handlePasswordChange}
                                required
                                minLength={6}
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={
                                    passwordForm.confirmPassword
                                }
                                onChange={handlePasswordChange}
                                required
                                minLength={6}
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;