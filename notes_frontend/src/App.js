import React, { useState, useEffect } from 'react';
import './App.css';

// --- Theme Colors ---
const COLOR = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ffca28"
};

// Utility for localStorage persistence
const STORAGE_KEY = 'notes-app-data';

// PUBLIC_INTERFACE
function loadNotes() {
  /** Loads notes from localStorage or returns empty array. */
  const json = window.localStorage.getItem(STORAGE_KEY);
  if (!json) return [];
  try {
    return JSON.parse(json) || [];
  } catch { return []; }
}

// PUBLIC_INTERFACE
function saveNotes(notes) {
  /** Saves notes array to localStorage. */
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// PUBLIC_INTERFACE
function Navbar({ search, setSearch }) {
  /** Top navigation bar with app title and a search bar. */
  return (
    <nav className="navbar" style={{
      background: COLOR.primary,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.5rem 1.5rem",
      height: 64,
      boxShadow: "0 1px 7px 0 rgba(25, 118, 210, 0.03)"
    }}>
      <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>
        🗒️ NoteEase
      </span>
      <input
        type="search"
        placeholder="Search notes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          padding: "7px 14px",
          fontSize: 15,
          outline: "none",
          width: 200,
          transition: "width 0.25s"
        }}
        aria-label="Search notes"
      />
    </nav>
  );
}

// PUBLIC_INTERFACE
function NoteCard({ note, onEdit, onDelete }) {
  /** Card or List-item for a single note. */
  return (
    <div className="note-card" style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 1.5px 8px 0 rgba(66, 66, 66, 0.08)",
      padding: "17px 19px 13px 19px",
      margin: "8px 0",
      border: `1px solid #f2f2f2`,
      minHeight: 76,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      transition: "box-shadow .2s"
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: 17,
        marginBottom: 4,
        color: COLOR.primary,
        wordBreak: "break-word"
      }}>
        {note.title}
      </div>
      <div style={{
        color: "#263238",
        opacity: 0.77,
        fontSize: 15,
        lineHeight: 1.5,
        marginBottom: 9,
        whiteSpace: "pre-line"
      }}>
        {note.content.length > 150 ? note.content.slice(0, 150) + "..." : note.content}
      </div>
      <div style={{ fontSize: 12, color: "#aaa" }}>
        {new Date(note.updated_at).toLocaleString()}
      </div>
      <div style={{ position: "absolute", right: 9, bottom: 9 }}>
        <button className="icon-btn" aria-label="Edit" onClick={onEdit} title="Edit" style={{
          marginRight: 6,
          border: "none",
          background: "none",
          color: COLOR.primary,
          cursor: "pointer",
          fontSize: 16
        }}>✏️</button>
        <button className="icon-btn" aria-label="Delete" onClick={onDelete} title="Delete" style={{
          border: "none",
          background: "none",
          color: "#b71c1c",
          cursor: "pointer",
          fontSize: 16
        }}>🗑️</button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function FloatingButton({ onClick }) {
  /** Floating Action Button for adding a new note */
  return (
    <button
      className="fab"
      onClick={onClick}
      title="Add Note"
      aria-label="Add Note"
      style={{
        position: "fixed",
        zIndex: 90,
        right: 32,
        bottom: 32,
        width: 56,
        height: 56,
        borderRadius: "50%",
        border: "none",
        outline: "none",
        background: COLOR.accent,
        color: "#333",
        boxShadow: "0 5px 18px 0 rgba(255, 202, 40, 0.21)",
        fontSize: 32,
        fontWeight: 900,
        cursor: "pointer",
        transition: "background 0.1s, filter 0.1s"
      }}>＋</button>
  );
}

// PUBLIC_INTERFACE
function NoteEditor({ open, initial, onSave, onCancel }) {
  /** Modal dialog for adding or editing a note. */
  const [title, setTitle] = useState(initial ? initial.title : "");
  const [content, setContent] = useState(initial ? initial.content : "");

  useEffect(() => {
    setTitle(initial ? initial.title : "");
    setContent(initial ? initial.content : "");
  }, [initial, open]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: 200,
        background: "rgba(33, 44, 77, 0.09)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}
      onClick={onCancel}
    >
      <div
        className="modal-card"
        style={{
          background: "#fff",
          borderRadius: 15,
          padding: "30px 30px 23px 30px",
          minWidth: 310, maxWidth: "92vw", width: 370,
          boxShadow: "0 10px 28px 0 rgba(25, 118, 210, 0.13)",
          display: "flex", flexDirection: "column"
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 14, color: COLOR.primary, textAlign: "center" }}>
          {initial && initial.id ? "Edit Note" : "New Note"}
        </div>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note Title"
          autoFocus
          maxLength={64}
          style={{
            fontSize: 16,
            fontWeight: 500,
            marginBottom: 12,
            padding: "7px 10px",
            border: `1px solid ${COLOR.primary}33`,
            borderRadius: 8,
            outline: "none",
            background: "#f8fafc"
          }}
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Note content here..."
          rows={6}
          maxLength={1800}
          style={{
            fontSize: 15,
            resize: "vertical",
            marginBottom: 18,
            padding: "7px 10px",
            border: `1px solid #b0bec5`,
            borderRadius: 8,
            minHeight: 68,
            outline: "none",
            background: "#f8fafc"
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              background: "#f5f5f5",
              color: "#333",
              border: "none",
              borderRadius: 8,
              padding: "8px 17px",
              marginRight: 9,
              fontWeight: 500,
              fontSize: 15,
              cursor: "pointer"
            }}
          >Cancel</button>
          <button
            disabled={!title.trim() || !content.trim()}
            onClick={() => {
              onSave({
                title: title.trim(),
                content: content.trim()
              });
            }}
            style={{
              background: COLOR.primary,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 19px",
              fontWeight: 700,
              fontSize: 15,
              cursor: !title.trim() || !content.trim() ? "not-allowed" : "pointer",
              opacity: !title.trim() || !content.trim() ? 0.7 : 1
            }}
          >Save</button>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function NotesList({ notes, onEdit, onDelete }) {
  /** Displays a list of NoteCard components. */
  if (notes.length === 0) {
    return (
      <div style={{
        color: "#bdbdbd",
        textAlign: "center",
        margin: "38px 0 0 0",
        fontSize: 18
      }}>
        No notes found.
      </div>
    );
  }
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      maxWidth: 650,
      margin: "auto"
    }}>
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * The main app: note CRUD, search, modal editor, and theme (light).
   */
  // Notes state
  const [notes, setNotes] = useState([]);
  // For search
  const [search, setSearch] = useState('');
  // Modal
  const [editing, setEditing] = useState(null); // null or { id, ... }
  const [modalOpen, setModalOpen] = useState(false);

  // Load notes from storage on mount
  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  // Persist notes on change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Actions
  const addNote = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const editNote = (note) => {
    setEditing(note);
    setModalOpen(true);
  };
  const deleteNote = (note) => {
    if (window.confirm("Delete this note?")) {
      setNotes(notes.filter(n => n.id !== note.id));
    }
  };
  const handleSave = ({ title, content }) => {
    if (editing && editing.id) {
      const id = editing.id;
      setNotes(notes.map(n =>
        n.id === id ? { ...n, title, content, updated_at: new Date().toISOString() } : n
      ));
    } else {
      const newNote = {
        id: Date.now().toString(),
        title, content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setNotes([newNote, ...notes]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  // Search filter: simple case-insensitive title/content check
  const filtered = search.trim()
    ? notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase())
        || n.content.toLowerCase().includes(search.toLowerCase())
      )
    : notes;

  return (
    <div className="app-global-bg" style={{
      minHeight: "100vh",
      background: "#f8f9fa",
      fontFamily: "'Inter',sans-serif"
    }}>
      <Navbar search={search} setSearch={setSearch} />
      <main style={{
        margin: "0 auto",
        paddingTop: 30,
        minHeight: "80vh",
        maxWidth: 740
      }}>
        <NotesList notes={filtered} onEdit={editNote} onDelete={deleteNote} />
      </main>
      <NoteEditor
        open={modalOpen}
        initial={editing}
        onSave={handleSave}
        onCancel={() => { setModalOpen(false); setEditing(null); }}
      />
      <FloatingButton onClick={addNote} />
      <footer style={{
        textAlign: "center", fontSize: 13, opacity: 0.38, marginTop: 38, marginBottom: 8
      }}>
        &copy; {new Date().getFullYear()} NoteEase
      </footer>
    </div>
  );
}

export default App;
