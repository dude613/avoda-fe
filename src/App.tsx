import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetPassword from "./pages/Register/SetPassword";
import VerifyCode from "./pages/Register/VerifyCode";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const location = useLocation();
  useEffect(() => {
    const locationP = location.pathname;
    if (locationP !== "/register" && locationP !== "/register/setPassword") {
      localStorage.removeItem("email");
    }
  }, []);

  return (
    <>
      <button onClick={() => {throw new Error("This is your first error!");}}>Break the world</button>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Register Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/register/setPassword" element={<SetPassword />} />
        <Route path="/register/verifyCode" element={<VerifyCode />} />

        {/* Protected Route for Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
