import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Root layout wrapper for authenticated pages.
 *
 * Provides:
 * - Sticky top navigation bar with app branding, "New Entry" button, and Logout action
 * - Centered main content area with responsive max-width
 * - Consistent background and padding
 *
 * Used as a wrapper around all protected routes (journal list, journal detail, new journal, etc.)
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/journals" className="text-xl font-bold text-blue-600">
            Ruminarium
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/journals/new" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + New Entry
            </Link>
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;