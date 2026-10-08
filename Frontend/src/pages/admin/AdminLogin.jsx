import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { adminLogin } from "../../services/adminService";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            setLoading(true);

            const response = await adminLogin({
                email: email.trim(),
                password
            });

            localStorage.setItem("adminToken", response.token);
            localStorage.setItem("adminData", JSON.stringify(response.admin || response.user || {}));

            navigate("/admin/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Admin login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link to="/" className="inline-block text-3xl font-extrabold tracking-wider text-white hover:opacity-90 transition">
                        GEAR<span className="text-blue-500">NIX</span>
                    </Link>
                    <h2 className="mt-3 text-2xl font-bold text-white">Admin Login</h2>
                    <p className="mt-1 text-sm text-gray-400">Sign in to the admin dashboard</p>
                </div>

                <div className="rounded-2xl border border-gray-700/60 bg-gray-800/90 p-8 shadow-2xl backdrop-blur-md">
                    {error && (
                        <div className="mb-6 rounded-xl border border-red-500/50 bg-red-900/40 p-4 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setError("");
                                        setEmail(e.target.value);
                                    }}
                                    required
                                    className="w-full rounded-xl border border-gray-700 bg-gray-900/80 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setError("");
                                        setPassword(e.target.value);
                                    }}
                                    required
                                    className="w-full rounded-xl border border-gray-700 bg-gray-900/80 py-3 pl-11 pr-11 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition duration-200 hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <FaArrowRight className="text-xs" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 border-t border-gray-700/60 pt-6 text-center text-sm text-gray-400">
                        <Link to="/" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
                            Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;