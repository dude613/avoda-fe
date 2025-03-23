import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Constants from "../../constants/ForgotPassword";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export default function ResetNewPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const emailFromUrl = searchParams.get("email") || "";
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=(.*[A-Z]))(?=(.*\d))(?=(.*[\W_]))[A-Za-z\d\W_]{8,16}$/;
        return passwordRegex.test(password);
    };

    const handlePasswordChange = (e: { target: { value: string; }; }) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (!newPassword) {
            setPasswordError(Constants.PASSWORD_REQUIRED_ERROR);
        } else if (!validatePassword(newPassword)) {
            setPasswordError(Constants.PASSWORD_VALIDATION_ERROR);
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e: { target: { value: string; }; }) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);

        if (!newConfirmPassword) {
            setConfirmPasswordError("");
        } else if (newConfirmPassword !== password) {
            setConfirmPasswordError(Constants.PASSWORDS_MISMATCH_ERROR);
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleResetPassword = async () => {
        if (!password) {
            setPasswordError(Constants.PASSWORD_REQUIRED_ERROR);
            return;
        }
        if (!validatePassword(password)) {
            setPasswordError(Constants.PASSWORD_VALIDATION_ERROR);
            return;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError(Constants.PASSWORDS_MISMATCH_ERROR);
            return;
        }
        setPasswordError("");
        setConfirmPasswordError("");
        try {
            const response = await fetch(`${baseUrl}/api/auth/new-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: emailFromUrl, password }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data?.message || Constants.PASSWORD_RESET_SUCCESS_TOAST);
                navigate("/login")
            } else {
                toast.error(data.error || Constants.PASSWORD_RESET_FAILED_TOAST);
            }
        } catch (error) {
            toast.error(Constants.PASSWORD_RESET_FAILED_TOAST);
        }
    };

    return (
        <>
            <Toaster />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-sm">
                    <div className="flex items-center justify-center">
                        <div className="bg-gray-200 rounded-full w-16 h-14 flex items-center justify-center">
                            <FiLock className="text-4xl" />
                        </div>
                    </div>

                    <h2 className="mt-8 text-2xl font-bold text-gray-800 mb-2 text-center">
                        {Constants.RESET_PASSWORD_TITLE}
                    </h2>
                    <p className="text-sm font-semibold text-gray-500 text-center mb-8">
                        {Constants.RESET_PASSWORD_SUBTITLE}
                    </p>

                    <div className="relative mb-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={Constants.NEW_PASSWORD_PLACEHOLDER}
                            className="border text-sm p-3 w-full h-auto rounded focus:outline-none focus:ring-1 focus:ring-gray-200"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {passwordError && <p className="text-red-500 text-xs mb-2">{passwordError}</p>}

                    <div className="relative mb-2">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={Constants.CONFIRM_PASSWORD_PLACEHOLDER}
                            className="border text-sm p-3 w-full rounded focus:outline-none focus:ring-1 focus:ring-gray-200"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {confirmPasswordError && <p className="text-red-500 text-xs mb-2">{confirmPasswordError}</p>}

                    <button
                        onClick={handleResetPassword}
                        className="bg-black text-sm mt-3 text-white font-bold py-3 w-full rounded hover:bg-gray-800 transition cursor-pointer"
                    >
                        {Constants.RESET_PASSWORD_BUTTON_TEXT}
                    </button>

                    <p className="text-gray-800 text-sm text-center mt-5">
                        <Link to={"/login"} className="hover:underline">
                            {Constants.RETURN_TO_SIGNIN_TEXT}
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
