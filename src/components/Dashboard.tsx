import Header from "./Header";

const Dashboard: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-sm">
          <h1 className="text-center">Welcome to Dashboard!</h1>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
