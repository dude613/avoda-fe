import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  // Header height is h-14 (3.5rem)
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] w-full px-4">
      <Outlet /> {/* Child auth route component renders here */}
    </div>
  );
};

export default AuthLayout;
