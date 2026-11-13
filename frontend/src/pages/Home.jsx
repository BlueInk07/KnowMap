
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Plus, Search, Trash2, BookOpen, FileText,
  Moon, Sun, Pencil, X, Layers, Sparkles
} from 'lucide-react';

const API = 'http://localhost:8080/api/notes';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [editingId, setEditingId] = useState(null);

  const [dark, setDark] = useState(
    () => localStorage.getItem('knowmap-theme') === 'dark'
  );

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('knowmap-theme', next ? 'dark' : 'light');
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get(API);
      setNotes(res.data);
    } catch (error) {
      console.error('Unable to fetch notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('General');
    setEditingId(null);
  };

  const saveNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    const note = { title, content, category };

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, note);
      } else {
        await axios.post(API, note);
      }

      resetForm();
      fetchNotes();
    } catch (error) {
      alert('Unable to save note. Please try again.');
    }
  };

  const editNote = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchNotes();

      if (editingId === id) resetForm();
    } catch (error) {
      alert('Unable to delete note.');
    }
  };

  const filteredNotes = notes.filter(note =>
    `${note.title} ${note.content} ${note.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const card = 'rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1';
  const panel = 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800';
  const muted = 'text-slate-500 dark:text-slate-400';

  const field = 'w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-violet-900';

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-[#090d19] dark:text-slate-100">

        {/* Navbar */}
        <nav className="sticky top-0 z-20 border-b backdrop-blur-xl bg-white/90 border-slate-200 dark:bg-slate-950/90 dark:border-slate-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/25">
                <BookOpen size={23} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  KnowMap
                </h1>
                <p className={`text-xs ${muted}`}>
                  Your personal knowledge space
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-violet-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-110"
              title="Toggle theme"
            >
              {dark
                ? <Sun size={20} className="text-amber-400" />
                : <Moon size={20} className="text-slate-600" />
              }
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-10">

          {/* Heading */}
          <div className="mb-9">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm font-semibold mb-3">
              <Sparkles size={16} />
              ORGANIZE YOUR THINKING
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Your Knowledge{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">
                Library.
              </span>
            </h2>

            <p className={`mt-3 ${muted}`}>
              Capture ideas, organize information and keep everything connected.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-9">

            {[
              { label: 'Total Notes', value: notes.length, icon: FileText },
              {
                label: 'Categories',
                value: new Set(notes.map(n => n.category)).size,
                icon: Layers
              },
              { label: 'Library Status', value: 'Active', icon: BookOpen }
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className={`${card} ${panel} p-6 hover:scale-[1.02]`}
                >
                  <div className="flex justify-between items-center">
                    <p className={`text-sm ${muted}`}>{item.label}</p>

                    <div className="p-2.5 rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className={`text-3xl font-bold mt-4 ${index === 2 ? 'text-emerald-500 text-2xl' : ''}`}>
                    {item.value}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Main layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

            {/* Create / Edit form */}
            <section className={`${card} ${panel} p-6 h-fit`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {editingId ? <Pencil size={19} /> : <Plus size={20} />}
                  {editingId ? 'Edit Note' : 'Create a Note'}
                </h3>

                {editingId && (
                  <button
                    onClick={resetForm}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <form onSubmit={saveNote} className="space-y-4">

                <input
                  className={field}
                  placeholder="Note title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />

                <select
                  className={field}
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option>General</option>
                  <option>Study</option>
                  <option>Ideas</option>
                  <option>Projects</option>
                  <option>Research</option>
                </select>

                <textarea
                  className={`${field} h-40 resize-none`}
                  placeholder="Write your thoughts..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="w-full rounded-xl p-3.5 text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {editingId ? 'Update Note' : 'Save Note'}
                </button>
              </form>
            </section>

            {/* Notes section */}
            <section className="lg:col-span-2">

              {/* Search */}
              <div className={`${panel} border rounded-xl flex items-center gap-3 px-4 py-3.5 mb-6 shadow-sm focus-within:ring-2 focus-within:ring-violet-400`}>
                <Search size={19} className={muted} />

                <input
                  className="w-full bg-transparent outline-none dark:text-white"
                  placeholder="Search your knowledge library..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold">Your Notes</h3>

                <span className={`text-sm ${muted}`}>
                  {filteredNotes.length} results
                </span>
              </div>

              {/* Note cards */}
              <div className="grid sm:grid-cols-2 gap-5">

                {filteredNotes.map(note => (
                  <article
                    key={note.id}
                    className={`${card} ${panel} p-5 hover:scale-[1.015]`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                        {note.category}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => editNote(note)}
                          className="p-2 rounded-lg text-slate-400 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-500/15 transition"
                          title="Edit note"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-2 rounded-lg text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/15 transition"
                          title="Delete note"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-lg mt-5 break-words">
                      {note.title}
                    </h4>

                    <p className={`text-sm mt-2 leading-relaxed whitespace-pre-wrap break-words ${muted}`}>
                      {note.content}
                    </p>

                    <div className={`flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs ${muted}`}>
                      <FileText size={14} />
                      Note #{note.id}
                    </div>
                  </article>
                ))}
              </div>

              {/* Empty state */}
              {filteredNotes.length === 0 && (
                <div className={`${card} ${panel} p-12 text-center`}>
                  <BookOpen size={38} className="mx-auto text-violet-400" />

                  <h4 className="font-semibold mt-4">
                    No notes found
                  </h4>

                  <p className={`text-sm mt-2 ${muted}`}>
                    Create your first note to get started.
                  </p>
                </div>
              )}
            </section>
          </div>

          <footer className={`text-center text-xs mt-14 pb-5 ${muted}`}>
            KnowMap · Your ideas, organized.
          </footer>
        </main>
      </div>
    </div>
  );
}
