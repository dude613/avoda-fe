import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import {Button} from "@/components/ui/button";
import Password from "@/components/form/password";
import Card from "@/ui/Card";
import { titles, buttons, messages, placeholders, errors, regex, toasts } from "@/constants/Auth";

const SetPassword: React.FC = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

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
    formState: { errors: formErrors },
    watch,
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange"
  });

  const handleCreateAccount = async (data: any) => {
    if (!email) {
      toast.error(errors.INVALID_EMAIL, { duration: 2000 });
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
        }),
      });
      const responseData = await response.json();
      if (response.ok && responseData.success === true) {
        toast.success(responseData?.message || toasts.REGISTER_SUCCESS);
        navigate(`/register/verifyCode?email=${encodeURIComponent(email)}`, {
          replace: true,
        });
      } else if (response.status === 400) {
        toast.error(responseData?.error || "User already exists");
      } else {
        toast.error(responseData?.error || toasts.SERVER_ERROR);
      }
    } catch (error) {
      toast.error(toasts.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  //TODO Update the field components to be like the auth. 
  return (
    <>
      <Toaster />
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
          {titles.SET_PASSWORD_TITLE}
        </h2>
        <p className="text-xs text-gray-500 mb-4 text-center">
          {titles.SET_PASSWORD_SUBTITLE}
        </p>

        <div className="relative mb-4">
          <Controller
            name="password"
            control={control}
            rules={{
              required: errors.EMPTY_PASSWORD,
              pattern: {
                value: regex.PASSWORD,
                message: errors.INVALID_PASSWORD,
              },
            }}
            render={({ field }) => (
              <div className="relative">
                <Password
                  {...field}
                  placeholder={placeholders.PASSWORD}
                  showLabel={false}
                  error={formErrors.password?.message?.toString()} // Updated usage
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
              required: errors.EMPTY_PASSWORD,
              validate: (value) => value === watch("password") || errors.PASSWORDS_MISMATCH,
            }}
            render={({ field }) => (
              <div className="relative">
                <Password
                  {...field}
                  placeholder={placeholders.CONFIRM_PASSWORD}
                  showLabel={false}
                  error={formErrors.confirmPassword?.message?.toString()} // Updated usage
                />
              </div>
            )}
          />
        </div>

        <Button onClick={handleSubmit(handleCreateAccount)}>{loading ? messages.CREATING_ACCOUNT_TEXT : buttons.CREATE_ACCOUNT}</Button>
      </Card>
    </>
  );
};

export default SetPassword;
