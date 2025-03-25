import OTP from "@/components/form/otp";
import { SERVER_ERROR_TOAST } from "@/constants/Login";
import { CODE_SENT_TOAST, NOT_RECEIVE_CODE_TEXT, RESEND_CODE_TEXT, RESENDING_CODE_TEXT, USER_ALREADY_VERIFIED_TOAST, USER_EXISTS_TOAST, USER_VERIFIED_TOAST, VERIFY_CODE_SUBTITLE, VERIFY_CODE_TITLE, VERIFYING_CODE_TEXT } from "@/constants/Register";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const VerifyCode: React.FC = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const otp = queryParams.get("otp");
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
        body: JSON.stringify({ email, otp: otpNumber }),
      });
      const data = await response.json();
      if (data.success) {
        if (data.user && data.accessToken) {
          localStorage.setItem("userId", data.user._id);
          localStorage.setItem("accessToken", data.accessToken);
        }
        toast.success(data?.message || USER_VERIFIED_TOAST, { duration: 2000 });
        const onboardingSkipped = data?.onboardingSkipped;
        const destination = onboardingSkipped ? "/create-organization" : "/dashboard"
        navigate(destination, { replace: true });
      } else {
        toast.error(data?.error || USER_ALREADY_VERIFIED_TOAST, { duration: 2000 });
      }
    } catch (error) {
      toast.error(SERVER_ERROR_TOAST);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok && response.status === 200) {
        toast.success(CODE_SENT_TOAST, { position: "bottom-center" });
      } else if (response.status === 201) {
        toast.success(USER_EXISTS_TOAST, { duration: 2000 });
        navigate("/dashboard", { replace: true });
      } else {
        toast.error(SERVER_ERROR_TOAST, { duration: 2000 });
      }
    } catch (error) {
      toast.error(SERVER_ERROR_TOAST, { duration: 2000 });
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {VERIFY_CODE_TITLE}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {VERIFY_CODE_SUBTITLE} {email}
          </p>

          <div className="flex justify-center mb-4">
            <OTP value={code} onChange={setCode} maxLength={6} />
          </div>

          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

          <button
            onClick={handleVerify}
            className="bg-black text-white py-2 w-full rounded flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-pulse">{VERIFYING_CODE_TEXT}</span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </>
            ) : (
              "Verify Code"
            )}
          </button>

          <p className="text-gray-500 text-sm text-center mt-3">
            {NOT_RECEIVE_CODE_TEXT}{" "}
          </p>
          <p
            className="text-black text-sm text-center mt-3 cursor-pointer hover:underline"
            onClick={handleResend}
          >
            {resending ? (
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">{RESENDING_CODE_TEXT}</span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </span>
            ) : (
              RESEND_CODE_TEXT
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default VerifyCode;
