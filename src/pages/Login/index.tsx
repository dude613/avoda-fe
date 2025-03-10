// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Header from "../../components/Header";

// const API_URL = import.meta.env.VITE_BACKEND_URL;

// const Login: React.FC = () => {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(`${API_URL}/auth/login`, {
//         email,
//         password,
//       });
//       localStorage.setItem("token", data.token);
//       navigate("/");
//     } catch (error: any) {
//       console.error(error.response?.data?.error || "Login failed");
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="flex flex-col items-center justify-center h-screen">
//         <h2 className="text-2xl font-bold mb-4">Login</h2>
//         <form
//           onSubmit={handleLogin}
//           className="w-80 bg-white p-6 rounded-lg shadow-lg"
//         >
//           <input
//             type="email"
//             placeholder="Email"
//             className="border p-2 w-full mb-2"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="border p-2 w-full mb-4"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button type="submit" className="bg-blue-500 text-white py-2 w-full">
//             Login
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default Login;

import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import axios from "axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmailInput(email);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handleLogin = () => {
    if (!validateEmail(emailInput)) {
      setError("Please enter a valid email address.");
    } else {
      navigate("/register/setPassword", {
        state: { email: emailInput },
      });
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            Login
          </h2>
          <p className="text-xs text-gray-500 mb-4 text-center">
            Enter your credentials to access your account
          </p>

          {/* Google Sign-In Button */}
          <label className="text-xs mb-6">Email</label>
          <button className="flex items-center justify-center border border-gray-300 w-full p-2 mb-4 rounded hover:bg-gray-100 transition">
            <FcGoogle className="text-lg" />
            <span className="text-xs pl-2">Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-xs">OR CONTINUE WITH</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Email Input */}
          <label className="text-xs mb-6">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="border text-xs p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={emailInput}
            onChange={handleEmailChange}
          />
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

          <div className="relative mb-4">
          <label className="text-xs mb-6">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border text-xs p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Login */}
          <button
            onClick={handleLogin}
            className="bg-black text-xs text-white py-2 w-full rounded hover:bg-gray-800 transition cursor-pointer"
          >
            Continue with Email
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
