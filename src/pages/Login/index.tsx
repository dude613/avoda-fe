import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async () => {
    if (!validateEmail(emailInput)) {
      setError("Please enter a valid email address.");
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
          toast.success("User login successfully", {
            position: "bottom-center",
          });
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
        } else if (response.status === 400) {
          toast.error("User not found", { position: "bottom-center" });
        } else {
          toast.error("Server error", { position: "bottom-center" });
        }
      } catch (error) {
        toast.error("Server error", { position: "bottom-center" });
      } finally {
        setLoading(false);
      }
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
          toast.success("User login successfully", {
            position: "bottom-center",
          });
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
        } else if (response.status === 400) {
          toast.error("User not found", { position: "bottom-center" });
        } else {
          toast.error("Server error", { position: "bottom-center" });
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
            Login
          </h2>
          <p className="text-xs text-gray-500 mb-4 text-center">
            Enter your credentials to access your account
          </p>

          {/* Google Sign-In Button */}
          <label className="text-xs mb-6">Email</label>
          <button
            onClick={() => login()}
            className="flex items-center justify-center border border-gray-300 w-full p-2 mb-4 rounded hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-lg" />
            <span className="text-xs pl-2">Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-xs">OR CONTINUE WITH</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Email Input */}
          <label className="text-xs mb-6">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="border text-xs p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={emailInput}
            onChange={handleEmailChange}
          />
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

          <div className="relative mb-4">
            <label className="text-xs mb-6">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border text-xs p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
                <span className="animate-pulse">Logging in</span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </span>
            ) : (
              " Continue with Email"
            )}
          </button>

          <p className="text-gray-500 text-sm text-center mt-3">
            Didn't have an account?{" "}
            <span className="text-black text-sm  hover:underline">
              <Link to={"/register"}>Sign up</Link>
            </span>
          </p>

          <p className="text-black text-sm text-center mt-5">
            <Link to={"/forgot-password"} className="hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
