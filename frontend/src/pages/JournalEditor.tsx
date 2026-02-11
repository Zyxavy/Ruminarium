import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { journalServices } from '../api/journal';
import Layout from '../components/Layout';

const JournalEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = id !== 'new';

  useEffect(() => {
    if (isEditMode && id) {
      const fetchEntry = async () => {
        setLoading(true);
        try {
          const journals = await journalServices.getJournals();
          const entry = journals.find(j => j.id === id);
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


  if (loading) return <Layout><div className="text-center py-10">Loading entry...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Title of your entry..."
              className="w-full text-3xl font-bold border-none focus:ring-0 placeholder-gray-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <hr className="border-gray-100" />

          <div>
            <textarea
              placeholder="Start writing here..."
              className="w-full h-96 border-none focus:ring-0 text-lg text-gray-700 resize-none placeholder-gray-300"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

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
}

export default JournalEditor;