import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/Store";
import { isAuthorized, UserRole } from "@/config/permissions";
import { getUserProfile } from "@/redux/slice/UserProfile";

const ProtectedRoute: React.FC = () => {
  const [accessToken] = useState(localStorage.getItem("accessToken"));
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch<AppDispatch>();
  const { userProfile, loading } = useSelector((state: RootState) => state.userProfile);
  const userRole = localStorage.getItem("userRole") as UserRole || null;
//MediumTODO  incorporate fallback logic for missing localStorage values (userId, userRole) to ensure proper redirection and data fetching
  useEffect(() => {
    if (accessToken && !userProfile?.data) {
      const userId = localStorage.getItem("userId");
      if (userId) {
        dispatch(getUserProfile(userId));
      } else {
        // Fallback: userId is missing, redirect to login
        //FIXME Address the console.error i.e. Sentry etc
        console.error("User ID missing from localStorage despite access token presence. Redirecting to login.");
        // Optional: Clear potentially invalid token/role if desired
        // localStorage.removeItem("accessToken");
        // localStorage.removeItem("userRole");
        navigate("/login", { replace: true }); // Use navigate for redirection
      }
    }
  }, [accessToken, dispatch, userProfile?.data, navigate]); // Add navigate to dependency array

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized(userRole, location.pathname)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
