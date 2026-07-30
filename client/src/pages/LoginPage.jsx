import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(""); // "" | "customer" | "vendor" | "admin"

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const { login, loading } = useAppContext();
  const navigate = useNavigate();

  // Demo Account credentials mapping
  const demoAccounts = {
    customer: {
      email: "customer@example.com",
      password: "password123",
    },
    vendor: {
      email: "vendor@example.com",
      password: "password123",
    },
    admin: {
      email: "admin@example.com",
      password: "password123",
    },
  };

  // Switch demo account
  const handleSelectDemoAccount = (role) => {
    setSelectedRole(role);
    setFormData({
      email: demoAccounts[role].email,
      password: demoAccounts[role].password,
    });
    if (formError) setFormError("");
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formError) setFormError("");

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
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-gray-100 text-gray-900">
      {/* Light Card Matching Application Design System */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-md p-6 md:p-8">
        
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src="/favicon.svg"
            alt="ShopVerse Favicon Logo"
            className="w-14 h-14 rounded-2xl mb-3 shadow-md hover:scale-105 transition-transform"
          />
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome to ShopVerse
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage your orders, store & cart
          </p>
        </div>

        {/* Quick Demo Accounts Selection */}
        <div className="mb-6 p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-2 text-center">
            Quick Demo Accounts
          </div>
          <div className="grid grid-cols-3 gap-2">
            {/* Customer Button */}
            <button
              type="button"
              onClick={() => handleSelectDemoAccount("customer")}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg border transition-all text-xs font-medium ${
                selectedRole === "customer"
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
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
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg border transition-all text-xs font-medium ${
                selectedRole === "vendor"
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
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
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg border transition-all text-xs font-medium ${
                selectedRole === "admin"
                  ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
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

        {/* Error Notification */}
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <svg
              className="w-4 h-4 text-red-500 flex-shrink-0"
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
          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="name@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:placeholder-transparent transition-all"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:placeholder-transparent transition-all"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Redirect to Register Page */}
        <div className="mt-6 text-center text-xs text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
