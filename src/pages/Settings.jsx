import { useEffect, useRef, useState } from "react";
import {
  getTasks, createTask, updateTask,
  getHabits, createHabit,
  getFinance, addFinance,
  getNotes, createNote, updateNote,
  getWishlist, createWishlistItem, updateWishlistItem,
  getEvents, createEvent,
  getGoals, createGoal, updateGoal,
  getWeeklyTasks, createWeeklyTask, updateWeeklyTask,
  clearJournalData
} from "../services/api";

function Settings() {

  const fileInputRef = useRef(null);

  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem(
        "bulletJournalTheme"
      ) || "paper"
  );

  const [currency, setCurrency] = useState(
    () =>
      localStorage.getItem(
        "bulletJournalCurrency"
      ) || "INR"
  );

  const [firstDay, setFirstDay] = useState(
    () =>
      localStorage.getItem(
        "bulletJournalFirstDay"
      ) || "monday"
  );

  const [message, setMessage] =
    useState("");


  /* =========================
     APPLY THEME
  ========================= */

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    localStorage.setItem(
      "bulletJournalTheme",
      theme
    );
  }, [theme]);


  /* =========================
     SETTINGS
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "bulletJournalCurrency",
      currency
    );
  }, [currency]);


  useEffect(() => {
    localStorage.setItem(
      "bulletJournalFirstDay",
      firstDay
    );
  }, [firstDay]);


  /* =========================
     EXPORT
  ========================= */

  const exportJournal = async () => {
    setMessage("preparing export...");
    try {
      const [
        tasks,
        weeklyTasks,
        habits,
        events,
        transactions,
        notes,
        wishlist,
        monthlyGoals,
        weeklyGoals
      ] = await Promise.all([
        getTasks(),
        getWeeklyTasks(),
        getHabits(),
        getEvents(),
        getFinance(),
        getNotes(),
        getWishlist(),
        getGoals("monthly"),
        getGoals("weekly")
      ]);

      const journalData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        tasks,
        habits,
        transactions,
        wishlist,
        notes,
        events,
        monthlyGoals,
        weeklyGoals,
        weeklyTasks,
        settings: {
          theme,
          currency,
          firstDay,
        },
      };

      const json = JSON.stringify(journalData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bullet-journal-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage("journal exported successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Export error:", error);
      setMessage("could not export journal.");
      setTimeout(() => setMessage(""), 3000);
    }
  };


  /* =========================
     IMPORT
  ========================= */

  const importJournal = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || typeof data !== "object" || !data.version) {
          throw new Error("Invalid file format");
        }

        setMessage("importing data... this may take a moment.");

        // Import Tasks
        if (Array.isArray(data.tasks)) {
          for (const item of data.tasks) {
             try { 
               const created = await createTask({ 
                 title: item.title || item.text || "Untitled Task",
                 priority: item.priority,
                 dueDate: item.dueDate
               }); 
               if (item.completed) {
                 await updateTask(created._id || created.id, { completed: true });
               }
             } catch (err) { console.error(err); }
          }
        }
        
        // Import Weekly Tasks
        if (data.weeklyTasks && typeof data.weeklyTasks === 'object') {
          for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]) {
            if (Array.isArray(data.weeklyTasks[day])) {
              for (const item of data.weeklyTasks[day]) {
                try { 
                  const created = await createWeeklyTask({ text: item.text || "Untitled", day });
                  if (item.completed) {
                    await updateWeeklyTask(created._id || created.id, { completed: true });
                  }
                } catch (err) { console.error(err); }
              }
            }
          }
        }
        
        // Import Habits
        if (Array.isArray(data.habits)) {
          for (const item of data.habits) {
             try { await createHabit({ name: item.name || item.text, days: item.days, streak: item.streak }); } catch (err) { console.error(err); }
          }
        }

        // Import Finance (Transactions)
        if (Array.isArray(data.transactions)) {
          for (const item of data.transactions) {
             try { await addFinance({ description: item.description || item.text, amount: item.amount, type: item.type, category: item.category || "other", date: item.date }); } catch (err) { console.error(err); }
          }
        }
        
        // Import Notes
        if (Array.isArray(data.notes)) {
          for (const item of data.notes) {
             try { 
               const newNote = await createNote();
               await updateNote(newNote._id || newNote.id, { title: item.title || "Untitled", content: item.content });
             } catch (err) { console.error(err); }
          }
        }

        // Import Wishlist
        if (Array.isArray(data.wishlist)) {
          for (const item of data.wishlist) {
             try { 
               const created = await createWishlistItem({ text: item.text || "Untitled", category: item.category }); 
               if (item.completed) {
                 await updateWishlistItem(created._id || created.id, { completed: true });
               }
             } catch (err) { console.error(err); }
          }
        }

        // Import Events
        if (data.events) {
          if (Array.isArray(data.events)) {
            // New format
            for (const item of data.events) {
               try { await createEvent({ title: item.title || item.text, date: item.date, description: item.description, type: item.type }); } catch (err) { console.error(err); }
            }
          } else if (typeof data.events === 'object') {
            // Old format
            for (const dateKey of Object.keys(data.events)) {
              if (Array.isArray(data.events[dateKey])) {
                for (const item of data.events[dateKey]) {
                  try { await createEvent({ title: item.title || item.text, date: dateKey }); } catch (err) { console.error(err); }
                }
              }
            }
          }
        }

        // Import Monthly Goals
        if (Array.isArray(data.monthlyGoals)) {
          for (const item of data.monthlyGoals) {
             try { 
               const created = await createGoal({ text: item.text || "Untitled", scope: "monthly" }); 
               if (item.completed) {
                 await updateGoal(created._id || created.id, { completed: true });
               }
             } catch (err) { console.error(err); }
          }
        }

        // Import Weekly Goals
        if (Array.isArray(data.weeklyGoals)) {
          for (const item of data.weeklyGoals) {
             try { 
               const created = await createGoal({ text: item.text || "Untitled", scope: "weekly" }); 
               if (item.completed) {
                 await updateGoal(created._id || created.id, { completed: true });
               }
             } catch (err) { console.error(err); }
          }
        }

        // Import Preferences
        if (data.settings) {
          if (data.settings.theme) setTheme(data.settings.theme);
          if (data.settings.currency) setCurrency(data.settings.currency);
          if (data.settings.firstDay) setFirstDay(data.settings.firstDay);
        }

        setMessage("journal imported. refreshing...");
        setTimeout(() => {
          window.location.reload();
        }, 1500);

      } catch (error) {
        console.error(error);
        setMessage("could not import this file.");
        setTimeout(() => setMessage(""), 3000);
      }
    };

    reader.readAsText(file);

    event.target.value = "";
  };


  /* =========================
     CLEAR DATA
  ========================= */

  const clearJournal = async () => {
    const confirmation = window.prompt(
      'To permanently delete ALL your journal data (tasks, finances, habits, etc.), type "CLEAR":'
    );

    if (confirmation !== "CLEAR") {
      if (confirmation !== null) {
        setMessage("clear cancelled. data was not deleted.");
        setTimeout(() => setMessage(""), 3000);
      }
      return;
    }

    setMessage("clearing journal data...");

    try {
      await clearJournalData();
      
      // Also clear any legacy localStorage state to be safe
      const keys = [
        "bulletJournalTasks",
        "bulletJournalHabits",
        "bulletJournalFinance",
        "bulletJournalWishlist",
        "bulletJournalNotes",
        "bulletJournalEvents",
        "bulletJournalMonthlyGoals",
        "bulletJournalWeekly",
        "bulletJournalWeeklyGoals",
      ];
      keys.forEach((key) => localStorage.removeItem(key));

      setMessage("journal data cleared. refreshing...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("failed to clear journal.");
      setTimeout(() => setMessage(""), 3000);
    }
  };


  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="settings-header">

        <div>

          <p className="small-title">
            customize
          </p>

          <h2>settings</h2>

          <p>
            make your journal feel like yours.
          </p>

        </div>

        <div className="settings-symbol">
          ⚙
        </div>

      </div>


      {/* MESSAGE */}

      {message && (
        <div className="settings-message">
          {message}
        </div>
      )}


      {/* APPEARANCE */}

      <section className="journal-card settings-card">

        <div className="settings-card-heading">

          <div>

            <p className="section-label">
              appearance
            </p>

            <h3>journal style</h3>

          </div>

        </div>


        <div className="settings-option">

          <div>

            <strong>
              theme
            </strong>

            <p>
              choose how your journal looks.
            </p>

          </div>


          <select
            value={theme}
            onChange={(e) =>
              setTheme(e.target.value)
            }
          >

            <option value="paper">
              Paper
            </option>

            <option value="warm">
              Warm
            </option>

            <option value="dark">
              Dark
            </option>

          </select>

        </div>

      </section>


      {/* JOURNAL */}

      <section className="journal-card settings-card">

        <div className="settings-card-heading">

          <div>

            <p className="section-label">
              journal
            </p>

            <h3>preferences</h3>

          </div>

        </div>


        <div className="settings-option">

          <div>

            <strong>
              currency
            </strong>

            <p>
              used when displaying money.
            </p>

          </div>


          <select
            value={currency}
            onChange={(e) =>
              setCurrency(e.target.value)
            }
          >

            <option value="INR">
              ₹ INR
            </option>

            <option value="USD">
              $ USD
            </option>

            <option value="EUR">
              € EUR
            </option>

            <option value="GBP">
              £ GBP
            </option>

          </select>

        </div>


        <div className="settings-option">

          <div>

            <strong>
              first day of week
            </strong>

            <p>
              controls weekly calendar layout.
            </p>

          </div>


          <select
            value={firstDay}
            onChange={(e) =>
              setFirstDay(e.target.value)
            }
          >

            <option value="monday">
              Monday
            </option>

            <option value="sunday">
              Sunday
            </option>

          </select>

        </div>

      </section>


      {/* DATA */}

      <section className="journal-card settings-card">

        <div className="settings-card-heading">

          <div>

            <p className="section-label">
              data
            </p>

            <h3>your journal</h3>

          </div>

        </div>


        <div className="settings-option">

          <div>

            <strong>
              export journal
            </strong>

            <p>
              save a backup of everything
              in your journal.
            </p>

          </div>


          <button
            className="settings-button"
            onClick={exportJournal}
          >
            export JSON
          </button>

        </div>


        <div className="settings-option">

          <div>

            <strong>
              import journal
            </strong>

            <p>
              restore a previously exported
              journal.
            </p>

          </div>


          <button
            className="settings-button"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            import JSON
          </button>


          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={importJournal}
            style={{
              display: "none",
            }}
          />

        </div>


        <div className="settings-danger">

          <div>

            <strong>
              clear journal
            </strong>

            <p>
              permanently remove all
              journal data from this browser.
            </p>

          </div>


          <button
            className="settings-danger-button"
            onClick={clearJournal}
          >
            clear everything
          </button>

        </div>

      </section>


      {/* FOOTER */}

      <div className="settings-footer">

        <span>✦</span>

        <p>
          your journal, your little world.
        </p>

        <span>✦</span>

      </div>

    </div>
  );
}

export default Settings;
