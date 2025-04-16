//src/pages/Register/VerifyCode.tsx
import OTP from "@/components/form/otp";
import { Button } from "@/components/ui/button";
import { titles, messages, toasts } from "@/constants/Auth";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyCode: React.FC = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const otp = queryParams.get("otp");
  const role = queryParams.get("role");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [navigate, location.search]);

  useEffect(() => {
    if (otp) {
      setCode(otp);
    }
  }, [otp, location.search]);

  const handleVerify = async () => {
    if (code.length < 6) {
      setError("Please fill in all the fields.");
      return;
    }

    if (!/^\d+$/.test(code)) {
      setError("Please enter a valid numeric code.");
      return;
    }
    setLoading(true);
    try {
      const otpNumber = parseInt(code, 10);
      const response = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpNumber, role: role ?? "employee" }),
      });
      const data = await response.json();
      if (data.success) {
        if (data.user && data.accessToken) {
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("userRole", data.user.role);
          toast.success(data?.message || toasts.USER_VERIFIED_TOAST, {
            duration: 2000,
          });
          setTimeout(() => {
            navigate(
              data.user.role === "admin" ? "/create-organization" : "/team",
              { replace: true }
            );
          }, 1000);
        }
      } else {
        toast.error(data?.error || toasts.USER_NOT_FOUND_TOAST, {
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error(toasts.SERVER_ERROR_TOAST);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setCode("");
    try {
      const response = await fetch(`${baseUrl}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok && response.status === 200) {
        toast.success(toasts.CODE_SENT_TOAST, { position: "bottom-center" });
      } else if (response.status === 201) {
        toast.success(toasts.USER_EXISTS_TOAST, { duration: 2000 });
        navigate("/team", { replace: true });
      } else {
        toast.error(toasts.SERVER_ERROR_TOAST, { duration: 2000 });
      }
    } catch (error) {
      toast.error(toasts.SERVER_ERROR_TOAST, { duration: 2000 });
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            {titles.VERIFY_CODE_TITLE}
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            {titles.VERIFY_CODE_SUBTITLE} {email}
          </p>

          <div className="flex justify-center mb-4">
            <OTP value={code} onChange={setCode} maxLength={6} />
          </div>

          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

          <Button onClick={handleVerify} className="w-full" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">
                  {messages.CREATING_ACCOUNT_TEXT}
                </span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </span>
            ) : (
              "Verify Code"
            )}
          </Button>

          <p className="mt-3 text-sm text-center text-gray-500">
            {messages.CODE_NOT_RECEIVED_TEXT}{" "}
          </p>
          <p
            className="mt-3 text-sm text-center text-black cursor-pointer hover:underline"
            onClick={handleResend}
          >
            {resending ? (
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">
                  {messages.RESENDING_CODE_TEXT}
                </span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </span>
            ) : (
              messages.RESEND_CODE_TEXT
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default VerifyCode;
