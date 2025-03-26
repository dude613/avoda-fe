import { Link, useNavigate } from "react-router-dom";
import { headerContent } from "@/constants/Header";

const Header: React.FC = () => {
  const { APP_NAME, LOGOUT_BUTTON_TEXT, LOGIN_LINK_TEXT, REGISTER_LINK_TEXT } = headerContent;
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    navigate("/");
  };
  return (
    <div className="bg-primary text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">{APP_NAME}</Link>
      </h1>
      <nav>
        {accessToken ? (
          <>
            <button
              className="mr-4 hover:underline cursor-pointer"
              onClick={handleLogout}
            >
              {LOGOUT_BUTTON_TEXT}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline">
              {LOGIN_LINK_TEXT}
            </Link>
            <Link to="/register" className="hover:underline">
              {REGISTER_LINK_TEXT}
            </Link>
          </>
        )}{" "}
      </nav>
    </div>
  );
};

export default Header;
