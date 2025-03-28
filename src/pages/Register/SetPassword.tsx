import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import {Button} from "../../ui/Button";
import Password from "@/components/form/password";
import Card from "@/ui/Card";
import * as constants from "@/constants/Auth";

const SetPassword: React.FC = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const {
    titles: { SET_PASSWORD_TITLE, SET_PASSWORD_SUBTITLE },
    toasts: { SERVER_ERROR_TOAST, REGISTER_SUCCESS_TOAST },
    messages: { CREATING_ACCOUNT_TEXT},
    buttons: { CREATE_ACCOUNT_BUTTON_TEXT },
    placeholders: { CONFIRM_PASSWORD_PLACEHOLDER, PASSWORD_PLACEHOLDER },
    errors: { PASSWORDS_MISMATCH_ERROR, EMPTY_PASSWORD_ERROR, INVALID_PASSWORD_ERROR },
    regex: { PASSWORD_REGEX }
  } = constants;

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get("email");
  const emailFromState = location.state?.email;
  const email = emailFromQuery || emailFromState || localStorage.getItem("email");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange"
  });

  const handleCreateAccount = async (data: any) => {
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
        }),
      });
      const responseData = await response.json();
      if (response.ok && responseData.success === true) {
        toast.success(responseData?.message || REGISTER_SUCCESS_TOAST);
        navigate(`/register/verifyCode?email=${encodeURIComponent(email)}`, {
          replace: true,
        });
      } else if (response.status === 400) {
        toast.error(responseData?.error || "User already exists");
      } else {
        toast.error(responseData?.error || SERVER_ERROR_TOAST);
      }
    } catch (error) {
      toast.error(SERVER_ERROR_TOAST);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
          {SET_PASSWORD_TITLE}
        </h2>
        <p className="text-xs text-gray-500 mb-4 text-center">
          {SET_PASSWORD_SUBTITLE}
        </p>

        <div className="relative mb-4">
          <Controller
            name="password"
            control={control}
            rules={{
              required: EMPTY_PASSWORD_ERROR,
              pattern: {
                value: PASSWORD_REGEX,
                message: INVALID_PASSWORD_ERROR,
              },
            }}
            render={({ field }) => (
              <div className="relative">
                <Password
                  {...field}
                  placeholder={PASSWORD_PLACEHOLDER}
                  showLabel={false}
                  error={errors.password?.message?.toString()}
                />
              </div>
            )}
          />
        </div>

        <div className="relative mb-4">
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: EMPTY_PASSWORD_ERROR,
              validate: (value) => value === watch("password") || PASSWORDS_MISMATCH_ERROR,
            }}
            render={({ field }) => (
              <div className="relative">
                <Password
                  {...field}
                  placeholder={CONFIRM_PASSWORD_PLACEHOLDER}
                  showLabel={false}
                  error={errors.confirmPassword?.message?.toString()}
                />
              </div>
            )}
          />
        </div>

        <Button onClick={handleSubmit(handleCreateAccount)}>{loading ? CREATING_ACCOUNT_TEXT : CREATE_ACCOUNT_BUTTON_TEXT}</Button>
      </Card>
    </>
  );
};

export default SetPassword;
