//src/pages/Register/SetPassword.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { Button, Input } from "@/components/ui";
import { Card } from "@/components/ui";
import { titles, buttons, placeholders, errors, regex, toasts } from "@/constants/Auth";
import { Eye, EyeOff, LoaderCircleIcon } from "lucide-react";

interface FormData {
  password: string;
  confirmPassword: string;
}

const SetPassword: React.FC = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get("email");
  const emailFromState = location.state?.email;
  const roleFromQuery = queryParams.get("role");
  const roleFromState = location.state?.role;
  const email = emailFromQuery || emailFromState || localStorage.getItem("email");
  const role = roleFromQuery || roleFromState || 'admin';
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange"
  });

  const handleCreateAccount = async (data: FormData) => {
    if (!email) {
      toast.error(toasts.INVALID_EMAIL_TOAST, { duration: 2000 });
      navigate("/register");
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
          password: data.password,
          role: role,
        }),
      });
      const responseData = await response.json();
      if (response.ok && responseData.success === true) {
        toast.success(responseData?.message || toasts.REGISTER_SUCCESS_TOAST);
        navigate(`/register/verifyCode?email=${encodeURIComponent(email)}&role=${role}`, {
          replace: true,
        });
      } else if (response.status === 400) {
        toast.error(responseData?.error || "User already exists");
      } else {
        toast.error(responseData?.error || toasts.SERVER_ERROR_TOAST);
      }
    } catch (error) {
      toast.error(toasts.SERVER_ERROR_TOAST);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Toaster />
      <Card layout="centeredAndSpaced">
        <h2 className="mb-2 text-xl font-semibold text-center text-gray-800">
          {titles.SET_PASSWORD_TITLE}
        </h2>
        <p className="mb-4 text-xs text-center text-gray-500">
          {titles.SET_PASSWORD_SUBTITLE}
        </p>

        <div className="relative mb-4">
          <Controller
            name="password"
            control={control}
            rules={{
              required: { value: true, message: errors.EMPTY_PASSWORD_ERROR },
              pattern: {
                value: regex.PASSWORD_REGEX,
                message: errors.INVALID_PASSWORD_ERROR,
              },
            }}
            render={({ field }) => (
              <div className="relative">
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder={placeholders.PASSWORD_PLACEHOLDER}
                  error={formErrors.password?.message ? true : false}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {formErrors.password && (
                  <p className="mt-1 text-xs text-destructive">
                    {formErrors.password.message as string}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="relative mb-4">
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: { value: true, message: errors.PASSWORDS_MISMATCH_ERROR },
              validate: (value) => value === watch("password") || errors.PASSWORDS_MISMATCH_ERROR,
            }}
            render={({ field }) => (
              <div className="relative">
                <Input
                  {...field}
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  placeholder={placeholders.CONFIRM_PASSWORD_PLACEHOLDER}
                  error={formErrors.confirmPassword?.message ? true : false}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-destructive">
                    {formErrors.confirmPassword.message as string}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <Button
          onClick={handleSubmit(handleCreateAccount)}
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center gap-1">
              <LoaderCircleIcon
                className="-ms-1 animate-spin"
                size={16}
                aria-hidden="true"
              />
            </span>
          ) : (
            buttons.CREATE_ACCOUNT_BUTTON_TEXT
          )
          }
        </Button>
      </Card>
    </div>
  );
};

export default SetPassword;
