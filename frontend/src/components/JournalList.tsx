import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { journalServices } from '../api/journal';
import { authService } from '../api/auth';
import type { Journal, User, JournalSearchResult } from '../types';
import Layout from './Layout';
import { Plus, SlidersHorizontal, Lightbulb, Book, Sparkles, Loader2, SearchX } from 'lucide-react';

/**
 * Main screen displaying the user's list of journal entries.
 *
 * Features:
 * - Fetches current user profile and all journals on mount
 * - Handles authentication/authorization failures by clearing token and redirecting to login
 * - Shows loading state, error message, empty state, or grid of journal cards
 * - Clicking a journal card navigates to the detail/edit view
 * - Accepts optional searchQuery + searchResults props from Layout to show search state
 */

interface JournalListProps {
  searchQuery?: string;
  searchResults?: JournalSearchResult[];
}

const JournalList: React.FC<JournalListProps> = ({ searchQuery = '', searchResults }) => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await authService.getMe();
        setCurrentUser(user);
        const data = await journalServices.getJournals();
        setJournals(data);
      } catch (err) {
        console.error("Auth failed", err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const getCoverColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-[#2e1a4a] to-[#1a0b2e]',
      'bg-gradient-to-br from-[#1a2e1a] to-[#0b1a0b]',
      'bg-gradient-to-br from-[#2e1a1a] to-[#1a0b0b]',
      'bg-gradient-to-br from-[#1a1a2e] to-[#0b0b1a]',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
          <p className="text-gray-400 font-serif italic">Opening your sanctuary...</p>
        </div>
      </Layout>
    );
  }

  // Determine if we're in search mode
  const isSearching = searchQuery.trim().length > 0;
  const hasResults = searchResults && searchResults.length > 0;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          {isSearching ? (
            <>
              <h1 className="text-5xl font-serif text-white mb-3">Search Results</h1>
              <p className="text-gray-400">
                {hasResults
                  ? <>Showing <span className="text-white font-medium">{searchResults!.length}</span> reflection{searchResults!.length !== 1 ? 's' : ''} for "<span className="text-purple-400">{searchQuery}</span>"</>
                  : <>No reflections found for "<span className="text-purple-400">{searchQuery}</span>"</>
                }
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-serif text-white mb-3">My Sanctuary</h1>
              <p className="text-gray-400">
                Welcome back, <span className="text-white font-medium">{currentUser?.email.split('@')[0] || 'Seeker'}</span>.{' '}
                You have {journals.length} total reflections.
              </p>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition font-medium">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <button
            onClick={() => navigate('/journals/new')}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition shadow-lg shadow-purple-900/40"
          >
            <Plus className="w-5 h-5" /> New Entry
          </button>
        </div>
      </div>

      {/* ── Search: No Results ── */}
      {isSearching && !hasResults && (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
            <SearchX className="w-9 h-9 text-gray-600" />
          </div>
          <div>
            <p className="text-2xl font-serif text-gray-400 italic">No reflections found</p>
            <p className="text-sm text-gray-600 mt-2">Try a different word or phrase.</p>
          </div>
          <button
            onClick={() => navigate('/journals/new')}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition"
          >
            Write something new
          </button>
        </div>
      )}

      {/* ── Search: Results List ── */}
      {isSearching && hasResults && (
        <div className="flex flex-col gap-4">
          {searchResults!.map((result) => (
            <div
              key={result.id}
              onClick={() => navigate(`/journals/${result.id}`)}
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 hover:bg-white/8 hover:border-purple-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-serif text-white group-hover:text-purple-200 transition">
                  {result.title}
                </h2>
                <span className="text-[11px] text-gray-500 whitespace-nowrap mt-1">
                  {new Date(result.created_at).toLocaleDateString()}
                </span>
              </div>
              {result.snippet && (
                <p
                  className="text-sm text-gray-400 mt-2 leading-relaxed [&_b]:text-purple-300 [&_b]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: result.snippet }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Default: Full Journal Grid ── */}
      {!isSearching && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              onClick={() => navigate('/journals/new')}
              className="aspect-[3/4] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition">
                <Plus className="text-purple-400 w-6 h-6" />
              </div>
              <span className="text-gray-500 font-medium">Create New Journal</span>
            </div>

            {journals.map((j, index) => (
              <div
                key={j.id}
                onClick={() => navigate(`/journals/${j.id}`)}
                className={`aspect-[3/4] ${getCoverColor(index)} rounded-3xl p-8 flex flex-col justify-between border border-white/5 hover:scale-[1.02] hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden group`}
              >
                <Book className="absolute -right-4 -top-4 w-32 h-32 text-white/5 rotate-12 group-hover:rotate-0 transition-transform" />

                <div className="relative z-10">
                  <Sparkles className="w-6 h-6 text-purple-400/60 mb-6" />
                </div>

                <div className="relative z-10">
                  <h2 className="text-2xl font-serif text-white mb-4 leading-tight group-hover:text-purple-200 transition">
                    {j.title}
                  </h2>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-400 font-bold border-t border-white/10 pt-4">
                    <span>Entry</span>
                    <span>{new Date(j.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                <Lightbulb className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-serif italic text-white leading-tight">
                  "What is a memory you want to preserve today?"
                </h3>
                <p className="text-sm text-gray-400 mt-1">A gentle nudge for your next reflection.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/journals/new')}
              className="px-8 py-3 bg-[#1a191f] text-purple-400 border border-purple-900/50 rounded-2xl font-bold hover:bg-purple-600 hover:text-white transition shadow-xl"
            >
              Write Now
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default JournalList;