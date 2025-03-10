import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email]);

  const validatePassword = () => {
    if (!password) return "Please enter your password.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password)) return "Must include an uppercase letter.";
    if (!/[0-9]/.test(password)) return "Must include a number.";
    if (!/[!@#$%^&*]/.test(password))
      return "Must include a special character.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleCreateAccount = () => {
    const errorMsg = validatePassword();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    localStorage.setItem("navigateNext", "true");
    navigate("/register/verifyCode", {
      state: { email: email, navigateNext: true },
      replace: true,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
          Set your password
        </h2>
        <p className="text-xs text-gray-500 mb-4 text-center">
          Choose a secure password for your account
        </p>

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border text-xs p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="border text-xs p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <button
          onClick={handleCreateAccount}
          className="bg-gray-500 text-white py-2 w-full rounded mt-2"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SetPassword;
