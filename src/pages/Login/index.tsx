import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Button from "../../ui/Button";
import Card from "@/ui/Card";
import {
  LOGIN_PAGE_TITLE, LOGIN_PAGE_SUBTITLE, GOOGLE_BUTTON_TEXT, EMAIL_BUTTON_TEXT, SIGNUP_LINK_TEXT, FORGOT_PASSWORD_LINK_TEXT,
  PASSWORD_PLACEHOLDER, DIVIDER_TEXT, NO_ACCOUNT_TEXT,
  INVALID_EMAIL_ERROR, REQUIRED_EMAIL_ERROR, REQUIRED_PASSWORD_ERROR, LOADING_TEXT, LOGIN_SUCCESS_TOAST,
  USER_NOT_FOUND_TOAST, SERVER_ERROR_TOAST, INVALID_PASSWORD_ERROR, EMAIL_REGEX, PASSWORD_REGEX
} from "@/constants/Login";
import { LoginAPI } from "@/service/api";
import Email from "@/components/form/email";
import PasswordWithStrength from "@/components/form/PasswordWithStrength";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    const { email, password } = data;
    setLoading(true);
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
          text={GOOGLE_BUTTON_TEXT}
          icon={<FcGoogle className="text-lg" />}
          className="flex items-center justify-center border-border border w-full p-2 mb-4 rounded-sm hover:ring-1 hover:ring-ring transition cursor-pointer"
        />
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
              required: REQUIRED_EMAIL_ERROR,
              pattern: {
                value: EMAIL_REGEX,
                message: INVALID_EMAIL_ERROR,
              },
            }}
            render={({ field }) => (
              <>
                <Email
                  {...field}
                  error={errors.email?.message?.toString()}
                />
              </>
            )}
          />
        </div>

        <div className="relative mb-4">
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: REQUIRED_PASSWORD_ERROR,
              pattern: {
                value: PASSWORD_REGEX,
                message: INVALID_PASSWORD_ERROR,
              },
            }}
            render={({ field }) => (
              <>

                <PasswordWithStrength
                  placeholder={PASSWORD_PLACEHOLDER}
                  value={field.value}
                  showLabel={true}
                  onChange={field.onChange}
                  error={errors.password?.message?.toString()}
                />
              </>
            )}
          />
        </div>

        <Button
          onClick={handleSubmit(onSubmit)}
          text={loading ? LOADING_TEXT : EMAIL_BUTTON_TEXT}
          className="bg-primary text-sm text-white font-bold py-3 w-full rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-center"
        />

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
