import { useJournal } from "../context/JournalContext";

function Dashboard() {

  const {
    tasks,
    habits,
    transactions,
    wishlist,
  } = useJournal();


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
            {completedTasks}/{tasks.length}
          </strong>

          <small>
            {pendingTasks} remaining
          </small>

        </div>


        <div className="dashboard-summary-card">

          <span>habits</span>

          <strong>
            {habitCount}
          </strong>

          <small>
            being tracked
          </small>

        </div>


        <div className="dashboard-summary-card">

          <span>balance</span>

          <strong>
            ₹{balance.toLocaleString("en-IN")}
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
              {taskPercentage}%
            </span>

          </div>


          {tasks.length === 0 ? (

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
                    key={task.id}
                  >

                    <span className="dashboard-check">
                      {task.completed
                        ? "✓"
                        : "○"}
                    </span>

                    <span>
                      {task.text}
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

            <span>₹</span>

          </div>


          <div className="money-breakdown">

            <div>
              <span>income</span>

              <strong>
                ₹
                {income.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>


            <div>
              <span>expenses</span>

              <strong>
                ₹
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
                ₹
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
              {habitCount}
            </span>

          </div>


          {habits.length === 0 ? (

            <p className="dashboard-empty">
              no habits yet...
            </p>

          ) : (

            <div className="dashboard-habits">

              {habits.slice(0, 5).map(
                (habit, index) => (

                  <div
                    className="dashboard-habit"
                    key={
                      habit.id ||
                      habit.name ||
                      index
                    }
                  >

                    <span>
                      {habit.name ||
                        habit.title ||
                        `habit ${index + 1}`}
                    </span>

                    <span>
                      {habit.completed
                        ? "✓"
                        : "○"}
                    </span>

                  </div>

                )
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
                    key={item.id}
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
