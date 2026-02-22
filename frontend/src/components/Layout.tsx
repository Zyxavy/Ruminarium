import React from 'react'; // Removed useState
import { useNavigate, Link } from 'react-router-dom';
import { Search, User, Sparkles } from 'lucide-react'; // Removed Bell, BookOpen, BarChart2

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
    <div className="min-h-screen bg-[#0b0a10] text-gray-200 flex flex-col font-sans">
      {/* Top Navigation */}
      <nav className="border-b border-white/5 bg-[#0b0a10]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/journals" className="flex items-center gap-2 text-xl font-bold text-white">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Ruminarium
            </Link>
            
            {/* Search Bar */}
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search entries..." 
                className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-white placeholder:text-gray-600"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-400">
              <Link to="/journals" className="text-purple-400 border-b-2 border-purple-500 pb-1">Journals</Link>
              {/* <Link to="#" className="hover:text-white transition"></Link>
              <Link to="#" className="hover:text-white transition"></Link> */}
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-none">Log-Out</p>
                <p className="text-[10px] text-purple-400 uppercase tracking-widest mt-1"></p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center border border-white/20 hover:scale-105 transition shadow-lg shadow-purple-900/20"
              >
                <User className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-[#0b0a10]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
             <Sparkles className="w-4 h-4" /> Ruminarium
          </div>
          <p className="text-xs text-gray-600">© 2024 Ruminarium. Your sanctuary for reflection.</p>
          <div className="flex gap-6 text-xs text-gray-500 font-medium">
            <Link to="#" className="hover:text-white">Privacy</Link>
            <Link to="#" className="hover:text-white">Support</Link>
            <Link to="#" className="hover:text-white">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;