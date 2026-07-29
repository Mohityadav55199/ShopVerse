import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer", // "customer" | "vendor"
  });

  const [formError, setFormError] = useState("");
  const { register, loading } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formError) setFormError("");

    // Validate form
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setFormError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
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
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 bg-gray-950 text-white">
      {/* Container Box with Glassmorphism */}
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Join ShopVerse as a Customer or Vendor
          </p>
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
          
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              I want to join as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, role: "customer" }))
                }
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  formData.role === "customer"
                    ? "bg-blue-950/80 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10"
                    : "bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                }`}
              >
                <span>🛒 Customer (Buy Only)</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, role: "vendor" }))
                }
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  formData.role === "vendor"
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10"
                    : "bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                }`}
              >
                <span>🏬 Vendor (Buy & Sell)</span>
              </button>
            </div>
          </div>

          {/* Username Field */}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Redirect to Login */}
        <div className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
