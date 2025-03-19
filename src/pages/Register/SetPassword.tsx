import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import * as Constants from "@/constants/Register";
import Email from "@/components/form/email";
import PasswordWithStrength from "@/components/form/PasswordWithStrength";
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const SetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordMeetsRequirements, setPasswordMeetsRequirements] = useState(false);
  const emailLocalStorage = localStorage.getItem("email");
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (!email || !emailLocalStorage) {
      navigate("/register");
    }
  }, [email, emailLocalStorage]);

  const validatePassword = () => {
    if (!password) return Constants.EMPTY_PASSWORD_ERROR;
    if (password.length < 8) return Constants.PASSWORD_LENGTH_ERROR;
    if (!/[A-Z]/.test(password)) return Constants.PASSWORD_UPPERCASE_ERROR;
    if (!/[0-9]/.test(password)) return Constants.PASSWORD_NUMBER_ERROR;
    if (!/[!@#$%^&*]/.test(password))
      return Constants.PASSWORD_SPECIAL_CHAR_ERROR;
    if (password !== confirmPassword) return Constants.PASSWORDS_MISMATCH_ERROR;
    return "";
  };

  const handleCreateAccount = async () => {
    const errorMsg = validatePassword();
    if (errorMsg) {
      setError(errorMsg);
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
      if (response.ok) {
        toast.success(Constants.REGISTER_SUCCESS_TOAST, {
          position: "bottom-center",
        });
        navigate(`/register/verifyCode?email=${encodeURIComponent(email)}`, {
          replace: true,
        });
      } else if (response.status === 400) {
        toast.error(Constants.USER_EXISTS_TOAST, { position: "bottom-center" });
      } else {
        toast.error(Constants.SERVER_ERROR_TOAST, { position: "bottom-center" });
      }
    } catch (error) {
      toast.error(Constants.SERVER_ERROR_TOAST, { position: "bottom-center" });
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
            {Constants.SET_PASSWORD_TITLE}
          </h2>
          <p className="text-xs text-gray-500 mb-4 text-center">
            {Constants.SET_PASSWORD_SUBTITLE}
          </p>

          <Email 
            value={email} 
            disabled={true}
          />
          <p className="text-red-500 text-[10px] opacity-80 mb-2">
            {Constants.EDIT_EMAIL_MESSAGE}
          </p>

          <div className="mb-4">
            <PasswordWithStrength
              placeholder={Constants.PASSWORD_PLACEHOLDER}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newPassword = e.target.value;
                setPassword(newPassword);
                
                // Check if password meets all requirements
                const requirements = [
                  /.{8,}/,         // At least 8 characters
                  /[0-9]/,         // At least 1 number
                  /[a-z]/,         // At least 1 lowercase letter
                  /[A-Z]/          // At least 1 uppercase letter
                ];
                
                const allRequirementsMet = requirements.every(regex => regex.test(newPassword));
                setPasswordMeetsRequirements(allRequirementsMet);
              }}
              showStrengthIndicator={!passwordMeetsRequirements}
            />
          </div>

          <div className="mb-4">
            <PasswordWithStrength
              placeholder={Constants.CONFIRM_PASSWORD_PLACEHOLDER}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              showStrengthIndicator={false}
            />
          </div>

          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
          <button
            onClick={handleCreateAccount}
            className="bg-gray-500 text-white py-2 w-full rounded mt-2"
          >
            {loading ? Constants.CREATING_ACCOUNT_TEXT : Constants.CREATE_ACCOUNT_BUTTON_TEXT}
          </button>
        </div>
      </div>
    </>
  );
};

export default SetPassword;
