import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import * as Constants from "../../constants/Login";
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\W).{8,}$/;
    return passwordRegex.test(password);
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pass = e.target.value;
    setPassword(pass);
    if (!pass) {
      setPasswordError("Password is required.");
    } else if (!validatePassword(pass)) {
      setPasswordError(
        "Password must be at least 8 characters, with 1 uppercase letter and 1 special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    if (!validateEmail(emailInput)) {
      setError(Constants.INVALID_EMAIL_ERROR);
    } else {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailInput,
            password,
          }),
        });
        const responseData = await response.json();
        if (response.ok) {
          localStorage.setItem("userId", responseData.user._id);
          localStorage.setItem("accessToken", responseData.accessToken);
          toast.success(Constants.LOGIN_SUCCESS_TOAST, {
            position: "bottom-center",
          });
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
        } else if (response.status === 400) {
          toast.error(Constants.USER_NOT_FOUND_TOAST, { position: "bottom-center" });
        } else {
          toast.error(Constants.SERVER_ERROR_TOAST, { position: "bottom-center" });
        }
      } catch (error) {
        toast.error(Constants.SERVER_ERROR_TOAST, { position: "bottom-center" });
      } finally {
        setLoading(false);
      }
    } catch (e) {
      toast.error("login server error");
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch(`${baseUrl}/api/auth/google-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: tokenResponse.access_token,
          }),
        });
        const responseData = await response.json();
        if (response.ok) {
          localStorage.setItem("userId", responseData.user._id);
          localStorage.setItem("accessToken", responseData.accessToken);
          toast.success(Constants.LOGIN_SUCCESS_TOAST, {
            position: "bottom-center",
          });
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
        } else if (response.status === 400) {
          toast.error(Constants.USER_NOT_FOUND_TOAST, { position: "bottom-center" });
        } else {
          toast.error(Constants.SERVER_ERROR_TOAST, { position: "bottom-center" });
        }
      } catch (error) { }
    },
    onError: (error: any) => console.error("Login Failed:", error),
    scope:
      "openid profile email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.metadata.readonly",
  });

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            {Constants.LOGIN_PAGE_TITLE}
          </h2>
          <p className="text-xs text-gray-500 mb-4 text-center">
            {Constants.LOGIN_PAGE_SUBTITLE}
          </p>

          {/* Google Sign-In Button */}
          <label className="text-xs mb-6">{Constants.EMAIL_LABEL}</label>
          <button
            onClick={() => login()}
            className="flex items-center justify-center border border-gray-300 w-full p-2 mb-4 rounded hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-lg" />
            <span className="text-xs pl-2">{Constants.GOOGLE_BUTTON_TEXT}</span>
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-xs">{Constants.DIVIDER_TEXT}</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Email Input */}
          <label className="text-xs mb-6">{Constants.EMAIL_LABEL}</label>
          <input
            type="email"
            placeholder={Constants.EMAIL_PLACEHOLDER}
            className="border text-xs p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={emailInput}
            onChange={handleEmailChange}
            error={error} />

          <div className="relative mb-4">
            <label className="text-xs mb-6">{Constants.PASSWORD_LABEL}</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder={Constants.PASSWORD_PLACEHOLDER}
              className="border text-xs p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError} />
            <span
              className="absolute right-3 top-8 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Login */}
          <button
            onClick={handleLogin}
            className="bg-black text-xs text-white py-2 w-full rounded hover:bg-gray-800 transition cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">{Constants.LOADING_TEXT}</span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </span>
            ) : (
              Constants.EMAIL_BUTTON_TEXT
            )}
          </button>

          <p className="text-gray-500 text-sm text-center mt-3">
            {Constants.NO_ACCOUNT_TEXT}{" "}
            <span className="text-black text-sm  hover:underline">
              <Link to={"/register"}>{Constants.SIGNUP_LINK_TEXT}</Link>
            </span>
          </p>

          <p className="text-black text-sm text-center mt-5">
            <Link to={"/forgot-password"} className="hover:underline">
              {Constants.FORGOT_PASSWORD_LINK_TEXT}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
