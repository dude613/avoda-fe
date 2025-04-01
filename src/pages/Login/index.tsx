import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Card from "@/ui/Card";
import { LoginAPI } from "@/service/api";
import AuthInput from "@/ui/AuthInput";
const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { Button } from "@/components/ui/button";
import { titles, buttons, messages, errors, regex, toasts, placeholders } from "@/constants/Auth";

type loginData = {
  email: string;
  password: string;
};

//TODO API Response Type

const Login: React.FC = () => {

  const navigate = useNavigate();
  // Rename formState errors to avoid conflict with imported constants
  const { control, handleSubmit, formState: { errors: formErrors } } = useForm<loginData>({
    // Change validation mode to onBlur to avoid premature errors
    mode: "onBlur", 
    defaultValues: {
      email: localStorage.getItem("email") || "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: loginData) => {
    const { email, password } = data;
    setLoading(true);
    try {
      const response = await LoginAPI({ email, password });
      if (response.success) {
        localStorage.setItem("userId", response.user._id);
        localStorage.setItem("accessToken", response.accessToken);
        toast.success(response.message || toasts.LOGIN_SUCCESS, { duration: 2000 });
        const onboardingSkipped = response?.onboardingSkipped;
        const destination = onboardingSkipped ? "/create-organization" : "/dashboard"
        navigate(destination, { replace: true });
      } else {
        toast.error(response.error || toasts.USER_NOT_FOUND, { duration: 2000 });
      }
    } catch {
      toast.error(toasts.SERVER_ERROR);
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
          toast.success(toasts.LOGIN_SUCCESS, { position: "bottom-center" });
          setTimeout(() => navigate("/dashboard", { replace: true }), 1000);
        } else {
          toast.error(response.status === 400 ? toasts.USER_NOT_FOUND : toasts.SERVER_ERROR, { position: "bottom-center" });
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error(toasts.SERVER_ERROR, { duration: 2000 });
      }
    },
    onError: console.error,
    scope: "openid profile email",
  });


  return (
    <>
      <Toaster />
      <Card>
        <h2 className="text-xl font-bold mb-2 text-center">{titles.LOGIN_PAGE_TITLE}</h2>
        <p className="text-xs text-primary mb-4 text-center">{titles.LOGIN_PAGE_SUBTITLE}</p>
        <Button
          onClick={() => login()}
        >{buttons.GOOGLE}<FcGoogle /></Button>
        <div className="flex items-center my-4">
          <hr className="flex-grow border border-border" />
          <span className="mx-2 text-primary text-xs">{messages.DIVIDER_TEXT}</span>
          <hr className="flex-grow border border-border" />
        </div>
        <div className="relative mb-4">
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              pattern: {
                // Convert string constant to RegExp
                value: new RegExp(regex.EMAIL), 
                message: errors.INVALID_EMAIL,
              },
            }}
            render={({ field }) => (
              <AuthInput
                {...field}
                type="email"
                label="Email"
                error={typeof formErrors.email?.message === 'string' ? formErrors.email.message : undefined} 
                showStrengthIndicator={false}
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
              required: { value: true, message: errors.INVALID_PASSWORD }, 
              pattern: {
                value: regex.PASSWORD, 
                message: errors.INVALID_PASSWORD, 
              },
            }}
            render={({ field }) => (
              <AuthInput
                {...field}
                type="password"
                label={placeholders.PASSWORD}
                error={typeof formErrors.password?.message === 'string' ? formErrors.password.message : undefined} 
                showStrengthIndicator={false}
              />
            )}
          />
        </div>

        <Button onClick={handleSubmit(onSubmit)}>{loading ? messages.LOADING_TEXT : buttons.LOGIN_TEXT}</Button>

        <p className="text-gray-900 text-sm text-center mt-3">
          {messages.NO_ACCOUNT_TEXT}{" "}
          <span className="text-sm text-black hover:underline">
            <Link to="/register">{buttons.SIGNUP_LINK_TEXT}</Link>
          </span>
        </p>

        <p className="text-xs text-center mt-5">
          <Link to="/forgot-password" className="hover:underline text-gray-400 hover:text-gray-900">
            {buttons.FORGOT_PASSWORD_LINK_TEXT}
          </Link>
        </p>
      </Card>
    </>
  );
};

export default Login;
