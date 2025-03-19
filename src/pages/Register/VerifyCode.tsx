import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import * as Constants from "../../constants/Register";
import OTP from "@/components/form/otp";
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const VerifyCode: React.FC = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
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
      const otpCode = otp.split("");
      setCode(otpCode);
    }
  }, [otp, location.search]);

  const handleVerify = async (code: string[]) => {
    if (code.some((digit: string) => digit === "")) {
      setError(Constants.EMPTY_CODE_ERROR);
      return;
    }
    setLoading(true);
    try {
      const combinedCode = code.join("");
      const otp = parseInt(combinedCode, 10);
      const response = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      const responseData = await response.json();
      if (response.ok && response.status === 200) {
        localStorage.setItem("userId", responseData.user._id);
        localStorage.setItem("accessToken", responseData.accessToken);
        toast.success(Constants.USER_VERIFIED_TOAST, {
          position: "bottom-center",
        });
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
      } else if (response.status === 201) {
        toast.success(Constants.USER_ALREADY_VERIFIED_TOAST, { position: "bottom-center" });
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
      } else {
        toast.error(Constants.SERVER_ERROR_TOAST, { position: "bottom-center" });
      }
    } catch (error) {
      toast.error(Constants.SERVER_ERROR_TOAST, { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok && response.status === 200) {
        toast.success(Constants.CODE_SENT_TOAST, {
          position: "bottom-center",
        });
      } else if (response.status === 201) {
        toast.success(Constants.USER_ALREADY_VERIFIED_TOAST, { position: "bottom-center" });
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
      } else {
        toast.error(Constants.SERVER_ERROR_TOAST, { position: "bottom-center" });
      }
    } catch (error) {
      toast.error(Constants.SERVER_ERROR_TOAST, { position: "bottom-center" });
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
            {Constants.VERIFY_CODE_TITLE}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {Constants.VERIFY_CODE_SUBTITLE}{email}
          </p>

          <div className="mb-4">
            <OTP
              value={code.join("")}
              onChange={(value) => {
                const newCode = value.split("");
                // Create an array of exactly 6 elements
                const fullCode = Array(6).fill("").map((_, i) => newCode[i] || "");
                setCode(fullCode);
              }}
              maxLength={6}
              containerClassName="flex justify-between w-full"
            />
          </div>

          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

          <button
            onClick={() => handleVerify(code)}
            className="bg-black text-white py-2 w-full rounded flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-pulse">{Constants.VERIFYING_CODE_TEXT}</span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </>
            ) : (
              Constants.VERIFY_CODE_BUTTON_TEXT
            )}
          </button>

          <p className="text-gray-500 text-sm text-center mt-3">
            {Constants.DIDNT_RECEIVE_CODE_TEXT}{" "}
          </p>
          <p
            className="text-black text-sm text-center mt-3 cursor-pointer hover:underline"
            onClick={handleResend}
          >
            {resending ? (
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">{Constants.RESENDING_CODE_TEXT}</span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </span>
            ) : (
              Constants.RESEND_CODE_TEXT
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default VerifyCode;
