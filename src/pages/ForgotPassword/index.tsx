import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import Email from "@/components/form/email";
import {Button} from "@/components/ui/button";
import { titles, buttons, messages, errors, regex } from "@/constants/Auth";
import Card from "@/ui/Card";

const ForgotPassword: React.FC = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const resData = await response.json();
      if (resData.success) {
        toast.success(resData.message || "Reset link sent to your email.");
        navigate(`/forgot-resend?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(resData.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password.");
    }
  };

  return (
    <>
      <Toaster />
      <Card>
        <div className="flex items-center justify-center">
          <div className="bg-gray-200 rounded-full w-16 h-14 flex items-center justify-center">
            <FiLock className="text-4xl" />
          </div>
        </div>

        <h2 className="mt-8 text-xl font-semibold text-gray-800 mb-2 text-center">
          {titles.FORGOT_PASSWORD_TITLE}
        </h2>
        <p className="text-xs text-gray-500 mb-4 text-center">
          {titles.FORGOT_PASSWORD_SUBTITLE}
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: errors.INVALID_EMAIL,
              pattern: {
                value: regex.EMAIL,
                message: errors.INVALID_EMAIL,
              },
            }}
            render={({ field }) => (
              <Email
                {...field}
                error={formErrors.email?.message?.toString()}
              />
            )}
          />

          <Button
            type="submit"
            className="py-3 mt-2 hover:bg-gray-900 transition cursor-pointer flex items-center justify-center"
          >{buttons.RESET_PASSWORD}</Button>
        </form>

        <p className="text-black text-sm text-center mt-5">
          <Link to="/login" className="hover:underline">
            {messages.BACK_TO_LOGIN_TEXT}
          </Link>
        </p>
      </Card>
    </>
  );
};

export default ForgotPassword;
