import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Toaster, toast } from "react-hot-toast";
import Button from "../../ui/Button";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import Email from "@/components/form/email";
import {
  REGISTER_PAGE_TITLE, REGISTER_PAGE_SUBTITLE,
  GOOGLE_BUTTON_TEXT, EMAIL_BUTTON_TEXT,
  DIVIDER_TEXT, INVALID_EMAIL_ERROR,
  EMAIL_REGEX,
  REGISTER_SUCCESS_TOAST,
  USER_EXISTS_TOAST,
  REGISTER_PAGE_SUBTITLE_SIGN_UP
} from "@/constants/Register";
import { SERVER_ERROR_TOAST } from "@/constants/Login";
import Card from "@/ui/Card";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm(); 

  const validateEmail = (email: string) => {
    return EMAIL_REGEX.test(email) ? true : INVALID_EMAIL_ERROR;
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
          toast.success(REGISTER_SUCCESS_TOAST, { duration: 2000 });
          navigate("/create-organization", { replace: true });
        } else if (response.status === 404) {
          toast.error(USER_EXISTS_TOAST, { duration: 2000 });
        } else {
          toast.error(SERVER_ERROR_TOAST, { duration: 2000 });
        }
      } catch (error) { 
        console.error("Google login error:", error);
        toast.error(SERVER_ERROR_TOAST, { duration: 2000 });
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
        <h2 className="text-xl text-background font-bold mb-2 text-center leading-tight">
          {REGISTER_PAGE_TITLE}
        </h2>
        <p className="text-sm text-gray-500 font-semibold mb-4 text-center">
          {REGISTER_PAGE_SUBTITLE}{" "}
          <Link to={"/login"} className="hover:underline">
            {REGISTER_PAGE_SUBTITLE_SIGN_UP}
          </Link>
        </p>

        <Button
          onClick={() => registerWithGoogle()}
          text={GOOGLE_BUTTON_TEXT}
          icon={<FcGoogle className="text-lg" />}
          className="flex items-center justify-center border-border border w-full p-2 mb-4 rounded-sm hover:ring-1 hover:ring-ring transition cursor-pointer"
        />

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">{DIVIDER_TEXT}</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mb-4">
            <Controller
              name="email"
              control={control}
              rules={{
                required: INVALID_EMAIL_ERROR,
                validate: validateEmail,
              }}
              render={({ field }) => (
                <Email
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleEmailChange(e);
                  }}
                  error={errors.email?.message?.toString()}
                />
              )}
            />
          </div>
          <Button
            type="submit"
            className="bg-primary text-sm text-white font-bold py-3 w-full rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-center"
            text={EMAIL_BUTTON_TEXT}
          />
        </form>
      </Card>
    </>
  );
};

export default Register;
