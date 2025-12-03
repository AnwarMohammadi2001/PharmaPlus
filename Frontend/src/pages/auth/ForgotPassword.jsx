import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaEnvelope,
  FaShieldAlt,
  FaArrowLeft,
  FaPaperPlane,
  FaPills,
  FaHospitalSymbol,
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${BASE_URL}/auth/forgot-password`, {
        email,
      });
      toast.success(res.data.message);
      setIsSubmitted(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Error sending reset link. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br relative from-blue-50 via-white to-emerald-50 flex flex-col items-center justify-center p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="rounded-xl shadow-lg"
      />

      <div className="w-full max-w-md">
        {/* Back to Login */}
        <a
          href="/login"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors duration-200"
        >
          <FaArrowLeft />
          <span className="font-medium">Back to Login</span>
        </a>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm mb-4">
              <FaShieldAlt className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Reset Your Password
            </h2>
            <p className="text-blue-100 text-sm">
              Enter your registered email to receive a secure reset link
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {!isSubmitted ? (
              <>
                {/* Security Note */}
                <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <FaShieldAlt className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-800 text-sm">
                        Security Notice
                      </h3>
                      <p className="text-blue-600 text-xs mt-1">
                        The reset link will be sent to your registered email and
                        will expire in 15 minutes for security reasons.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaEnvelope className="text-blue-500" />
                      Pharmacy Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="pharmacist@medicarepharmacy.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Enter the email associated with your pharmacy account
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-4">
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Check Your Email!
                </h3>

                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to:
                  <br />
                  <span className="font-semibold text-blue-600">{email}</span>
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-700">
                      <span className="font-bold">Important:</span> The link
                      expires in 15 minutes.
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        handleSubmit(new Event("submit"));
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      resend the link
                    </button>
                  </p>

                  <a
                    href="/login"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    <FaArrowLeft />
                    Return to Login
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-green-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="text-right">
                <p>Need immediate help?</p>
                <a
                  href="tel:+1234567890"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  +1 (234) MED-CARE
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
