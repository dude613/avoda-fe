import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <div className="bg-gray-500 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">My App</Link>
      </h1>
      <nav>
        <Link to="/login" className="mr-4 hover:underline">
          Login
        </Link>
        <Link to="/register" className="hover:underline">
          Register
        </Link>
      </nav>
    </div>
  );
};

export default Header;
