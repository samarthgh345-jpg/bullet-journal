import { useState } from "react";
import { useJournal } from "../context/JournalContext";

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
  const {
    weeklyTasks,
    setWeeklyTasks,
    weeklyGoals: goals,
    setWeeklyGoals: setGoals,
  } = useJournal();

  const [selectedDay, setSelectedDay] = useState("monday");
  const [taskText, setTaskText] = useState("");

  const [goalText, setGoalText] = useState("");

  const addTask = (e) => {
    e.preventDefault();

    if (!taskText.trim()) return;

    const newTask = {
      id: Date.now(),
      text: taskText.trim(),
      completed: false,
    };

    setWeeklyTasks((previous) => ({
      ...previous,
      [selectedDay]: [
        ...previous[selectedDay],
        newTask,
      ],
    }));

    setTaskText("");
  };

  const toggleTask = (day, id) => {
    setWeeklyTasks((previous) => ({
      ...previous,
      [day]: previous[day].map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      ),
    }));
  };

  const deleteTask = (day, id) => {
    setWeeklyTasks((previous) => ({
      ...previous,
      [day]: previous[day].filter(
        (task) => task.id !== id
      ),
    }));
  };

  const addGoal = (e) => {
    e.preventDefault();

    if (!goalText.trim()) return;

    setGoals((previous) => [
      ...previous,
      {
        id: Date.now(),
        text: goalText.trim(),
        completed: false,
      },
    ]);

    setGoalText("");
  };

  const toggleGoal = (id) => {
    setGoals((previous) =>
      previous.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              completed: !goal.completed,
            }
          : goal
      )
    );
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
                    key={task.id}
                  >

                    <button
                      onClick={() =>
                        toggleTask(day, task.id)
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
                        deleteTask(day, task.id)
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

            {goals.map((goal) => (

              <div
                className={
                  goal.completed
                    ? "goal-item completed"
                    : "goal-item"
                }
                key={goal.id}
              >

                <button
                  onClick={() =>
                    toggleGoal(goal.id)
                  }
                >
                  {goal.completed ? "✓" : ""}
                </button>

                <span>
                  {goal.text}
                </span>

              </div>

            ))}

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
