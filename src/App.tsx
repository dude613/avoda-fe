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
// import Header from "./components/Header"; // Header is now part of MainLayout
import TimerPage from "./pages/Timer";
import AddTeamMembers from "./pages/Onboarding/AddTeamMembers";
import AuthLayout from "./components/layouts/AuthLayout"; // Import AuthLayout
import MainLayout from "./components/layouts/MainLayout"; // Import MainLayout
import TeamMembers from "./pages/Team";
import DebugPage from "./pages/Debug"; // Import the new DebugPage
import Unauthorized from "./pages/Unauthorized";

function App() {
  const location = useLocation();

  useEffect(() => {
    // Keep this logic if needed for clearing email on navigation
    if (location.pathname !== "/register" && location.pathname !== "/register/setPassword") {
      localStorage.removeItem("email");
    }
  }, [location.pathname]);

  const isLoggedIn = !!localStorage.getItem("accessToken");

  return (
    <Routes>
      {/* Standalone route for root path redirection */}
      <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />

      {/* Authentication Routes using AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-resend" element={<ResendForgotEmail />} />
        <Route path="/register/setPassword" element={<SetPassword />} />
        <Route path="/register/verifyCode" element={<VerifyCode />} />
        <Route path="/new-password" element={<ResetNewPassword />} />
      </Route>

      {/* Protected Main Application Routes using MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Onboarding routes might need MainLayout or a specific OnboardingLayout */}
          <Route path="/create-organization" element={<CreateOrganization />} />
          <Route path="/add-employee" element={<AddTeamMembers />} />
          {/* Core application routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/team" element={<TeamMembers />} />
        </Route>
      </Route>

      {/* Standalone routes without specific layout */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/debug" element={<DebugPage />} />

      {/* Catch-all 404 - Consider creating a dedicated 404 page/component */}
      <Route path="*" element={<Navigate to="/login" />} /> {/* Or redirect to a proper 404 page */}
    </Routes>
  );
}

export default App;
