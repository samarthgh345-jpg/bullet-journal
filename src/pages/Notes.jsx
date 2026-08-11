import { useState } from "react";
import { useJournal } from "../context/JournalContext";

function Notes() {
  const { notes, createNote, updateNote, deleteNote } = useJournal();

  const [selectedNote, setSelectedNote] = useState(null);
  const [search, setSearch] = useState("");

  const handleCreateNote = () => {
    const id = createNote();
    setSelectedNote(id);
  };

  const handleDeleteNote = (id) => {
    deleteNote(id);
    if (selectedNote === id) {
      setSelectedNote(null);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      note.content
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const currentNote = notes.find(
    (note) => note.id === selectedNote
  );

  return (
    <div className="notes-page">

      <div className="page-heading">

        <p className="small-title">
          thoughts & ideas
        </p>

        <h2>notes</h2>

        <p>write things down before they disappear ✦</p>

      </div>


      <div className="notes-layout">

        {/* NOTE LIST */}

        <div className="notes-list-panel">

          <button
            className="new-note-button"
            onClick={handleCreateNote}
          >
            + new note
          </button>


          <input
            className="note-search"
            placeholder="search notes..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <div className="notes-list">

            {filteredNotes.length === 0 ? (

              <p className="notes-empty">
                no notes yet
              </p>

            ) : (

              filteredNotes.map((note) => (

                <div
                  className={
                    selectedNote === note.id
                      ? "note-list-item selected"
                      : "note-list-item"
                  }
                  key={note.id}
                  onClick={() =>
                    setSelectedNote(note.id)
                  }
                >

                  <strong>
                    {note.title ||
                      "untitled note"}
                  </strong>

                  <p>
                    {note.content ||
                      "empty note"}
                  </p>

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
                value={currentNote.title}
                onChange={(e) =>
                  updateNote(
                    currentNote.id,
                    "title",
                    e.target.value
                  )
                }
              />


              <textarea
                className="note-content-input"
                value={currentNote.content}
                onChange={(e) =>
                  updateNote(
                    currentNote.id,
                    "content",
                    e.target.value
                  )
                }
                placeholder="start writing..."
              />


              <button
                className="delete-note-button"
                onClick={() =>
                  handleDeleteNote(currentNote.id)
                }
              >
                delete note
              </button>

            </>

          ) : (

            <div className="no-note-selected">

              <p>✦</p>

              <h3>your little notebook</h3>

              <span>
                choose a note or create a new one
              </span>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Notes;
