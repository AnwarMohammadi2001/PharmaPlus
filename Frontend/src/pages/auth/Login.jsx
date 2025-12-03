import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/authSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUserMd,
  FaPills,
  FaLock,
  FaEnvelope,
  FaSignInAlt,
} from "react-icons/fa";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, accessToken } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form))
      .unwrap()
      .then(() => {
        toast.success("Login successful! Redirecting to dashboard...");
        setTimeout(() => navigate("/dashboard"), 1500);
      })
      .catch((err) => {
        toast.error(err || "Login failed!");
      });
  };

  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [accessToken, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        toastClassName="rounded-lg"
      />

      <div className="max-w-6xl w-full grid md:grid-cols-2  gap-8 items-center">
        {/* Left Side - Branding & Info */}
        <div className="hidden md:block bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl shadow-2xl p-10 text-white">
          <div className="flex items-center gap-4 mb-8">
            <FaPills className="text-4xl" />
            <h1 className="text-3xl font-bold">PharmaCare</h1>
          </div>

          <h2 className="text-4xl font-bold mb-6">
            Welcome Back to <br />
            Your Pharmacy Portal
          </h2>

          <p className="text-blue-100 mb-8 text-lg">
            Secure access to manage prescriptions, inventory, and patient
            records. Providing trusted healthcare solutions since 1998.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <FaUserMd className="text-2xl" />
              <div>
                <h3 className="font-bold">Pharmacy Staff</h3>
                <p className="text-sm text-blue-100">
                  Access patient records & prescriptions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <FaPills className="text-2xl" />
              <div>
                <h3 className="font-bold">Inventory Management</h3>
                <p className="text-sm text-blue-100">
                  Real-time stock tracking
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/30">
            <p className="text-sm text-blue-100">
              Need help? Contact support:
              <a href="tel:+1234567890" className="font-bold ml-2">
                +1 (234) 567-890
              </a>
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl h-full p-8 md:p-10">
          <div className="text-center mb-10">
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Pharmacy Login
            </h1>
            <p className="text-gray-600">
              Sign in to your pharmacy management account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />
                Professional Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="pharmacist@example.com"
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <FaEnvelope className="text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaLock className="text-blue-500" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your secure password"
                  className="w-full p-4 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <FaLock className="text-gray-400" />
                </div>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember this device
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-4 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-600 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  Sign In to Pharmacy Portal
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
          </form>
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <a href="/terms" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>
              <br />
              <span className="text-gray-400">
                HIPAA compliant • SSL Secured
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
