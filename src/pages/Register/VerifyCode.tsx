import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyCode: React.FC = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { navigateNext, email } = location.state || {};
  const [error, setError] = useState("");
  const localStorageNavigateNext = localStorage.getItem("navigateNext");

  useEffect(() => {
    if (!navigateNext && !localStorageNavigateNext) {
      navigate("/register", { replace: true });
    }
  }, [navigateNext, navigate]);

  useEffect(() => {
    if (
      location.pathname === "/register/verifyCode" &&
      localStorageNavigateNext
    ) {
      window.history.pushState(null, "", "/register/verifyCode");
      window.addEventListener("popstate", handlePopState);
    } else {
      window.removeEventListener("popstate", handlePopState);
    }
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname]);

  const handlePopState = () => {
    if (location.pathname === "/register/verifyCode") {
      navigate("/register");
    }
  };

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

  const handleVerify = () => {
    localStorage.removeItem("navigateNext");
    if (code.some((digit) => digit === "")) {
      setError("Please fill in all the fields.");
      return;
    }
    navigate("/login");
  };

  return (
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
          onClick={handleVerify}
          className="bg-black text-white py-2 w-full rounded"
        >
          Verify Code
        </button>

        <p className="text-gray-500 text-sm text-center mt-3">
          Didn't receive the code?{" "}
          <span className="text-blue-600 cursor-pointer">Resend</span>
        </p>
      </div>
    </div>
  );
};

export default VerifyCode;
