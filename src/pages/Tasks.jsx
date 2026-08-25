import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import "./Tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const newTask = await createTask({
        title,
        priority,
        dueDate: dueDate || null,
      });
      setTasks((currentTasks) => [newTask, ...currentTasks]);
      setTitle("");
      setPriority("medium");
      setDueDate("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const updatedTask = await updateTask(task._id, {
        completed: !task.completed,
      });
      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item._id === updatedTask._id ? updatedTask : item
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditTask = async (id, updatedFields) => {
    try {
      const updatedTask = await updateTask(id, updatedFields);
      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item._id === id ? updatedTask : item
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="tasks-page fade-in">
      {/* HEADER */}
      <div className="page-heading welcome">
        <p className="small-title">task manager ✦</p>
        <h2>important to do</h2>
        <p className="date">{pendingTasks.length} tasks remaining</p>
      </div>

      {error && <p className="form-error" style={{ color: "#d9534f" }}>{error}</p>}

      {/* ADD TASK */}
      <form className="task-form journal-card" onSubmit={handleAddTask}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="write a new task..."
          className="task-input"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="task-select"
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="task-input"
          title="Due Date"
        />

        <button type="submit" className="add-task-button">
          + add
        </button>
      </form>

      {/* PENDING */}
      <div className="task-section">
        <div className="section-heading">
          <h3>pending</h3>
          <span className="count-badge">{pendingTasks.length}</span>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : pendingTasks.length === 0 ? (
          <div className="empty-state">no pending tasks ✦</div>
        ) : (
          <div className="task-list">
            {pendingTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* COMPLETED */}
      <div className="task-section completed-section">
        <div className="section-heading">
          <h3>completed</h3>
          <span className="count-badge">{completedTasks.length}</span>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : completedTasks.length === 0 ? (
          <div className="empty-state">nothing completed yet</div>
        ) : (
          <div className="task-list">
            {completedTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -----------------------------
   TASK ITEM
------------------------------ */
function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );

  const handleSave = () => {
    onEdit(task._id, {
      title: editTitle,
      priority: editPriority,
      dueDate: editDueDate || null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={task.completed ? "task-item completed" : "task-item"}>
        <div className="task-information" style={{ width: "100%", paddingRight: "10px" }}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="task-input"
            style={{ marginBottom: "10px", width: "100%" }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="task-select"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="task-input"
            />
          </div>
        </div>
        <div className="task-actions" style={{ flexDirection: "column", gap: "5px", minWidth: "120px" }}>
          <button className="action-btn" onClick={handleSave} style={{ color: "var(--ink)", width: "100%" }}>
            Save
          </button>
          <button className="action-btn" onClick={handleCancel} style={{ width: "100%" }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={task.completed ? "task-item completed" : "task-item"}>
      <div className="task-information">
        <p className="task-text">{task.title}</p>
        <div className="task-meta">
          <span className={`priority-badge ${task.priority}`}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="category-badge">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button className="action-btn" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="action-btn complete-btn" onClick={() => onToggle(task)}>
          {task.completed ? "Undo" : "✓ Complete"}
        </button>
        <button className="action-btn delete-btn" onClick={() => onDelete(task._id)}>
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

export default Tasks;
