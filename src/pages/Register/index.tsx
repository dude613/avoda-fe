import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useGoogleLogin } from "@react-oauth/google";
import { Toaster, toast } from "react-hot-toast";
import * as Constants from "../../constants/Register";

const baseUrl = import.meta.env.VITE_BACKEND_URL;
const Register: React.FC = () => {
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
      setError(Constants.INVALID_EMAIL_ERROR);
    } else {
      setError("");
    }
  };

  const handleEnter = (e: any) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  const handleContinue = () => {
    if (!validateEmail(emailInput)) {
      setError(Constants.INVALID_EMAIL_ERROR);
    } else {
      localStorage.setItem("email", emailInput);
      navigate("/register/setPassword", {
        state: { email: emailInput },
      });
    }
  };

  const register = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const data = JSON.stringify({
        idToken: tokenResponse.access_token,
      });
      try {
        const response = await fetch(`${baseUrl}/api/auth/google-register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });
        const responseData = await response.json();
        if (response.ok) {
          localStorage.setItem("userId", responseData.user._id);
          localStorage.setItem("accessToken", responseData.accessToken);
          toast.success(Constants.REGISTER_SUCCESS_TOAST, {
            position: "bottom-center",
          });
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
        } else if (response.status === 404) {
          toast.error(Constants.USER_EXISTS_TOAST, { position: "bottom-center" });
        } else {
          toast.error(Constants.SERVER_ERROR_TOAST, { position: "bottom-center" });
        }
      } catch (error) {}
    },
    onError: (error: any) => console.error("Login Failed:", error),
    scope:
      "openid profile email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.metadata.readonly",
  });

  return (
    <>
      <Toaster />
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            {Constants.REGISTER_PAGE_TITLE}
          </h2>
          <p className="text-xs text-gray-500 mb-4 text-center">
            {Constants.REGISTER_PAGE_SUBTITLE}
          </p>

          {/* Google Sign-In Button */}
          <button
            onClick={() => register()}
            className="flex items-center justify-center border border-gray-300 w-full p-2 mb-4 rounded hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-lg" />
            <span className="text-xs pl-2">{Constants.GOOGLE_BUTTON_TEXT}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-xs">{Constants.DIVIDER_TEXT}</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Email Input */}
          {/* TODO Make the email input like the password input (components) */}
          <input
            type="email"
            placeholder={Constants.EMAIL_PLACEHOLDER}
            className="border text-xs p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={emailInput}
            onChange={handleEmailChange}
            onKeyDown={handleEnter}
          />
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

          {/* Continue with Email */}
          <button
            onClick={handleContinue}
            className="bg-black text-xs text-white py-2 w-full rounded hover:bg-gray-800 transition cursor-pointer"
          >
            {Constants.EMAIL_BUTTON_TEXT}
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;
