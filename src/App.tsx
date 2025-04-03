import "./App.css";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetPassword from "./pages/Register/SetPassword";
import VerifyCode from "./pages/Register/VerifyCode";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import ForgotPassword from "./pages/ForgotPassword";
import ResendForgotEmail from "./pages/ForgotPassword/ResendForgotEmail";
import ResetNewPassword from "./pages/ForgotPassword/ResetNewPassword";
import CreateOrganization from "./pages/Onboarding/CreateOrganization ";
import Header from "./components/Header";
import AddTeamMembers from "./pages/Onboarding/AddTeamMembers";
import TeamMembers from "./pages/Team";
function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/register" && location.pathname !== "/register/setPassword") {
      localStorage.removeItem("email");
    }
  }, [location.pathname]);
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] w-full px-4">
      <Routes>
        <Route
          path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-resend" element={<ResendForgotEmail />} />
        <Route path="/register/setPassword" element={<SetPassword />} />
        <Route path="/register/verifyCode" element={<VerifyCode />} />
        <Route path="/new-password" element={<ResetNewPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/create-organization" element={<CreateOrganization />} />
          <Route path="/add-employee" element={<AddTeamMembers />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team" element={<TeamMembers />} />
        </Route>
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
      </div>
    </>
  );
}

export default App;
