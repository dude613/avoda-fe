import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
/**
 * AuthLayout Component
 * Provides a consistent layout structure for authentication-related pages (Login, Register, Forgot Password, etc.).
 * Typically centers the content vertically and horizontally on the page.
 */
const AuthLayout = () => (
  <div className="flex flex-col min-h-screen bg-background">
    <Header />
    {/* Container to constrain the width of the auth forms/cards */}
    <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
      <Outlet /> {/* Renders the specific auth page component (e.g., Login, Register) */}
    </main>
  </div>
);

export default AuthLayout;
