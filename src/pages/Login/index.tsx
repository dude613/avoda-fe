import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { Card } from "@/components/ui";
import { LoginAPI } from "@/service/api";
const baseUrl = import.meta.env.VITE_BACKEND_URL;
import * as constants from "@/constants/Auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavigationLink } from "@/components/ui/navigation-link";
import { FormDivider } from "@/components/ui/form-divider";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    titles: { LOGIN_PAGE_TITLE, LOGIN_PAGE_SUBTITLE },
    buttons: {
      GOOGLE_BUTTON_TEXT,
      EMAIL_BUTTON_TEXT,
      SIGNUP_BUTTON_TEXT,
      FORGOT_PASSWORD_BUTTON_TEXT,
    },
    messages: { DIVIDER_TEXT, NO_ACCOUNT_TEXT, LOADING_TEXT },
    placeholders: { PASSWORD_PLACEHOLDER },
    errors: {
      INVALID_EMAIL_ERROR,
      REQUIRED_EMAIL_ERROR,
      REQUIRED_PASSWORD_ERROR,
      INVALID_PASSWORD_ERROR,
    },
    toasts: { LOGIN_SUCCESS_TOAST, USER_NOT_FOUND_TOAST, SERVER_ERROR_TOAST },
    regex: { EMAIL_REGEX, PASSWORD_REGEX },
  } = constants;

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;
    setLoading(true);
    try {
      const response = await LoginAPI({ email, password });
      if (response.success) {
        localStorage.setItem("userId", response.user.id);
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("userRole", response.user.role);
        toast.success(response.message || LOGIN_SUCCESS_TOAST, {
          duration: 2000,
        });
        const destination = response?.onboardingSkipped
          ? "/create-organization"
          : "/team";
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
      setGoogleLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: access_token }),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("userRole", data.user.role);
          toast.success(LOGIN_SUCCESS_TOAST, { position: "bottom-center" });
          setTimeout(() => navigate("/team", { replace: true }), 1000);
        } else {
          toast.error(
            response.status === 400 ? USER_NOT_FOUND_TOAST : SERVER_ERROR_TOAST,
            { position: "bottom-center" }
          );
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error(SERVER_ERROR_TOAST, { duration: 2000 });
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setGoogleLoading(false);
    },
    scope: "openid profile email",
  });

  return (
    <>
      <Toaster />
      <Card size="md" layout="centeredAndSpaced">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{LOGIN_PAGE_TITLE}</h2>
            <p className="text-muted-foreground text-sm">
              {LOGIN_PAGE_SUBTITLE}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={() => login()}
              isLoading={googleLoading}
              loadingText={LOADING_TEXT}
            >
              <FcGoogle className="text-lg" />
              {GOOGLE_BUTTON_TEXT}
            </Button>

            <FormDivider text={DIVIDER_TEXT} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: { value: true, message: REQUIRED_EMAIL_ERROR },
                  pattern: {
                    value: EMAIL_REGEX,
                    message: INVALID_EMAIL_ERROR,
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    error={errors.email?.message ? true : false}
                    {...field}
                  />
                )}
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">
                  {errors.email.message as string}
                </p>
              )}

              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: { value: true, message: REQUIRED_PASSWORD_ERROR },
                    pattern: {
                      value: PASSWORD_REGEX,
                      message: INVALID_PASSWORD_ERROR,
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      placeholder={PASSWORD_PLACEHOLDER}
                      error={errors.password?.message ? true : false}
                      {...field}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">
                  {errors.password.message as string}
                </p>
              )}

              <Button
                className="w-full"
                type="submit"
                isLoading={loading}
                loadingText={LOADING_TEXT}
              >
                {EMAIL_BUTTON_TEXT}
              </Button>
            </form>

            <div className="text-center space-y-2 pt-2">
              <p className="text-sm text-muted-foreground">
                {NO_ACCOUNT_TEXT}{" "}
                <NavigationLink to="/register" variant="link" underline>
                  {SIGNUP_BUTTON_TEXT}
                </NavigationLink>
              </p>
              <NavigationLink
                to="/forgot-password"
                variant="ghost"
                size="default"
                className="text-sm"
              >
                {FORGOT_PASSWORD_BUTTON_TEXT}
              </NavigationLink>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Login;
