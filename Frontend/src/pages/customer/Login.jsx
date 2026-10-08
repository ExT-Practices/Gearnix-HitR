import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import api from "../../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await api.post("/customer/auth/login", {
        email: email.trim(),
        password,
      });

      const { token, customer, user } = response.data;

      localStorage.setItem("customerToken", token);
      localStorage.setItem("customerUser", JSON.stringify(customer || user));

      navigate("/products");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        try {
          const { adminLogin } = await import("../../services/adminService");
          const adminResponse = await adminLogin({
            email: email.trim(),
            password,
          });

          localStorage.setItem("adminToken", adminResponse.token);
          localStorage.setItem("adminData", JSON.stringify(adminResponse.admin || adminResponse.user || {}));
          
          navigate("/admin/dashboard");
          return;
        } catch (adminErr) {
          setError(adminErr.response?.data?.message || "Invalid email or password. Please try again.");
        }
      } else {
        setError(err.response?.data?.message || "Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-600 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="text-3xl font-bold tracking-tight text-slate-900">
            <img src="https://nov-gearnix.myshopify.com/cdn/shop/files/Logo_white.png?v=1722670258&width=300" alt="" className="mx-auto h-12 w-auto" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-800">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Login to your account</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <FaExclamationCircle className="text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-600">
                Email address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setError("");
                    setEmail(e.target.value);
                  }}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-600">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setError("");
                    setPassword(e.target.value);
                  }}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-5 border-t border-slate-200 pt-4 text-center text-sm text-slate-500 flex flex-col gap-2">
            <div>
              Don’t have an account?{" "}
              <Link to="/register" className="font-medium text-slate-800 underline-offset-2 hover:underline">
                Register
              </Link>
            </div>
            <div>
              Are you an administrator?{" "}
              <Link to="/admin/login" className="font-medium text-blue-600 underline-offset-2 hover:underline">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;