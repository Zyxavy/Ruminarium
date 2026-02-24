import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, User, Sparkles, X } from 'lucide-react';
import { journalServices } from '../api/journal';
import type { JournalSearchResult } from '../types';

/**
 * Root layout wrapper for authenticated pages.
 *
 * Provides:
 * - Sticky top navigation bar with app branding, debounced search, and Logout action
 * - Centered main content area with responsive max-width
 * - Consistent background and padding
 *
 * Used as a wrapper around all protected routes (journal list, journal detail, new journal, etc.)
 */

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JournalSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Debounce: wait 400ms after user stops typing before firing the request
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await journalServices.searchJournals(query);
        setResults(data);
        setShowResults(true);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer); // Cancel previous timer on each keystroke
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleResultClick = (id: string) => {
    navigate(`/journals/${id}`);
    handleClear();
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

            {/* Search Bar with Dropdown */}
            <div className="hidden md:flex relative group" ref={searchRef}>
              {/* Search icon */}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors z-10" />

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setShowResults(true)}
                placeholder="Search entries..."
                className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-8 w-72 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-white placeholder:text-gray-600"
              />

              {/* Clear button */}
              {query && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Results Dropdown */}
              {showResults && (
                <div className="absolute top-full mt-2 left-0 w-96 bg-[#13121a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                  {isSearching ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-2" />
                      Searching...
                    </div>
                  ) : results.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      No entries found for "{query}"
                    </div>
                  ) : (
                    <ul>
                      {results.map((result) => (
                        <li key={result.id}>
                          <button
                            onClick={() => handleResultClick(result.id)}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                          >
                            <p className="text-sm font-semibold text-white truncate">{result.title}</p>
                            {result.snippet && (
                              <p
                                className="text-xs text-gray-400 mt-0.5 line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: result.snippet }}
                              />
                            )}
                            <p className="text-[10px] text-gray-600 mt-1">
                              {new Date(result.created_at).toLocaleDateString()}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-400">
              <Link to="/journals" className="text-purple-400 border-b-2 border-purple-500 pb-1">Journals</Link>
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
          <p className="text-xs text-gray-600">© 2026 Ruminarium. Your sanctuary for reflection.</p>
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