import { useEffect, useState } from "react";
import { getHabits, createHabit, toggleHabit, deleteHabit } from "../services/api";
import { getWeekDates } from "../utils/week";
import "./Habits.css";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const weekDates = getWeekDates();

  useEffect(() => {
    const loadHabits = async () => {
      try {
        setLoading(true);
        const data = await getHabits();
        setHabits(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, []);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    try {
      const newHabit = await createHabit({
        name: habitName,
        frequency,
      });

      setHabits((currentHabits) => [newHabit, ...currentHabits]);
      setHabitName("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleToggleSpecificDate = async (habit, date) => {
    try {
      const updatedHabit = await toggleHabit(habit._id, date);
      setHabits((currentHabits) =>
        currentHabits.map((item) =>
          item._id === updatedHabit._id ? updatedHabit : item
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteHabit = async (id) => {
    try {
      await deleteHabit(id);
      setHabits((currentHabits) =>
        currentHabits.filter((habit) => habit._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="habits-page fade-in">
      <div className="page-heading welcome">
        <p className="small-title">habit tracker ✦</p>
        <h2>weekly focus</h2>
        <p className="date">build consistency</p>
      </div>

      {error && <p className="form-error" style={{ color: "#d9534f" }}>{error}</p>}

      <div className="habit-container journal-card" style={{ padding: "20px" }}>
        <div className="week-header" style={{ display: "flex", marginBottom: "15px", borderBottom: "1px dashed var(--line)", paddingBottom: "10px" }}>
          <div className="habit-name" style={{ width: "120px", fontWeight: "bold" }}>
            Habit
          </div>
          <div className="habit-days" style={{ display: "flex", flex: 1, justifyContent: "space-between" }}>
            {weekDates.map((day) => (
              <div key={day.key} className="week-day" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "30px", fontSize: "12px" }}>
                <span style={{ textTransform: "lowercase", color: "var(--light-ink)" }}>{day.label}</span>
                <strong style={{ marginTop: "4px" }}>{day.number}</strong>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", margin: "20px" }}>Loading habits...</p>
        ) : habits.length === 0 ? (
          <p style={{ textAlign: "center", margin: "20px" }}>No habits yet. Add one below!</p>
        ) : (
          habits.map((habit) => (
            <div className="habit-row" key={habit._id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <div className="habit-name-wrapper" style={{ width: "120px", display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "10px" }}>
                <span className="habit-name" title={habit.name} style={{ fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {habit.name}
                </span>
                <button
                  className="remove-btn habit-remove-icon"
                  onClick={() => handleDeleteHabit(habit._id)}
                  title="Remove habit"
                  style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", color: "var(--light-ink)" }}
                >
                  ×
                </button>
              </div>

              <div className="habit-days" style={{ display: "flex", flex: 1, justifyContent: "space-between" }}>
                {weekDates.map((day) => {
                  const completed = habit.completedDates.includes(day.key);
                  return (
                    <button
                      key={day.key}
                      onClick={() => handleToggleSpecificDate(habit, day.key)}
                      className={completed ? "habit-day completed" : "habit-day"}
                      style={{
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: completed ? "var(--ink)" : "var(--light-ink)",
                      }}
                    >
                      {completed ? "✓" : "○"}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="habit-actions" style={{ marginTop: "30px" }}>
        <form className="add-form journal-card" onSubmit={handleAddHabit} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "15px" }}>
          <input
            type="text"
            className="add-input"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="add a new habit..."
            style={{ flex: 1, border: "none", borderBottom: "1px solid var(--line)", background: "transparent", padding: "8px", fontSize: "14px", color: "inherit", outline: "none" }}
          />
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            style={{ padding: "8px", border: "1px solid var(--line)", background: "transparent", fontSize: "14px", color: "inherit", borderRadius: "4px" }}
          >
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
          </select>
          <button type="submit" className="add-btn" style={{ padding: "8px", background: "transparent", color: "var(--ink)", border: "none", borderBottom: "1px solid var(--ink)", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>
            +
          </button>
        </form>
      </div>
    </div>
  );
}

export default Habits;
