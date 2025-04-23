//src/pages/ForgotPassword/ResetNewPassword.tsx
import { useForm, Controller } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import Password from "@/components/form/password";
import { Button } from "@/components/ui/button";
import { titles, buttons, messages, placeholders, errors, regex, toasts } from "@/constants/Auth";

type formData = {
    email: string;
    password: string;
    confirmPassword: string;
};

export default function ResetNewPassword() {
    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const emailFromUrl = searchParams.get("email") || "";

    const {
        control,
        handleSubmit,
        watch,
        // Rename formState errors to avoid conflict with imported constants
        formState: { errors: formErrors },
    } = useForm<formData>({
        mode: "onChange",
    });


    const onSubmit = async (data: formData) => {
        if (!emailFromUrl) {
            toast.error(toasts.INVALID_EMAIL_TOAST);
            navigate("/forgot-password");
            return;
        }
        try {
            const response = await fetch(`${baseUrl}/api/auth/new-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: emailFromUrl, password: data.password }),
            });

            const result = await response.json();
            if (response.ok && result.success) {
                toast.success(result?.message || toasts.PASSWORD_RESET_SUCCESS_TOAST);
                navigate("/login");
            } else {
                toast.error(result.error || `Failed to reset password: ${response.status}`);
            }
        } catch (error) {
            console.error("Password reset error:", error);
            toast.error(toasts.PASSWORD_RESET_FAILED);
        }
    };

    return (
        <>
            <Toaster />
            <div className="flex items-center justify-center px-4">
                <div className="w-full max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center w-16 bg-gray-200 rounded-full h-14">
                            <FiLock className="text-4xl" />
                        </div>
                    </div>
                    <h2 className="mt-8 mb-2 text-2xl font-bold text-center text-gray-800">
                        {titles.RESET_PASSWORD_TITLE}
                    </h2>
                    <p className="mb-8 text-sm font-semibold text-center text-gray-500">
                        {titles.RESET_PASSWORD_SUBTITLE}
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative mb-2">
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: errors.PASSWORD_REQUIRED_ERROR,
                                    pattern: {
                                        value: regex.PASSWORD_REGEX,
                                        message: errors.INVALID_PASSWORD_ERROR, // Use imported constants
                                    },
                                }}
                                render={({ field }) => (
                                    <Password
                                        {...field}
                                        placeholder={placeholders.NEW_PASSWORD_PLACEHOLDER}
                                        showLabel={false}
                                        // Use renamed formErrors and ensure string type
                                        error={typeof formErrors.password?.message === 'string' ? formErrors.password.message : undefined}
                                    />
                                )}
                            />
                        </div>

                        <div className="relative mb-2">
                            <Controller
                                name="confirmPassword"
                                control={control}
                                rules={{
                                    // Use imported constants
                                    required: errors.PASSWORD_REQUIRED_ERROR,
                                    // Use imported constants
                                    validate: (value) => value === watch("password") || errors.PASSWORDS_MISMATCH_ERROR,
                                }}
                                render={({ field }) => (
                                    <Password
                                        {...field}
                                        placeholder={placeholders.CONFIRM_PASSWORD_PLACEHOLDER}
                                        showLabel={false}
                                        // Use renamed formErrors and ensure string type
                                        error={typeof formErrors.confirmPassword?.message === 'string' ? formErrors.confirmPassword.message : undefined}
                                    />

                                )}
                            />
                        </div>
                        <Button
                        >{buttons.RESET_PASSWORD_BUTTON_TEXT}</Button>
                    </form>

                    <p className="mt-5 text-sm text-center text-gray-800">
                        <Link to={"/login"} className="hover:underline">
                            {messages.BACK_TO_LOGIN_TEXT}
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
