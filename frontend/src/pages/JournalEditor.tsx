import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { journalServices } from '../api/journal';
import { aiService } from '../api/ai';
import Layout from '../components/Layout';

const JournalEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [mood, setMood] = useState('neutral');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCustomMood, setIsCustomMood] = useState(false);
  const [customMoodText, setCustomMoodText] = useState('');

  // Safer edit mode detection
  const isEditMode = Boolean(id && id !== 'new');

  useEffect(() => {
    if (isEditMode && id) {
      const fetchEntry = async () => {
        setLoading(true);
        try {
          // Fetch only the needed journal
          const entry = await journalServices.getJournalById(id);
          if (entry) {
            setTitle(entry.title);
            setContent(entry.content || '');
          }
        } catch (err) {
          console.error("Could not load the entry");
          navigate('/journals');
        } finally {
          setLoading(false);
        }
      };

      fetchEntry();
    }
  }, [id, isEditMode, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEditMode && id) {
        await journalServices.updateJournal(id, { title, content });
      } else {
        await journalServices.createJournal({ title, content });
      }
      navigate('/journals');
    } catch (err) {
      alert("Failed to save entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entry? This cannot be undone."
    );

    if (confirmed && id) {
      try {
        await journalServices.deleteJournal(id);
        navigate('/journals');
      } catch (err) {
        alert("Failed to delete the entry.");
      }
    }
  };

  const handleGetAiHelp = async () => {
  setIsAiLoading(true);
  try {
    // Send either the selected mood or the typed custom mood
    const finalMood = isCustomMood ? customMoodText : mood;
    const data = await aiService.getSuggestion(finalMood);
    setAiSuggestion(data.suggestion);
  } catch (err) {
    setAiSuggestion("AI is offline. Check your Docker logs!");
  } finally {
    setIsAiLoading(false);
  }
};

  // Insert suggestion into textarea
  const handleUseSuggestion = () => {
    if (aiSuggestion) {
      setContent((prev) => prev + "\n\n" + aiSuggestion);
      setAiSuggestion(null);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="text-center py-10">Loading entry...</div>
      </Layout>
    );

  return (
    <Layout>
      {/* AI Assistant Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              ✨ Journaling Assistant
            </h3>
            <p className="text-sm text-blue-700">
              Need a spark? Let AI help you reflect.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isCustomMood ? (
              <select 
                value={mood}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomMood(true);
                  } else {
                    setMood(e.target.value);
                  }
                }}
                className="rounded-xl border-blue-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all px-3 py-2 outline-none"
              >
                <option value="neutral">Neutral 😐</option>
                <option value="happy">Happy 😊</option>
                <option value="stressed">Stressed 😫</option>
                <option value="custom">Other... ✍️</option>
              </select>
            ) : (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                <input
                  type="text"
                  placeholder="How are you feeling?"
                  value={customMoodText}
                  onChange={(e) => setCustomMoodText(e.target.value)}
                  className="rounded-xl border-blue-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-44 px-3 py-2 outline-none shadow-inner"
                />
                <button 
                  onClick={() => setIsCustomMood(false)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Go back"
                >
                  ✕
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleGetAiHelp}
              disabled={isAiLoading || (isCustomMood && !customMoodText)}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-blue-200"
            >
              {isAiLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Thinking...
                </span>
              ) : 'Get Suggestion'}
            </button>
          </div>
        </div>

        {/* The Suggestion Display */}
        {aiSuggestion && (
          <div className="mt-4 p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-inner animate-in zoom-in-95 duration-300">
            <p className="text-gray-800 italic leading-relaxed font-medium">
              "{aiSuggestion}"
            </p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleUseSuggestion}
                className="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>✍️</span> Use This
              </button>

              <button
                onClick={() => setAiSuggestion(null)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Editor Section */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSave} className="space-y-6">
          <input
            type="text"
            placeholder="Title of your entry..."
            className="w-full text-3xl font-bold border-none focus:ring-0 placeholder-gray-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <hr className="border-gray-100" />

          <textarea
            placeholder="Start writing here..."
            className="w-full h-96 border-none focus:ring-0 text-lg text-gray-700 resize-none placeholder-gray-300"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            {isEditMode ? (
              <button
                type="button"
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 font-medium transition"
              >
                Delete Entry
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/journals')}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-blue-300"
              >
                {isSaving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default JournalEditor;
