import { useEffect, useState } from "react";
import { Search, Plus, Menu, StickyNote } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  type Note,
} from "./services/noteService";
import "./App.css";
import Sidebar from "./components/Sidebar";
import NoteDetails from "./components/NoteDetails";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getNotes();
      setNotes(data);
    } catch {
      setError(true);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadNotes = async () => {
      try {
        const data = await getNotes();

        if (!ignore) {
          setNotes(data);
        }
      } catch {
        if (!ignore) {
          setError(true);
          toast.error("Failed to load notes");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadNotes();

    return () => {
      ignore = true;
    };
  }, []);

  const openCreateForm = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setShowForm(true);
  };

  const openEditForm = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setSelectedNote(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please enter a title and content");
      return;
    }

    try {
      setSaving(true);

      if (editingNote) {
        await updateNote(editingNote.id, {
          title: title.trim(),
          content: content.trim(),
        });
        toast.success("Note updated successfully");
      } else {
        await createNote({
          title: title.trim(),
          content: content.trim(),
        });
        toast.success("Note created successfully");
      }

      closeForm();
      await fetchNotes();
    } catch {
      toast.error("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (note: Note) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${note.title}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteNote(note.id);
      setNotes((prev) => prev.filter((item) => item.id !== note.id));
      setSelectedNote(null);
      toast.success("Note deleted successfully");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const filteredNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="app">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#25243a",
            border: "1px solid #e8e7f0",
            borderRadius: "12px",
            padding: "14px 18px",
            fontSize: "14px",
            fontFamily: "inherit",
            boxShadow: "0 8px 24px rgba(35, 30, 70, 0.08)",
          },
          success: {
            iconTheme: {
              primary: "#6c63ff",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#e5484d",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className="main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <strong>All Notes</strong>
          </div>

          <button className="new-note" onClick={openCreateForm}>
            <Plus size={18} />
            New Note
          </button>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <p className="eyebrow">YOUR PERSONAL SPACE</p>
              <h1>Capture your thoughts.</h1>
              <p className="subtitle">
                Keep your ideas organized, all in one place.
              </p>
            </div>

            <div className="welcome-icon">✦</div>
          </div>

          <div className="notes-header">
            <div>
              <h2>All Notes</h2>
              <p>{notes.length} notes in your workspace</p>
            </div>

            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading notes...</p>
            </div>
          ) : error ? (
            <div className="empty-note">
              <h3>Something went wrong</h3>
              <p>Could not load notes.</p>
              <button className="empty-button" onClick={fetchNotes}>
                Try again
              </button>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="empty-note">
              <div className="empty-icon">
                <StickyNote size={28} />
              </div>
              <h3>{search ? "No notes found" : "No notes yet"}</h3>
              <p>
                {search
                  ? "Try searching with another word."
                  : "Start writing down your ideas."}
              </p>
              {!search && (
                <button className="empty-button" onClick={openCreateForm}>
                  <Plus size={17} />
                  Create your first note
                </button>
              )}
            </div>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  formatDate={formatDate}
                  onView={setSelectedNote}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          Made for your thoughts <span>✦</span>
        </footer>
      </main>

      {showForm && (
        <NoteForm
          editingNote={!!editingNote}
          title={title}
          content={content}
          saving={saving}
          setTitle={setTitle}
          setContent={setContent}
          closeForm={closeForm}
          handleSubmit={handleSubmit}
        />
      )}

      {selectedNote && (
        <NoteDetails
          selectedNote={selectedNote}
          formatDate={formatDate}
          closeDetails={() => setSelectedNote(null)}
          onEdit={openEditForm}
        />
      )}
    </div>
  );
}

export default App;
