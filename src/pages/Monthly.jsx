import { useEffect, useMemo, useState } from "react";
import { useJournal } from "../context/JournalContext";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../services/api";
import { getCalendarDays } from "../utils/calendar";

function Monthly() {
  const {
    monthlyGoals: goals,
    addMonthlyGoal,
    toggleMonthlyGoal,
    deleteMonthlyGoal,
  } = useJournal();

  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("event");

  const [goalText, setGoalText] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(formatDate(today.getFullYear(), today.getMonth(), today.getDate()));
  };

  const formatDate = (y, m, d) => {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    const date = formatDate(year, month, day);
    return events.filter((event) => event.date === date);
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedDate) return;

    try {
      const newEvent = await createEvent({
        title,
        date: selectedDate,
        description,
        type,
      });

      setEvents((currentEvents) => [...currentEvents, newEvent]);
      setTitle("");
      setDescription("");
      setType("event");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      setEvents((currentEvents) =>
        currentEvents.filter((event) => event._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalText.trim()) return;
    addMonthlyGoal(goalText);
    setGoalText("");
  };

  const selectedEvents = selectedDate
    ? events.filter((event) => event.date === selectedDate)
    : [];

  return (
    <div className="monthly-page">
      {/* HEADER */}
      <div className="monthly-header">
        <div>
          <p className="small-title">monthly spread</p>
          <h2>{monthName}</h2>
          <p>{year} · plan intentionally</p>
        </div>

        <div className="month-controls">
          <button onClick={previousMonth}>←</button>
          <button onClick={goToToday}>today</button>
          <button onClick={nextMonth}>→</button>
        </div>
      </div>

      {error && <p className="form-error" style={{ color: "#d9534f" }}>{error}</p>}

      {/* CALENDAR */}
      <section className="monthly-calendar">
        <div className="calendar-weekdays">
          <div>sun</div>
          <div>mon</div>
          <div>tue</div>
          <div>wed</div>
          <div>thu</div>
          <div>fri</div>
          <div>sat</div>
        </div>

        <div className="calendar-grid">
          {days.map((day, index) => {
            if (!day) {
              return (
                <div className="calendar-day empty" key={`empty-${index}`} />
              );
            }

            const dayEvents = getEventsForDay(day);
            const dateStr = formatDate(year, month, day);

            return (
              <button
                className={
                  isToday(day)
                    ? "calendar-day today"
                    : selectedDate === dateStr
                    ? "calendar-day selected"
                    : "calendar-day"
                }
                key={day}
                onClick={() => setSelectedDate(dateStr)}
              >
                <span className="calendar-number">{day}</span>

                {dayEvents.length > 0 && (
                  <div className="calendar-event-preview">
                    {dayEvents.slice(0, 2).map((event) => (
                      <span key={event._id}>
                        {event.type === "event" ? "○" : event.type === "deadline" ? "!" : "•"} {event.title}
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <small>+{dayEvents.length - 2} more</small>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* BELOW CALENDAR */}
      <div className="monthly-bottom">
        {/* SELECTED DATE */}
        <section className="journal-card monthly-events">
          <div className="monthly-card-heading">
            <div>
              <p className="section-label">selected date</p>
              <h3>
                {selectedDate
                  ? selectedDate
                  : "choose a date"}
              </h3>
            </div>
          </div>

          {selectedDate ? (
            <>
              <form className="monthly-event-form" onSubmit={handleAddEvent} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event title..."
                  required
                />
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (optional)"
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <select value={type} onChange={(e) => setType(e.target.value)} style={{ flex: 1 }}>
                    <option value="event">event</option>
                    <option value="deadline">deadline</option>
                    <option value="reminder">reminder</option>
                  </select>
                  <button type="submit" style={{ width: "40px" }}>+</button>
                </div>
              </form>

              <div className="monthly-event-list">
                {selectedEvents.length === 0 ? (
                  <p className="monthly-empty">nothing planned for this day.</p>
                ) : (
                  selectedEvents.map((event) => (
                    <div className="monthly-event" key={event._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <strong>
                          {event.type === "event" ? "○" : event.type === "deadline" ? "!" : "•"} {event.title}
                        </strong>
                        {event.description && <p style={{ margin: "2px 0 0 15px", fontSize: "12px", color: "var(--light-ink)" }}>{event.description}</p>}
                        <small style={{ marginLeft: "15px", fontSize: "10px", opacity: 0.7 }}>{event.type}</small>
                      </div>
                      <button onClick={() => handleDeleteEvent(event._id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", color: "var(--light-ink)" }}>
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <p className="monthly-empty">click any day in the calendar to add an event.</p>
          )}
        </section>

        {/* GOALS */}
        <section className="journal-card monthly-goals">
          <div className="monthly-card-heading">
            <div>
              <p className="section-label">this month</p>
              <h3>goals</h3>
            </div>
          </div>

          <form className="monthly-goal-form" onSubmit={handleAddGoal}>
            <input
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="add a goal..."
            />
            <button type="submit">+</button>
          </form>

          <div className="monthly-goal-list">
            {goals.length === 0 ? (
              <p className="monthly-empty">what do you want to accomplish?</p>
            ) : (
              goals.map((goal) => (
                <div
                  className={goal.completed ? "monthly-goal completed" : "monthly-goal"}
                  key={goal.id}
                >
                  <button onClick={() => toggleMonthlyGoal(goal.id)}>
                    {goal.completed ? "✓" : ""}
                  </button>
                  <span>{goal.text}</span>
                  <button
                    className="goal-delete"
                    onClick={() => deleteMonthlyGoal(goal.id)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Monthly;
