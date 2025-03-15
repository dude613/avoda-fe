import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useGoogleLogin } from "@react-oauth/google";
import { Toaster, toast } from "react-hot-toast";
import Button from "../../ui/Button";
import Input from "../../ui/Input";


const baseUrl = import.meta.env.VITE_BACKEND_URL;
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState(
    localStorage.getItem("email") || ""
  );
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    if (!email) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Please enter a valid email address.";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmailInput(email);
    setError(validateEmail(email));
  };

  const handleEnter = (e: any) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  const handleContinue = () => {
    const validationError = validateEmail(emailInput);
    if (validationError) {
      setError(validationError);
      return;
    }
    localStorage.setItem("email", emailInput);
    navigate("/register/setPassword", {
      state: { email: emailInput },
    });
  };

  const register = useGoogleLogin({
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
          toast.success("User registered successfully", {
            position: "bottom-center",
          });
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
        } else if (response.status === 404) {
          toast.error("User already exists", { position: "bottom-center" });
        } else {
          toast.error("Server error", { position: "bottom-center" });
        }
      } catch (error) { }
    },
    onError: (error: any) => console.error("Login Failed:", error),
    scope:
      "openid profile email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.metadata.readonly",
  });

  return (
    <>
      <Toaster />
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-sm">
          <h2 className="text-xl text-background font-bold mb-2 text-center leading-tight">
            Create an account
          </h2>
          <p className="text-sm text-gray-500 font-semibold mb-4 text-center">
            Choose how you'd like to sign up
          </p>

          <button
            onClick={() => register()}
            className="flex items-center justify-center border border-gray-300 w-full p-2 mb-4 rounded hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-lg" />
            <span className="text-sm text-background font-semibold pl-2">Continue with Google</span>
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">OR CONTINUE WITH</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <Input type="email"
            placeholder="name@example.com"
            value={emailInput}
            onChange={handleEmailChange}
            onKeyDown={handleEnter}
            error={error} />

          <Button onClick={handleContinue} text="Continue with Email" />
        </div>
      </div>
    </>
  );
};

export default Register;
