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
import AuthLayout from "./layouts/AuthLayout"; // Import the new layout
import TimerPage from "./pages/Timer";
import AddTeamMembers from "./pages/Onboarding/AddTeamMembers";
import TeamMembers from "./pages/Team";
import DebugPage from "./pages/Debug"; // Import the new DebugPage
import Unauthorized from "./pages/Unauthorized";

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
      {/* <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] w-full px-4"> */}
      <Routes>
        {/* Public routes without AuthLayout */}
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Authentication routes wrapped in AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-resend" element={<ResendForgotEmail />} />
          <Route path="/register/setPassword" element={<SetPassword />} />
          <Route path="/register/verifyCode" element={<VerifyCode />} />
          <Route path="/new-password" element={<ResetNewPassword />} />
        </Route>

        {/* Protected routes (already have their own structure/layout potentially) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/create-organization" element={<CreateOrganization />} />
          <Route path="/add-employee" element={<AddTeamMembers />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/team" element={<TeamMembers />} />
        </Route>
        {/* Add the debug route */}
        <Route path="/debug" element={<DebugPage />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
      {/* </div> */}
    </>
  );
}

export default App;
