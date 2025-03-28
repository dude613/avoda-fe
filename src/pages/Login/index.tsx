import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react"; // Added for loading spinner
import { useGoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../../ui/Button"; // Corrected import path if needed
import Card from "@/ui/Card";
import { LoginAPI } from "@/service/api";
import AuthInput from "@/ui/AuthInput";
// Removed PasswordWithStrength import if AuthInput handles it
const baseUrl = import.meta.env.VITE_BACKEND_URL;
import * as loginContent from "@/constants/Auth";

const Login: React.FC = () => {
  const {
    titles: { LOGIN_PAGE_TITLE, LOGIN_PAGE_SUBTITLE },
    buttons: { GOOGLE_BUTTON_TEXT, EMAIL_BUTTON_TEXT, SIGNUP_LINK_TEXT, FORGOT_PASSWORD_LINK_TEXT },
    messages: { DIVIDER_TEXT, NO_ACCOUNT_TEXT, LOADING_TEXT },
    placeholders: {PASSWORD_PLACEHOLDER},
    errors: { INVALID_EMAIL_ERROR, REQUIRED_EMAIL_ERROR, REQUIRED_PASSWORD_ERROR, INVALID_PASSWORD_ERROR },
    toasts: { LOGIN_SUCCESS_TOAST, USER_NOT_FOUND_TOAST, SERVER_ERROR_TOAST },
    regex: { EMAIL_REGEX, PASSWORD_REGEX }
  } = loginContent;

  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    const { email, password } = data;
    try {
      const response = await LoginAPI({ email, password });
      if (response.success) {
        localStorage.setItem("userId", response.user._id);
        localStorage.setItem("accessToken", response.accessToken);
        toast.success(response.message || LOGIN_SUCCESS_TOAST, { duration: 2000 });
        const onboardingSkipped = response?.onboardingSkipped;
        const destination = onboardingSkipped ? "/create-organization" : "/dashboard"
        navigate(destination, { replace: true });
      } else {
        toast.error(response.error || USER_NOT_FOUND_TOAST, { duration: 2000 });
      }
    } catch {
      toast.error(SERVER_ERROR_TOAST);
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const response = await fetch(`${baseUrl}/api/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: access_token }),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("userId", data.user._id);
          localStorage.setItem("accessToken", data.accessToken);
          toast.success(LOGIN_SUCCESS_TOAST, { position: "bottom-center" });
          setTimeout(() => navigate("/dashboard", { replace: true }), 1000);
        } else {
          toast.error(response.status === 400 ? USER_NOT_FOUND_TOAST : SERVER_ERROR_TOAST, { position: "bottom-center" });
        }
      } catch { }
    },
    onError: console.error,
    scope: "openid profile email",
  });

  return (
    <>
      <Toaster />
      <Card>
        <h2 className="text-xl font-bold mb-2 text-center">{LOGIN_PAGE_TITLE}</h2>
        <p className="text-xs text-primary mb-4 text-center">{LOGIN_PAGE_SUBTITLE}</p>
        <Button
          onClick={() => login()}
        >{GOOGLE_BUTTON_TEXT}<FcGoogle/></Button>
        <div className="flex items-center my-4">
          <hr className="flex-grow border border-border" />
          <span className="mx-2 text-primary text-xs">{DIVIDER_TEXT}</span>
          <hr className="flex-grow border border-border" />
        </div>
        <div className="relative mb-4">
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: {value : true , message : REQUIRED_EMAIL_ERROR},
              pattern: {
                value: EMAIL_REGEX,
                message: INVALID_EMAIL_ERROR,
              },
            }}
            render={({ field }) => (
              <AuthInput
                {...field}
                type="email"
                label="Email" // Use label prop for animation
                error={errors.email?.message?.toString()}
              />
            )}
          />
        </div>

        <div className="relative mb-4">
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: {value : true , message : REQUIRED_PASSWORD_ERROR},
              pattern: {
                value: PASSWORD_REGEX,
                message: INVALID_PASSWORD_ERROR,
              },
            }}
            render={({ field }) => (
              <AuthInput
                {...field}
                type="password"
                label={PASSWORD_PLACEHOLDER} // Use placeholder constant as label
                error={errors.password?.message?.toString()}
                showStrengthIndicator={true} // Enable the strength indicator on focus
              />
            )}
          />
        </div>

        <Button onClick={handleSubmit(onSubmit)}>{loading ? LOADING_TEXT : EMAIL_BUTTON_TEXT}</Button>

        <p className="text-gray-500 text-sm text-center mt-3">
          {NO_ACCOUNT_TEXT}{" "}
          <span className="text-sm text-black hover:underline">
            <Link to="/register">{SIGNUP_LINK_TEXT}</Link>
          </span>
        </p>

        <p className="text-sm text-center mt-5">
          <Link to="/forgot-password" className="hover:underline text-black">
            {FORGOT_PASSWORD_LINK_TEXT}
          </Link>
        </p>
      </Card>
    </>
  );
};

export default Login;
