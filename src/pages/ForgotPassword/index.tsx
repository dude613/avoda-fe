import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { FiLock } from "react-icons/fi";
import * as constants from "@/constants/Auth";
import {
  Button,
  Input,
  Card,
  NavigationLink,
  FormDivider,
  IconContainer,
} from "@/components/ui";

const ForgotPassword: React.FC = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const {
    titles: { FORGOT_PASSWORD_TITLE, FORGOT_PASSWORD_SUBTITLE },
    buttons: { RESET_PASSWORD_BUTTON_TEXT },
    messages: { BACK_TO_LOGIN_TEXT },
    errors: { INVALID_EMAIL_ERROR, REQUIRED_EMAIL_ERROR },
    regex: { EMAIL_REGEX },
  } = constants;

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: localStorage.getItem("email") || "",
    },
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const resData = await response.json();
      if (resData.success) {
        toast.success(resData.message || "Reset link sent to your email.");
        navigate(`/forgot-resend?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(resData.error);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to reset password.");
    }
  };

  return (
    <>
      <Toaster />
      <Card layout="centeredAndSpaced">
        <div className="text-center space-y-2">
          <IconContainer>
            <FiLock className="text-2xl" />
          </IconContainer>
          <h2 className="text-2xl font-bold">{FORGOT_PASSWORD_TITLE}</h2>
          <p className="text-muted-foreground text-sm">
            {FORGOT_PASSWORD_SUBTITLE}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="email"
            control={control}
            rules={{
              required: { value: true, message: REQUIRED_EMAIL_ERROR },
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
            {RESET_PASSWORD_BUTTON_TEXT}
          </Button>
        </form>

        <FormDivider text="or" />

        <div className="text-center">
          <NavigationLink to="/login" variant="ghost" className="text-sm hover:text-success">
            {BACK_TO_LOGIN_TEXT}
          </NavigationLink>
        </div>
      </Card>
    </>
  );
};

export default ForgotPassword;
