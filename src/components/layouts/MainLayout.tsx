import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';

/**
 * MainLayout Component
 * Provides the standard layout for the main application pages after authentication.
 * Includes common elements like the Header and renders the specific page content.
 */
const MainLayout = () => (
  <div className="flex flex-col min-h-screen bg-background">
    <Header />
    {/* Main content area with padding and responsive container */}
    <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
      <Outlet /> {/* Renders the specific main application page component */}
    </main>
    {/* Optional: Add a Footer component here if needed */}
    {/* <Footer /> */}
  </div>
);

export default MainLayout;
