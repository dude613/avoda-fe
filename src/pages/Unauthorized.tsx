import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="text-lg text-gray-600 mb-8">You don't have permission to access this page.</p>
      <Link 
        to="/team" 
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized; 