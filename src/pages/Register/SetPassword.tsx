import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const SetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const emailLocalStorage = localStorage.getItem("email");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    if (!email || !emailLocalStorage) {
      navigate("/register");
    }
  }, [email, emailLocalStorage]);

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pass = e.target.value;
    setPassword(pass);

    // Password validation
    if (!pass) {
      setPasswordError("Password is required.");
    } else if (!validatePassword(pass)) {
      setPasswordError("Password must be at least 8 characters, with 1 uppercase letter and 1 special character.");
    } else {
      setPasswordError("");
    }

    // Confirm password validation (if already entered)
    if (confirmPassword && pass !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPass = e.target.value;
    setConfirmPassword(confirmPass);

    if (!confirmPass) {
      setConfirmPasswordError("Confirm password is required.");
    } else if (password && confirmPass !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleCreateAccount = async () => {
    if (!password) {
      setPasswordError("Password is required.");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters, with 1 uppercase letter and 1 special character.");
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required.");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();

      if (data.success === true) {
        toast.success(data?.message || "User registered successfully");
        navigate(`/register/verifyCode?email=${encodeURIComponent(email)}`, {
          replace: true,
        });
      } else {
        toast.error(data?.error || "");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            Set your password
          </h2>
          <p className="text-xs text-gray-500 mb-4 text-center">
            Choose a secure password for your account
          </p>

          <Input type="email" placeholder="name@example.com" value={email} error="" disabled />


          <div className="relative mb-4">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
            />
            <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="relative mb-4">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={confirmPasswordError}
            />
            <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <Button onClick={handleCreateAccount} text={loading ? "Creating Account..." : "Create Account"} />
        </div>
      </div>
    </>
  );
};

export default SetPassword;
