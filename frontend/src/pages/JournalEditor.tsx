import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { journalServices } from '../api/journal';
import { aiService } from '../api/ai';
import Layout from '../components/Layout';
import { 
  ArrowLeft, Sparkles, Zap, X, Save, Loader2,
  PanelRightClose, PanelRightOpen, Trash2 // Added Trash2 icon
} from 'lucide-react';

const JournalEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAssistant, setShowAssistant] = useState(true);
  
  const [mood, setMood] = useState('neutral');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCustomMood, setIsCustomMood] = useState(false);
  const [customMoodText, setCustomMoodText] = useState('');

  const isEditMode = Boolean(id && id !== 'new');

  const wordCount = useMemo(() => content.trim() ? content.trim().split(/\s+/).length : 0, [content]);
  const readingTime = useMemo(() => `${Math.ceil(wordCount / 200) || 1}m Read`, [wordCount]);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchEntry = async () => {
        setLoading(true);
        try {
          const entry = await journalServices.getJournalById(id);
          if (entry) {
            setTitle(entry.title);
            setContent(entry.content || '');
          }
        } catch (err) {
          navigate('/journals');
        } finally {
          setLoading(false);
        }
      };
      fetchEntry();
    }
  }, [id, isEditMode, navigate]);

  // --- DELETE FUNCTIONALITY ---
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this entry? This cannot be undone.");
    if (confirmed && id) {
      try {
        await journalServices.deleteJournal(id);
        navigate('/journals');
      } catch (err) {
        alert("Failed to delete the entry.");
      }
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("Please add a title.");
    setIsSaving(true);
    try {
      if (isEditMode && id) {
        await journalServices.updateJournal(id, { title, content });
      } else {
        await journalServices.createJournal({ title, content });
      }
      navigate('/journals');
    } catch (err) {
      alert("Failed to save entry.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGetAiHelp = async () => {
    setIsAiLoading(true);
    try {
      const finalMood = isCustomMood ? customMoodText : mood;
      const data = await aiService.getSuggestion(finalMood);
      setAiSuggestion(data.suggestion);
    } catch (err) {
      setAiSuggestion("AI is offline.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleUseSuggestion = () => {
    if (aiSuggestion) {
      setContent((prev) => prev + "\n\n" + aiSuggestion);
      setAiSuggestion(null);
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="animate-spin mb-4 text-purple-500" />
        <p className="font-serif italic">Loading your reflection...</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="flex h-[calc(100vh-160px)] -mt-4 -mx-6 overflow-hidden relative">
        <div className="flex-1 flex flex-col px-12 py-8 overflow-y-auto transition-all duration-500">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4 text-xs tracking-widest uppercase font-bold text-gray-500">
              <button onClick={() => navigate('/journals')} className="p-2 hover:bg-white/5 rounded-full transition">
                <ArrowLeft size={18} />
              </button>
              <span className="text-purple-400">Sanctuary</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* DELETE BUTTON - Only shows in Edit Mode */}
              {isEditMode && (
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-sm"
                  title="Delete Entry"
                >
                  <Trash2 size={18} />
                </button>
              )}

              {!showAssistant && (
                <button 
                  onClick={() => setShowAssistant(true)}
                  className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <PanelRightOpen size={20} />
                </button>
              )}

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save
              </button>
            </div>
          </div>

          <div className={`mx-auto w-full flex-1 transition-all duration-500 ${showAssistant ? 'max-w-3xl' : 'max-w-5xl'}`}>
            <input
              type="text"
              placeholder="Title your entry..."
              className="w-full bg-transparent text-5xl font-serif text-white border-none focus:ring-0 placeholder-gray-800 mb-6"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex items-center gap-4 mb-10 opacity-30">
              <Sparkles size={18} className="text-purple-400" />
              <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-500 to-transparent" />
            </div>
            <textarea
              placeholder="Begin your mindful writing journey..."
              className="w-full bg-transparent text-xl leading-relaxed text-gray-300 border-none focus:ring-0 resize-none placeholder-gray-800 min-h-[400px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center gap-8 py-6 border-t border-white/5 mt-auto">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{wordCount} Words</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{readingTime}</div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className={`bg-[#0f0e16] border-l border-white/5 flex flex-col transition-all duration-500 ${showAssistant ? 'w-[380px] opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
          <div className="p-8 w-[380px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                <Zap size={20} className="text-purple-400 fill-purple-400" />
                AI Sparks
              </h3>
              <button onClick={() => setShowAssistant(false)} className="text-gray-600 hover:text-white transition-colors">
                <PanelRightClose size={20} />
              </button>
            </div>

            {/* Mood Selector Logic */}
            <div className="space-y-4 mb-8">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">How are you?</h4>
              {!isCustomMood ? (
                <select 
                  value={mood}
                  onChange={(e) => e.target.value === 'custom' ? setIsCustomMood(true) : setMood(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-300 outline-none hover:bg-white/10 transition"
                >
                  <option value="neutral">Neutral 😐</option>
                  <option value="happy">Happy 😊</option>
                  <option value="stressed">Stressed 😫</option>
                  <option value="reflective">Reflective 🕯️</option>
                  <option value="custom">Other... ✍️</option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customMoodText}
                    onChange={(e) => setCustomMoodText(e.target.value)}
                    className="flex-1 bg-white/5 border border-purple-500/30 rounded-xl py-3 px-4 text-sm text-white outline-none"
                    autoFocus
                  />
                  <button onClick={() => setIsCustomMood(false)} className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-red-400"><X size={16} /></button>
                </div>
              )}
            </div>

            <div className="min-h-[200px]">
              {aiSuggestion ? (
                <div className="p-6 bg-purple-600/10 border border-purple-500/20 rounded-2xl animate-in zoom-in-95">
                  <p className="text-sm italic text-gray-300 leading-relaxed mb-6">"{aiSuggestion}"</p>
                  <div className="flex gap-3">
                    <button onClick={handleUseSuggestion} className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-900/40">Use Spark</button>
                    <button onClick={() => setAiSuggestion(null)} className="px-4 py-2.5 bg-white/5 text-gray-400 rounded-lg text-xs font-bold">Clear</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/5 rounded-2xl text-center px-6">
                  <Sparkles className="text-gray-700 mb-3" size={24} />
                  <p className="text-xs text-gray-600">Select mood and ask for a spark.</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleGetAiHelp}
              disabled={isAiLoading || (isCustomMood && !customMoodText)}
              className="w-full mt-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} fill="currentColor" />}
              {isAiLoading ? 'Thinking...' : 'Get Reflection Spark'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JournalEditor;