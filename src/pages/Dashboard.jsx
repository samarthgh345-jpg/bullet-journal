import { useEffect, useState } from "react";
import { getTasks, updateTask, getHabits, toggleHabit, getFinance, getWishlist } from "../services/api";
import { getDateKey } from "../utils/date";

function Dashboard() {
  const currencyMap = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
  const currency = currencyMap[localStorage.getItem("bulletJournalCurrency")] || "₹";

  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksData, habitsData, financeData, wishlistData] = await Promise.all([
          getTasks(),
          getHabits(),
          getFinance(),
          getWishlist()
        ]);
        if (isMounted) {
          setTasks(tasksData);
          setHabits(habitsData);
          setTransactions(financeData);
          setWishlist(wishlistData);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const todayStr = getDateKey(new Date());

  const handleToggleTask = async (task) => {
    try {
      const updatedTask = await updateTask(task._id, { completed: !task.completed });
      setTasks(tasks.map(t => (t._id === updatedTask._id ? updatedTask : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleHabit = async (habit) => {
    try {
      const updatedHabit = await toggleHabit(habit._id, todayStr);
      setHabits(habits.map(h => (h._id === updatedHabit._id ? updatedHabit : h)));
    } catch (error) {
      console.error(error);
    }
  };


  /* =========================
     TASK CALCULATIONS
  ========================= */

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) => !task.completed
    ).length;

  const taskPercentage =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks /
            tasks.length) *
            100
        );


  /* =========================
     FINANCE
  ========================= */

  const income = transactions
    .filter(
      (item) =>
        item.type === "income"
    )
    .reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );

  const expenses = transactions
    .filter(
      (item) =>
        item.type === "expense"
    )
    .reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );

  const balance = income - expenses;


  /* =========================
     WISHLIST
  ========================= */

  const completedWishlist =
    wishlist.filter(
      (item) => item.completed
    ).length;

  const wishlistPercentage =
    wishlist.length === 0
      ? 0
      : Math.round(
          (completedWishlist /
            wishlist.length) *
            100
        );


  /* =========================
     HABITS
  ========================= */

  const habitCount = habits.length;


  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <p className="small-title">
            welcome back
          </p>

          <h2>my journal</h2>

          <p className="dashboard-date">
            a little space for everything
          </p>

        </div>

        <div className="dashboard-symbol">
          ✦
        </div>

      </div>


      {/* QUICK SUMMARY */}

      <div className="dashboard-summary">

        <div className="dashboard-summary-card">

          <span>tasks</span>

          <strong>
            {loading ? "-" : `${completedTasks}/${tasks.length}`}
          </strong>

          <small>
            {loading ? "loading..." : `${pendingTasks} remaining`}
          </small>

        </div>


        <div className="dashboard-summary-card">

          <span>habits</span>

          <strong>
            {loading ? "-" : habitCount}
          </strong>

          <small>
            being tracked
          </small>

        </div>


        <div className="dashboard-summary-card">

          <span>balance</span>

          <strong>
            {currency}{balance.toLocaleString("en-IN")}
          </strong>

          <small>
            income − expenses
          </small>

        </div>


        <div className="dashboard-summary-card">

          <span>wishlist</span>

          <strong>
            {completedWishlist}/
            {wishlist.length}
          </strong>

          <small>
            {wishlistPercentage}% complete
          </small>

        </div>

      </div>


      {/* MAIN GRID */}

      <div className="dashboard-grid">


        {/* TASKS */}

        <section className="journal-card dashboard-section">

          <div className="dashboard-section-title">

            <div>
              <p className="section-label">
                today
              </p>

              <h3>important to do</h3>
            </div>

            <span>
              {loading ? "-" : `${taskPercentage}%`}
            </span>

          </div>


          {loading ? (

            <p className="dashboard-empty">
              loading tasks...
            </p>

          ) : tasks.length === 0 ? (

            <p className="dashboard-empty">
              no tasks yet...
            </p>

          ) : (

            <div className="dashboard-task-list">

              {tasks.slice(0, 5).map(
                (task) => (

                  <div
                    className={
                      task.completed
                        ? "dashboard-task completed"
                        : "dashboard-task"
                    }
                    key={task._id}
                    onClick={() => handleToggleTask(task)}
                    style={{ cursor: "pointer" }}
                  >

                    <span className="dashboard-check">
                      {task.completed
                        ? "✓"
                        : "○"}
                    </span>

                    <span>
                      {task.title}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* FINANCE */}

        <section className="journal-card dashboard-section">

          <div className="dashboard-section-title">

            <div>
              <p className="section-label">
                money
              </p>

              <h3>finance</h3>
            </div>

            <span>{currency}</span>

          </div>


          <div className="money-breakdown">

            <div>
              <span>income</span>

              <strong>
                {currency}
                {income.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>


            <div>
              <span>expenses</span>

              <strong>
                {currency}
                {expenses.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>


            <div className="money-total">

              <span>
                remaining
              </span>

              <strong>
                {currency}
                {balance.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

        </section>


        {/* HABITS */}

        <section className="journal-card dashboard-section">

          <div className="dashboard-section-title">

            <div>
              <p className="section-label">
                consistency
              </p>

              <h3>habits</h3>
            </div>

            <span>
              {loading ? "-" : habitCount}
            </span>

          </div>


          {loading ? (

            <p className="dashboard-empty">
              loading habits...
            </p>

          ) : habits.length === 0 ? (

            <p className="dashboard-empty">
              no habits yet...
            </p>

          ) : (

            <div className="dashboard-habits">

              {habits.slice(0, 5).map(
                (habit, index) => {
                  const completed = habit.completedDates?.includes(todayStr);
                  return (

                  <div
                    className="dashboard-habit"
                    key={
                      habit._id ||
                      index
                    }
                    onClick={() => handleToggleHabit(habit)}
                    style={{ cursor: "pointer" }}
                  >

                    <span>
                      {habit.name ||
                        `habit ${index + 1}`}
                    </span>

                    <span>
                      {completed
                        ? "✓"
                        : "○"}
                    </span>

                  </div>

                )}
              )}

            </div>

          )}

        </section>


        {/* WISHLIST */}

        <section className="journal-card dashboard-section">

          <div className="dashboard-section-title">

            <div>
              <p className="section-label">
                little dreams
              </p>

              <h3>wishlist</h3>
            </div>

            <span>
              {wishlistPercentage}%
            </span>

          </div>


          {wishlist.length === 0 ? (

            <p className="dashboard-empty">
              nothing here yet...
            </p>

          ) : (

            <div className="dashboard-wishlist">

              {wishlist
                .slice(0, 5)
                .map((item) => (

                  <div
                    className={
                      item.completed
                        ? "dashboard-wishlist-item completed"
                        : "dashboard-wishlist-item"
                    }
                    key={item._id}
                  >

                    <span>
                      {item.completed
                        ? "✓"
                        : "○"}
                    </span>

                    <span>
                      {item.text}
                    </span>

                  </div>

                ))}

            </div>

          )}

        </section>

      </div>


      {/* BOTTOM QUOTE */}

      <div className="dashboard-quote">

        <span>✦</span>

        <p>
          small steps still move you forward.
        </p>

        <span>✦</span>

      </div>

    </div>
  );
}

export default Dashboard;
