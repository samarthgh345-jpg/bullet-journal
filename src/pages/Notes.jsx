import { useState, useEffect } from "react";
import { getNotes, createNote, updateNote as apiUpdateNote, deleteNote } from "../services/api";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const data = await getNotes();
        if (isMounted) setNotes(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchNotes();
    return () => { isMounted = false; };
  }, []);

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote();
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote._id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter((n) => n._id !== id));
      if (selectedNote === id) {
        setSelectedNote(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateNote = (id, field, value) => {
    // Optimistic UI update
    setNotes((prev) =>
      prev.map((note) =>
        note._id === id ? { ...note, [field]: value } : note
      )
    );

    // Simple debounce to prevent firing API request on every keystroke
    const timeoutIdKey = `timeout_${id}_${field}`;
    clearTimeout(window[timeoutIdKey]);
    window[timeoutIdKey] = setTimeout(() => {
      apiUpdateNote(id, { [field]: value }).catch((err) => {
        setError(err.message);
      });
    }, 500);
  };

  const filteredNotes = notes.filter(
    (note) =>
      (note.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (note.content || "").toLowerCase().includes(search.toLowerCase())
  );

  const currentNote = notes.find((note) => note._id === selectedNote);

  return (
    <div className="notes-page">
      <div className="page-heading">
        <p className="small-title">thoughts & ideas</p>
        <h2>notes</h2>
        <p>write things down before they disappear ✦</p>
      </div>

      {error && <p className="form-error" style={{ color: "#d9534f" }}>{error}</p>}

      <div className="notes-layout">
        {/* NOTE LIST */}
        <div className="notes-list-panel">
          <button className="new-note-button" onClick={handleCreateNote}>
            + new note
          </button>

          <input
            className="note-search"
            placeholder="search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="notes-list">
            {loading ? (
              <p style={{ padding: "20px" }}>Loading notes...</p>
            ) : filteredNotes.length === 0 ? (
              <p className="notes-empty">no notes yet</p>
            ) : (
              filteredNotes.map((note) => (
                <div
                  className={
                    selectedNote === note._id
                      ? "note-list-item selected"
                      : "note-list-item"
                  }
                  key={note._id}
                  onClick={() => setSelectedNote(note._id)}
                >
                  <strong>{note.title || "untitled note"}</strong>
                  <p>{note.content || "empty note"}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* EDITOR */}
        <div className="note-editor">
          {currentNote ? (
            <>
              <input
                className="note-title-input"
                value={currentNote.title || ""}
                onChange={(e) =>
                  handleUpdateNote(currentNote._id, "title", e.target.value)
                }
                onFocus={(e) => {
                  if (e.target.value === "untitled note") {
                    e.target.select();
                  }
                }}
                placeholder="untitled note"
              />
              <textarea
                className="note-content-input"
                value={currentNote.content || ""}
                onChange={(e) =>
                  handleUpdateNote(currentNote._id, "content", e.target.value)
                }
                placeholder="start writing..."
              />
              <button
                className="delete-note-button"
                onClick={() => handleDeleteNote(currentNote._id)}
              >
                delete note
              </button>
            </>
          ) : (
            <div className="no-note-selected">
              <p>✦</p>
              <h3>your little notebook</h3>
              <span>choose a note or create a new one</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;
