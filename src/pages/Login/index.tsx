import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
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
    if (!email) {
      setError("Email is required.");
    }
    else if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
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
    if (!emailInput) {
      setError("Email is required.");
    } else if (!validateEmail(emailInput)) {
      setError("Please enter a valid email address.");
    }

    if (!password) {
      setPasswordError("Password is required.");
    } else if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters, with 1 uppercase letter and 1 special character."
      );
    }
    if (!validateEmail(emailInput) || !validatePassword(password)) {
      return;
    }
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
      const data = await response.json();
      console.log(data)
      if (data.success === true) {
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("accessToken", data.accessToken);
        toast.success(data?.message || "User login successfully");
        setTimeout(() => {
          navigate("/create-organization", { replace: true });
        }, 1000);
      } else {
        toast.error(data?.error || "User does not exist in database please try another email");
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

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-xs">OR CONTINUE WITH</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <label className="text-xs mb-6">Email</label>
          <Input type="email"
            placeholder="name@example.com"
            value={emailInput}
            onChange={handleEmailChange}
            error={error} />

          <div className="relative mb-4">
            <label className="text-xs mb-6">Password</label>
            <Input type={showPassword ? "text" : "password"}
              placeholder="name@example.com"
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

          <Button onClick={handleLogin} text={loading ? "Logging in..." : "Continue with Email"} />

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
