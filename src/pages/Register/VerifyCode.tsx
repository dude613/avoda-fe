import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const VerifyCode: React.FC = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
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
      const code = otp.split("");
      setCode(code);
    }
  }, [otp, location.search]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async (code: any) => {
    if (code.some((digit: any) => digit === "")) {
      setError("Please fill in all the fields.");
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
      const data = await response.json();
      if (data.success === true) {
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("accessToken", data.accessToken);
        toast.success(data?.message || "User verified successfully");
        setTimeout(() => {
          navigate("/create-organization", { replace: true });
        }, 1000);
      } else {
        toast.error(data?.error || "User already verified");
        setTimeout(() => {
          navigate("/register", { replace: true });
        }, 1000);
      }
    } catch (error) {
      toast.error("Server error");
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
        toast.success("Verification code sent successfully", {
          position: "bottom-center",
        });
      } else if (response.status === 201) {
        toast.success("User already verified", { position: "bottom-center" });
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
      } else {
        toast.error("Server error", { position: "bottom-center" });
      }
    } catch (error) {
      toast.error("Server error", { position: "bottom-center" });
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
            Enter Verification Code
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            We've sent a 6-digit code to {email}
          </p>

          <div className="flex justify-between mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="border text-center w-10 h-10 text-xl"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

          <button
            onClick={() => handleVerify(code)}
            className="bg-black text-white py-2 w-full rounded flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-pulse">Verifying</span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </>
            ) : (
              "Verify Code"
            )}
          </button>

          <p className="text-gray-500 text-sm text-center mt-3">
            Didn't receive the code?{" "}
          </p>
          <p
            className="text-black text-sm text-center mt-3 cursor-pointer hover:underline"
            onClick={handleResend}
          >
            {resending ? (
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">Resending</span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </span>
            ) : (
              "Resend Code"
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default VerifyCode;
