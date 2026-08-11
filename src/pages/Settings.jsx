import { useEffect, useRef, useState } from "react";
import { useJournal } from "../context/JournalContext";

function Settings() {
  const {
    tasks,
    habits,
    transactions,
    wishlist,
    notes,
    events,
    monthlyGoals,
    weeklyTasks,
    weeklyGoals,
  } = useJournal();

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

  const exportJournal = () => {
    const journalData = {
      version: 1,

      exportedAt:
        new Date().toISOString(),

      tasks,
      habits,
      transactions,
      wishlist,
      notes,
      events,
      monthlyGoals,
      weeklyTasks,
      weeklyGoals,

      settings: {
        theme,
        currency,
        firstDay,
      },
    };

    const json = JSON.stringify(
      journalData,
      null,
      2
    );

    const blob = new Blob(
      [json],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `bullet-journal-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setMessage(
      "journal exported successfully."
    );

    setTimeout(
      () => setMessage(""),
      3000
    );
  };


  /* =========================
     IMPORT
  ========================= */

  const importJournal = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {

      try {

        const data = JSON.parse(
          e.target.result
        );

        if (
          !data ||
          typeof data !== "object"
        ) {
          throw new Error(
            "Invalid file"
          );
        }


        /*
          Save imported data directly
          into localStorage.

          The easiest way to make
          every page reload it is to
          reload the application after
          importing.
        */

        localStorage.setItem(
          "bulletJournalTasks",
          JSON.stringify(
            data.tasks || []
          )
        );

        localStorage.setItem(
          "bulletJournalHabits",
          JSON.stringify(
            data.habits || []
          )
        );

        localStorage.setItem(
          "bulletJournalFinance",
          JSON.stringify(
            data.transactions || []
          )
        );

        localStorage.setItem(
          "bulletJournalWishlist",
          JSON.stringify(
            data.wishlist || []
          )
        );

        localStorage.setItem(
          "bulletJournalNotes",
          JSON.stringify(
            data.notes || []
          )
        );

        localStorage.setItem(
          "bulletJournalEvents",
          JSON.stringify(
            data.events || {}
          )
        );

        localStorage.setItem(
          "bulletJournalMonthlyGoals",
          JSON.stringify(
            data.monthlyGoals || []
          )
        );

        localStorage.setItem(
          "bulletJournalWeekly",
          JSON.stringify(
            data.weeklyTasks || {}
          )
        );

        localStorage.setItem(
          "bulletJournalWeeklyGoals",
          JSON.stringify(
            data.weeklyGoals || []
          )
        );


        if (data.settings) {

          localStorage.setItem(
            "bulletJournalTheme",
            data.settings.theme ||
              "paper"
          );

          localStorage.setItem(
            "bulletJournalCurrency",
            data.settings.currency ||
              "INR"
          );

          localStorage.setItem(
            "bulletJournalFirstDay",
            data.settings.firstDay ||
              "monday"
          );
        }


        setMessage(
          "journal imported. refreshing..."
        );

        setTimeout(() => {
          window.location.reload();
        }, 1000);

      } catch (error) {

        console.error(error);

        setMessage(
          "could not import this file."
        );

      }

    };

    reader.readAsText(file);

    event.target.value = "";
  };


  /* =========================
     CLEAR DATA
  ========================= */

  const clearJournal = () => {

    const confirmed =
      window.confirm(
        "This will permanently delete all journal data from this browser. Continue?"
      );

    if (!confirmed) return;

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

    keys.forEach((key) => {
      localStorage.removeItem(key);
    });

    setMessage(
      "journal data cleared. refreshing..."
    );

    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
