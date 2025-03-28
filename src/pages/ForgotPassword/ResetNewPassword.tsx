import { useForm, Controller } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
//TODO Update this to be the standard fields like login/register
import Password from "@/components/form/password";
import { Button } from "@/components/ui/button";
import { forgotContent } from "@/constants/ForgotPassword";


export default function ResetNewPassword() {
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const {
        PASSWORD_VALIDATION_ERROR, PASSWORD_REGEX,
        CONFIRM_PASSWORD_PLACEHOLDER, PASSWORDS_MISMATCH_ERROR,
        RESET_PASSWORD_BUTTON_TEXT,
        RETURN_TO_SIGNIN_TEXT, RESET_PASSWORD_SUBTITLE, RESET_PASSWORD_TITLE,
        NEW_PASSWORD_PLACEHOLDER, PASSWORD_REQUIRED_ERROR, PASSWORD_RESET_SUCCESS_TOAST,
        PASSWORD_RESET_FAILED_TOAST,NOT_EMAIL_EXIST
    } = forgotContent;

    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const emailFromUrl = searchParams.get("email") || "";

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });


    const onSubmit = async (data: any) => {
        if (!emailFromUrl) {
            toast.error(NOT_EMAIL_EXIST, { duration: 2000 });
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
                toast.success(result?.message || PASSWORD_RESET_SUCCESS_TOAST);
                navigate("/login");
            } else {
                toast.error(result.error || `Failed to reset password: ${response.status}`);
            }
        } catch (error) {
            console.error("Password reset error:", error);
            toast.error(PASSWORD_RESET_FAILED_TOAST);
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
                        {RESET_PASSWORD_TITLE}
                    </h2>
                    <p className="text-sm font-semibold text-gray-500 text-center mb-8">
                        {RESET_PASSWORD_SUBTITLE}
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative mb-2">
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: PASSWORD_REQUIRED_ERROR,
                                    pattern: {
                                        value: PASSWORD_REGEX,
                                        message: PASSWORD_VALIDATION_ERROR,
                                    },
                                }}
                                render={({ field }) => (
                                    <Password
                                        {...field}
                                        placeholder={NEW_PASSWORD_PLACEHOLDER}
                                        showLabel={false}
                                        error={errors.password?.message?.toString()}
                                    />
                                )}
                            />
                        </div>

                        <div className="relative mb-2">
                            <Controller
                                name="confirmPassword"
                                control={control}
                                rules={{
                                    required: PASSWORD_REQUIRED_ERROR,
                                    validate: (value) => value === watch("password") || PASSWORDS_MISMATCH_ERROR,
                                }}
                                render={({ field }) => (
                                    <Password
                                        {...field}
                                        placeholder={CONFIRM_PASSWORD_PLACEHOLDER}
                                        showLabel={false}
                                        error={errors.confirmPassword?.message?.toString()}
                                    />

                                )}
                            />
                        </div>
                        <Button
                            >{RESET_PASSWORD_BUTTON_TEXT}</Button>
                    </form>

                    <p className="text-gray-800 text-sm text-center mt-5">
                        <Link to={"/login"} className="hover:underline">
                            {RETURN_TO_SIGNIN_TEXT}
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
