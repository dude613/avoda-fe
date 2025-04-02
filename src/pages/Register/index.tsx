import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import Email from "@/components/form/email";
import { titles, buttons, messages, errors, regex, toasts } from "@/constants/Auth";
import Card from "@/ui/Card";

const Register: React.FC = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    setValue,
    trigger,
  } = useForm();

  const validateEmail = (email: string) => {
    return regex.EMAIL.test(email) ? true : errors.INVALID_EMAIL;
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setValue("email", email);
    await trigger("email");
  };

  const onSubmit = (data: any) => {
    localStorage.setItem("email", data.email);
    navigate("/register/setPassword", {
      state: { email: data.email },
    });
  };

  const registerWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const data = JSON.stringify({
        idToken: tokenResponse.access_token,
      });
      try {
        const response = await fetch(`${baseUrl}/api/auth/google-register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });
        const responseData = await response.json();
        if (response.ok) {
          localStorage.setItem("userId", responseData.user._id);
          localStorage.setItem("accessToken", responseData.accessToken);
          toast.success(toasts.REGISTER_SUCCESS, { duration: 2000 });
          navigate("/create-organization", { replace: true });
        } else if (response.status === 404) {
          toast.error(toasts.USER_EXISTS, { duration: 2000 });
        } else {
          toast.error(toasts.SERVER_ERROR, { duration: 2000 });
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error(toasts.SERVER_ERROR, { duration: 2000 });
      }
    },
    onError: (error: any) => console.error("Login Failed:", error),
    scope:
      "openid profile email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.metadata.readonly",
  });


  return (
    <>
      <Toaster />
      <Card>
        <h2 className="text-xl font-bold mb-2 text-center">
          {titles.REGISTER_PAGE_TITLE}
        </h2>
        <p className="text-xs text-primary mb-4 text-center">
          {titles.REGISTER_PAGE_SUBTITLE}{" "}
          <Link to={"/login"} className="hover:underline">
            {titles.REGISTER_PAGE_SUBTITLE_SIGN_UP}
          </Link>
        </p>

        <Button
          onClick={() => registerWithGoogle()}
        >{buttons.GOOGLE}<FcGoogle /></Button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">{messages.DIVIDER_TEXT}</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        {/* TODO Add Form + Zod validation (export from file) */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="relative mb-4">
            <Controller
              name="email"
              control={control}
              rules={{
                required: errors.INVALID_EMAIL,
                validate: validateEmail,
              }}
              render={({ field }) => (
                <Email
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleEmailChange(e);
                  }}
                  error={formErrors.email?.message?.toString()} // Updated usage
                />
              )}
            />
          </div>
          <Button>{buttons.CONTINUE_EMAIL}</Button>
        </form>
      </Card>
    </>
  );
};

export default Register;
