const Note = require("../models/Note");

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes." });
  }
};

const createNote = async (req, res) => {
  try {
    const note = await Note.create({
      user: req.userId,
      title: "untitled note",
      content: "",
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to create note." });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to update note." });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.json({ message: "Note deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note." });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
