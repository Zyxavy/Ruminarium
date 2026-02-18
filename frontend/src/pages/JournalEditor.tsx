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
      <div className="mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
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
      className="rounded-lg border-blue-200 text-sm focus:ring-blue-500"
    >
      <option value="neutral">Neutral 😐</option>
      <option value="happy">Happy 😊</option>
      <option value="stressed">Stressed 😫</option>
      <option value="custom">Other... ✍️</option>
    </select>
  ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="How are you feeling?"
              value={customMoodText}
              onChange={(e) => setCustomMoodText(e.target.value)}
              className="rounded-lg border-blue-200 text-sm focus:ring-blue-500 w-40"
            />
            <button 
              onClick={() => setIsCustomMood(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleGetAiHelp}
          disabled={isAiLoading || (isCustomMood && !customMoodText)}
          className="..."
        >
          {isAiLoading ? 'Thinking...' : 'Get Suggestion'}
        </button>
      </div>
        </div>

        {aiSuggestion && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-blue-200">
            <p className="text-gray-800 italic">"{aiSuggestion}"</p>

            <div className="flex gap-4 mt-3">
              <button
                onClick={handleUseSuggestion}
                className="text-sm text-green-600 hover:underline"
              >
                Use This
              </button>

              <button
                onClick={() => setAiSuggestion(null)}
                className="text-sm text-blue-500 hover:underline"
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
