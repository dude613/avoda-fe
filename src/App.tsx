import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetPassword from "./pages/Register/SetPassword";
import VerifyCode from "./pages/Register/VerifyCode";
import { useEffect } from "react";

function TrackRouteChange() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/register/verifyCode") {
      localStorage.removeItem("email");
    }
  }, [location.pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <TrackRouteChange />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Register Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/register/setPassword" element={<SetPassword />} />
        <Route path="/register/verifyCode" element={<VerifyCode />} />
      </Routes>
    </Router>
  );
}

export default App;
