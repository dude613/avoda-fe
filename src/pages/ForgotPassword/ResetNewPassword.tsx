import { useForm, Controller } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
//TODO Update this to be the standard fields like login/register
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
            toast.error(errors.INVALID_EMAIL);
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
                toast.success(result?.message || toasts.PASSWORD_RESET_SUCCESS);
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
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-sm">
                    <div className="flex items-center justify-center">
                        <div className="bg-gray-200 rounded-full w-16 h-14 flex items-center justify-center">
                            <FiLock className="text-4xl" />
                        </div>
                    </div>
                    <h2 className="mt-8 text-2xl font-bold text-gray-800 mb-2 text-center">
                        {titles.RESET_PASSWORD_TITLE}
                    </h2>
                    <p className="text-sm font-semibold text-gray-500 text-center mb-8">
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
                                        value: regex.PASSWORD, 
                                        message: errors.PASSWORD_VALIDATION_ERROR, // Use imported constants
                                    },
                                }}
                                render={({ field }) => (
                                    <Password
                                        {...field}
                                        placeholder={placeholders.NEW_PASSWORD}
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
                                        placeholder={placeholders.CONFIRM_PASSWORD}
                                        showLabel={false}
                                        // Use renamed formErrors and ensure string type
                                        error={typeof formErrors.confirmPassword?.message === 'string' ? formErrors.confirmPassword.message : undefined}
                                    />

                                )}
                            />
                        </div>
                        <Button
                            >{buttons.RESET_PASSWORD}</Button>
                    </form>

                    <p className="text-gray-800 text-sm text-center mt-5">
                        <Link to={"/login"} className="hover:underline">
                            {messages.BACK_TO_LOGIN_TEXT}
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
