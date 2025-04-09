import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Toaster, toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import * as constants from "@/constants/Auth";
import {
  Button,
  Input,
  FormDivider,
  NavigationLink,
  Card,
} from "@/components/ui";

import { EmailFormData } from "@/type";

const Register: React.FC = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const {
    titles: { REGISTER_PAGE_TITLE, REGISTER_PAGE_SUBTITLE },
    buttons: { GOOGLE_BUTTON_TEXT, EMAIL_BUTTON_TEXT, SIGN_IN_BUTTON_TEXT },
    messages: { DIVIDER_TEXT, EXISTING_ACCOUNT_TEXT },
    errors: { INVALID_EMAIL_ERROR },
    regex: { EMAIL_REGEX },
    toasts: { REGISTER_SUCCESS_TOAST, SERVER_ERROR_TOAST },
  } = constants;

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>();

  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = (data: EmailFormData) => {
    localStorage.setItem("email", data.email);
    navigate("/register/setPassword", { state: { email: data.email } });
  };

  const registerWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/auth/google-register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: tokenResponse.access_token,
            role: "admin",
          }),
        });

        const responseData = await response.json();

        if (responseData.success) {
          localStorage.setItem("userId", responseData.data.user._id);
          localStorage.setItem("accessToken", responseData.data.accessToken);
          localStorage.setItem("userRole", responseData.data.user.role);
          toast.success(REGISTER_SUCCESS_TOAST, { duration: 2000 });
          navigate("/create-organization", { replace: true });
        } else {
          console.error("Registration failed:", responseData.error);
          toast.error(responseData.error || SERVER_ERROR_TOAST);
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error(SERVER_ERROR_TOAST);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      setGoogleLoading(false);
    },
    scope:
      "openid profile email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.metadata.readonly",
  });
  return (
    <>
      <Toaster />
      <Card layout="centeredAndSpaced">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{REGISTER_PAGE_TITLE}</h2>
          <p className="text-muted-foreground text-sm">
            {REGISTER_PAGE_SUBTITLE}
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full justify-center gap-2"
          onClick={() => registerWithGoogle()}
          isLoading={googleLoading}
          loadingText="Signing up..."
        >
          <FcGoogle className="text-lg" />
          {GOOGLE_BUTTON_TEXT}
        </Button>

        <FormDivider text={DIVIDER_TEXT} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="email"
            control={control}
            rules={{
              required: INVALID_EMAIL_ERROR,
              pattern: {
                value: EMAIL_REGEX,
                message: INVALID_EMAIL_ERROR,
              },
            }}
            render={({ field }) => (
              <Input
                label="Email"
                type="email"
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

          <Button className="w-full" type="submit">
            {EMAIL_BUTTON_TEXT}
          </Button>
        </form>
        {/*TODO Make buttons same as /login*/}
        <div className="text-center text-sm text-muted-foreground">
          {EXISTING_ACCOUNT_TEXT}{" "}
          <NavigationLink to="/login" variant="link" underline>
            {SIGN_IN_BUTTON_TEXT}
          </NavigationLink>
        </div>
      </Card>
    </>
  );
};

export default Register;
