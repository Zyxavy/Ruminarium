import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { journalServices } from '../api/journal';
import { authService } from '../api/auth';
import type { Journal, User } from '../types';
import Layout from './Layout';

/**
 * Main screen displaying the user's list of journal entries.
 *
 * Features:
 * - Fetches current user profile and all journals on mount
 * - Handles authentication/authorization failures by clearing token and redirecting to login
 * - Shows loading state, error message, empty state, or grid of journal cards
 * - Clicking a journal card navigates to the detail/edit view
 */
const JournalList: React.FC = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [, setCurrentUser ] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const currentUser = await authService.getMe();
        setCurrentUser(currentUser);

        const data = await journalServices.getJournals();
        setJournals(data);
      } catch (err: any) {
        console.error("Failed to load journals", err);
        setError(
          err.response?.data?.detail || 
          "Unable to load journals. Please login again."
        );
        localStorage.removeItem('token');
        navigate('/login'); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Thoughts</h1>
        <p className="text-gray-500">Capture your moments, one entry at a time.</p>
      </header>

      {loading ? (
        <div role="status" className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="sr-only">Loading journals...</span>
        </div>
      ) : error ? (
        <p className="text-red-600 text-center py-20">{error}</p>
      ) : journals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">No entries found</h3>
          <p className="text-gray-500 mt-1">Ready to write your first journal entry?</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
        {journals.map((j) => (
          <div 
            key={j.id} 
            onClick={() => navigate(`/journals/${j.id}`)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 
                      hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 
                      cursor-pointer transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                {j.title}
              </h2>
              <span className="text-xs text-gray-400">
                {new Date(j.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-600 line-clamp-3 leading-relaxed">
              {j.content || "No content provided."}
            </p>
          </div>
        ))}
      </div>
      )}
    </Layout>
  );
};

export default JournalList;
