import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
