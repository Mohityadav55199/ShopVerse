import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "signin";

  const [activeTab, setActiveTab] = useState(initialTab); // "signin" | "register"
  const [selectedRole, setSelectedRole] = useState("customer"); // "customer" | "vendor" | "admin"

  const [formData, setFormData] = useState({
    username: "",
    email: "customer@example.com",
    password: "password123",
    role: "customer",
  });

  const [formError, setFormError] = useState("");
  const { login, register, loading } = useAppContext();
  const navigate = useNavigate();

  // Demo Account credentials mapping
  const demoAccounts = {
    customer: {
      email: "customer@example.com",
      password: "password123",
      role: "customer",
    },
    vendor: {
      email: "vendor@example.com",
      password: "password123",
      role: "vendor",
    },
    admin: {
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    },
  };

  // Switch demo account
  const handleSelectDemoAccount = (role) => {
    setSelectedRole(role);
    setFormData((prev) => ({
      ...prev,
      email: demoAccounts[role].email,
      password: demoAccounts[role].password,
      role: role === "admin" ? "customer" : role,
    }));
    if (formError) setFormError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formError) setFormError("");

    if (activeTab === "signin") {
      if (!formData.email || !formData.password) {
        setFormError("Please fill in all fields");
        return;
      }

      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/");
      } else {
        setFormError(result.message || "Login failed. Please check credentials.");
      }
    } else {
      // Register
      if (!formData.username || !formData.email || !formData.password) {
        setFormError("Please fill in all required fields");
        return;
      }

      const result = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.role,
      );

      if (result.success) {
        navigate("/");
      } else {
        setFormError(result.message || "Registration failed.");
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 bg-gray-950 text-white">
      {/* Container Box with Glow & Glassmorphic border */}
      <div className="w-full max-w-lg bg-gray-900/90 border border-gray-800 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8">
        
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Welcome to ShopVerse
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Sign in to manage your orders, store & cart
          </p>
        </div>

        {/* Quick Demo Accounts Selection */}
        {activeTab === "signin" && (
          <div className="mb-6 p-3 bg-gray-950/60 border border-gray-800/80 rounded-xl">
            <div className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-2 text-center">
              Quick Demo Accounts
            </div>
            <div className="grid grid-cols-3 gap-2">
              {/* Customer Button */}
              <button
                type="button"
                onClick={() => handleSelectDemoAccount("customer")}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg border transition-all text-xs font-medium ${
                  selectedRole === "customer"
                    ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-400 shadow-md shadow-emerald-500/10"
                    : "bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Customer
              </button>

              {/* Vendor Button */}
              <button
                type="button"
                onClick={() => handleSelectDemoAccount("vendor")}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg border transition-all text-xs font-medium ${
                  selectedRole === "vendor"
                    ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-400 shadow-md shadow-emerald-500/10"
                    : "bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Vendor
              </button>

              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleSelectDemoAccount("admin")}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg border transition-all text-xs font-medium ${
                  selectedRole === "admin"
                    ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-400 shadow-md shadow-emerald-500/10"
                    : "bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Admin
              </button>
            </div>
          </div>
        )}

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab("signin");
              setFormError("");
            }}
            className={`flex-1 text-center py-2.5 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "signin"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("register");
              setFormError("");
            }}
            className={`flex-1 text-center py-2.5 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "register"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {formError && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800/80 text-red-300 text-sm rounded-lg flex items-center gap-2">
            <svg
              className="w-4 h-4 text-red-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {formError}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field (Only on Register) */}
          {activeTab === "register" && (
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. john_doe"
                  className="w-full bg-gray-950/80 border border-gray-800 rounded-lg px-3.5 py-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
                <svg
                  className="w-4 h-4 text-gray-500 absolute left-3.5 top-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Role Selector (Only on Register) */}
          {activeTab === "register" && (
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Register Account As
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "customer" }))
                  }
                  className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    formData.role === "customer"
                      ? "bg-blue-950/80 border-blue-500 text-blue-300"
                      : "bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-700"
                  }`}
                >
                  <span>🛒 Customer (Buy)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "vendor" }))
                  }
                  className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    formData.role === "vendor"
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                      : "bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-700"
                  }`}
                >
                  <span>🏬 Vendor (Buy & Sell)</span>
                </button>
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-gray-950/80 border border-gray-800 rounded-lg px-3.5 py-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              <svg
                className="w-4 h-4 text-gray-500 absolute left-3.5 top-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-gray-950/80 border border-gray-800 rounded-lg px-3.5 py-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              <svg
                className="w-4 h-4 text-gray-500 absolute left-3.5 top-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2 text-sm">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : activeTab === "signin" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
