import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useGoogleLogin } from "@react-oauth/google";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";

const baseUrl = import.meta.env.VITE_BACKEND_URL;
const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState(
    localStorage.getItem("email") || ""
  );
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmailInput(email);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handleEnter = (e: any) => {
    if (e.key === "Enter") {
      handleResetPassword();
    }
  };

  const handleResetPassword = async () => {
    if (!emailInput.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!validateEmail(emailInput)) {
      setError("Please enter a valid email address.");
    }
    setError("");

    try {
      const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailInput }),
      });

      const data = await response.json();
      if (data.success === true) {
        toast.success(data.message || "Reset link sent to your email.");
          navigate(`/forgot-resend?email=${encodeURIComponent(emailInput)}`);
      } else {
        toast.error(data.error)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password.");
    }
  };

  return (
    <>
      <Toaster />
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-sm">
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 rounded-full w-16 h-14 flex items-center justify-center">
              <FiLock className="text-4xl" />
            </div>
          </div>

          <h2 className="mt-8 text-xl font-semibold text-gray-800 mb-2 text-center">
            Forgot your password?
          </h2>
          <p className="text-xs text-gray-500 mb-4 text-center">
            No worries, we'll send you reset instructions
          </p>

          {/* Email Input */}
          <input
            type="email"
            placeholder="name@example.com"
            className="border text-xs p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={emailInput}
            onChange={handleEmailChange}
            onKeyDown={handleEnter}
          />
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

          {/* Continue with Email */}
          <button
            onClick={handleResetPassword}
            className="bg-black text-xs mt-3 text-white py-2 w-full rounded hover:bg-gray-800 transition cursor-pointer"
          >
            Reset Password
          </button>

          <p className="text-black text-sm text-center mt-5">
            <Link to={"/login"} className="hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
