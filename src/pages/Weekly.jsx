import { useState, useEffect } from "react";
import { getGoals, createGoal, updateGoal, deleteGoal, getWeeklyTasks, createWeeklyTask, updateWeeklyTask, deleteWeeklyTask } from "../services/api";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function Weekly() {
  const [weeklyTasks, setWeeklyTasks] = useState({
    monday: [], tuesday: [], wednesday: [], thursday: [],
    friday: [], saturday: [], sunday: [],
  });
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState("");

  useEffect(() => {
    getWeeklyTasks()
      .then(setWeeklyTasks)
      .catch((err) => setTasksError(err.message))
      .finally(() => setLoadingTasks(false));
  }, []);

  const [goals, setGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [goalsError, setGoalsError] = useState("");

  useEffect(() => {
    getGoals("weekly")
      .then(setGoals)
      .catch((err) => setGoalsError(err.message))
      .finally(() => setLoadingGoals(false));
  }, []);

  const [selectedDay, setSelectedDay] = useState("monday");
  const [taskText, setTaskText] = useState("");

  const [goalText, setGoalText] = useState("");

  const addTask = async (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    try {
      const newTask = await createWeeklyTask({
        text: taskText,
        day: selectedDay,
      });

      setWeeklyTasks((previous) => ({
        ...previous,
        [selectedDay]: [...previous[selectedDay], newTask],
      }));
      setTaskText("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const toggleTask = async (day, id) => {
    const taskToToggle = weeklyTasks[day].find(t => t._id === id || t.id === id);
    if (!taskToToggle) return;
    const realId = taskToToggle._id || taskToToggle.id;
    try {
      const updatedTask = await updateWeeklyTask(realId, { completed: !taskToToggle.completed });
      setWeeklyTasks((previous) => ({
        ...previous,
        [day]: previous[day].map((task) =>
          (task._id === realId || task.id === realId) ? updatedTask : task
        ),
      }));
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const deleteTask = async (day, id) => {
    try {
      await deleteWeeklyTask(id);
      setWeeklyTasks((previous) => ({
        ...previous,
        [day]: previous[day].filter((task) => (task._id !== id && task.id !== id)),
      }));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const addGoal = async (e) => {
    e.preventDefault();
    if (!goalText.trim()) return;

    try {
      const newGoal = await createGoal({ text: goalText, scope: "weekly" });
      setGoals([...goals, newGoal]);
      setGoalText("");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleGoal = async (id) => {
    const goalToUpdate = goals.find(g => g._id === id);
    if (!goalToUpdate) return;
    try {
      const updatedGoal = await updateGoal(id, { completed: !goalToUpdate.completed });
      setGoals(goals.map((goal) => goal._id === id ? updatedGoal : goal));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoal(id);
      setGoals(goals.filter((g) => g._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="weekly-page">

      <div className="page-heading">
        <p className="small-title">
          weekly spread
        </p>

        <h2>this week</h2>

        <p>plan a little, do a little ✦</p>
      </div>


      {/* ADD TASK */}

      <form
        className="weekly-task-form"
        onSubmit={addTask}
      >

        <select
          value={selectedDay}
          onChange={(e) =>
            setSelectedDay(e.target.value)
          }
        >
          {days.map((day) => (
            <option
              value={day}
              key={day}
            >
              {day}
            </option>
          ))}
        </select>

        <input
          value={taskText}
          onChange={(e) =>
            setTaskText(e.target.value)
          }
          placeholder="add task to this day..."
        />

        <button type="submit" style={{ padding: "8px", background: "transparent", color: "var(--ink)", border: "none", borderBottom: "1px solid var(--ink)", cursor: "pointer", fontWeight: "bold" }}>
          +
        </button>

      </form>


      {/* DAYS */}

      <div className="weekly-grid">

        {days.map((day) => (

          <div
            className="weekly-day"
            key={day}
          >

            <div className="weekly-day-header">
              <h3>{day}</h3>

              <span>
                {weeklyTasks[day].length}
              </span>
            </div>


            <div className="weekly-task-list">

              {weeklyTasks[day].length === 0 ? (

                <p className="weekly-empty">
                  nothing planned
                </p>

              ) : (

                weeklyTasks[day].map((task) => (

                  <div
                    className={
                      task.completed
                        ? "weekly-task completed"
                        : "weekly-task"
                    }
                    key={task._id || task.id}
                  >

                    <button
                      onClick={() =>
                        toggleTask(day, task._id || task.id)
                      }
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <span>
                      {task.text}
                    </span>

                    <button
                      className="weekly-delete"
                      onClick={() =>
                        deleteTask(day, task._id || task.id)
                      }
                    >
                      ×
                    </button>

                  </div>

                ))

              )}

            </div>

          </div>

        ))}

      </div>


      {/* BOTTOM */}

      <div className="weekly-bottom">

        {/* GOALS */}

        <div className="weekly-section">

          <h3>weekly goals</h3>

          <form
            className="goal-form"
            onSubmit={addGoal}
          >

            <input
              value={goalText}
              onChange={(e) =>
                setGoalText(e.target.value)
              }
              placeholder="add a goal..."
            />

            <button type="submit" style={{ padding: "8px", background: "transparent", color: "var(--ink)", border: "none", borderBottom: "1px solid var(--ink)", cursor: "pointer", fontWeight: "bold" }}>
              +
            </button>

          </form>


          <div className="goal-list">

            {loadingGoals ? (
              <p className="weekly-empty" style={{ margin: "10px 0" }}>loading...</p>
            ) : goalsError ? (
              <p className="weekly-empty" style={{ margin: "10px 0", color: "#d9534f" }}>{goalsError}</p>
            ) : goals.length === 0 ? (
              <p className="weekly-empty" style={{ margin: "10px 0" }}>no goals set</p>
            ) : (
              goals.map((goal) => (

                <div
                  className={
                    goal.completed
                      ? "goal-item completed"
                      : "goal-item"
                  }
                  key={goal._id}
                >

                <button
                  onClick={() =>
                    toggleGoal(goal._id)
                  }
                >
                  {goal.completed ? "✓" : ""}
                </button>

                <span>
                  {goal.text}
                </span>

                <button
                  className="goal-delete"
                  onClick={() => handleDeleteGoal(goal._id)}
                >
                  ×
                </button>

              </div>
              ))
            )}
          </div>

        </div>


        {/* NOTES */}

        <div className="weekly-section">

          <h3>week notes</h3>

          <textarea
            className="weekly-notes-textarea"
            placeholder="ideas, reminders, thoughts..."
          />

        </div>

      </div>

    </div>
  );
}

export default Weekly;
