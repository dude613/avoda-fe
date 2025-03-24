import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
// import PasswordWithStrength from "@/components/form/PasswordWithStrength";
import Button from "../../ui/Button";
// import Input from "@/ui/Input";
import {
  SET_PASSWORD_TITLE, SERVER_ERROR_TOAST, SET_PASSWORD_SUBTITLE,
  CREATING_ACCOUNT_TEXT, CREATE_ACCOUNT_BUTTON_TEXT, REGISTER_SUCCESS_TOAST,
  CONFIRM_PASSWORD_PLACEHOLDER, PASSWORDS_MISMATCH_ERROR, EMPTY_PASSWORD_ERROR
} from "@/constants/Register";
import Password from "@/components/form/password";
import { INVALID_PASSWORD_ERROR, PASSWORD_PLACEHOLDER, PASSWORD_REGEX } from "@/constants/Login";
import Card from "@/ui/Card";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const SetPassword: React.FC = () => {
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

      if (responseData.success === true) {
        toast.success(responseData?.message || REGISTER_SUCCESS_TOAST);
        navigate(`/register/verifyCode?email=${encodeURIComponent(email)}`, {
          replace: true,
        });
      } else {
        toast.error(responseData?.error || "Error occurred");
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
                {/* <PasswordWithStrength
                    value={field.value}
                    showLabel={false}
                    onChange={field.onChange}
                  /> */}
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
                {/* <Input
                    {...field}
                    type={"password"}
                    placeholder={CONFIRM_PASSWORD_PLACEHOLDER}
                    className="border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm"
                    error={errors.confirmPassword?.message || ""}
                  /> */}
              </div>
            )}
          />
        </div>

        <Button
          onClick={handleSubmit(handleCreateAccount)}
          className="bg-primary text-sm text-white font-bold py-3 w-full rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-center"
          text={loading ? CREATING_ACCOUNT_TEXT : CREATE_ACCOUNT_BUTTON_TEXT}
        />
      </Card>
    </>
  );
};

export default SetPassword;
