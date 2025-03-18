import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    navigate("/");
  };
  return (
    <div className="bg-gray-500 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">Orlian</Link>
      </h1>
      <nav>
        {accessToken ? (
          <>
            <button
              className="mr-4 hover:underline cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}{" "}
      </nav>
    </div>
  );
};

export default Header;
