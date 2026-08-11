const Event = require("../models/Event");

/* =========================
   GET EVENTS
========================= */

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      user: req.userId,
    }).sort({
      date: 1,
    });

    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({
      message: "Failed to fetch events.",
    });
  }
};

/* =========================
   CREATE EVENT
========================= */

const createEvent = async (req, res) => {
  try {
    const { title, date, description, type } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Event title is required.",
      });
    }

    if (!date) {
      return res.status(400).json({
        message: "Event date is required.",
      });
    }

    const event = await Event.create({
      user: req.userId,
      title: title.trim(),
      date,
      description: description || "",
      type: type || "event",
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      message: "Failed to create event.",
    });
  }
};

/* =========================
   UPDATE EVENT
========================= */

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    const { title, date, description, type } = req.body;

    if (title !== undefined) {
      event.title = title.trim();
    }
    if (date !== undefined) {
      event.date = date;
    }
    if (description !== undefined) {
      event.description = description;
    }
    if (type !== undefined) {
      event.type = type;
    }

    await event.save();

    res.json(event);
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({
      message: "Failed to update event.",
    });
  }
};

/* =========================
   DELETE EVENT
========================= */

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    res.json({
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({
      message: "Failed to delete event.",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
