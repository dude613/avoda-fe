//src/pages/Unauthorized.tsx
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="mb-4 text-4xl font-bold text-red-600">403 - Unauthorized</h1>
      <p className="mb-8 text-lg text-gray-600">You don't have permission to access this page.</p>
      <Link
        to="/timer"
        className="px-4 py-2 text-white transition-colors rounded-md bg-primary hover:bg-primary/90"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized; 