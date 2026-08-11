import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const JournalContext = createContext(null);

const getStoredData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);

    return saved
      ? JSON.parse(saved)
      : fallback;
  } catch (error) {
    console.error(
      `Could not load ${key}`,
      error
    );

    return fallback;
  }
};

export function JournalProvider({ children }) {

  /* =========================
     FINANCE
  ========================= */

  const [transactions, setTransactions] =
    useState(() =>
      getStoredData(
        "bulletJournalFinance",
        []
      )
    );


  /* =========================
     WISHLIST
  ========================= */

  const [wishlist, setWishlist] = useState(
    () =>
      getStoredData(
        "bulletJournalWishlist",
        []
      )
  );


  /* =========================
     NOTES
  ========================= */

  const [notes, setNotes] = useState(() =>
    getStoredData(
      "bulletJournalNotes",
      []
    )
  );


  /* =========================
     MONTHLY GOALS
  ========================= */

  const [monthlyGoals, setMonthlyGoals] =
    useState(() =>
      getStoredData(
        "bulletJournalMonthlyGoals",
        []
      )
    );


  /* =========================
     WEEKLY TASKS
  ========================= */

  const [weeklyTasks, setWeeklyTasks] =
    useState(() =>
      getStoredData(
        "bulletJournalWeekly",
        {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        }
      )
    );


  /* =========================
     WEEKLY GOALS
  ========================= */

  const [weeklyGoals, setWeeklyGoals] =
    useState(() =>
      getStoredData(
        "bulletJournalWeeklyGoals",
        []
      )
    );


  /* =========================
     SAVE EVERYTHING
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "bulletJournalFinance",
      JSON.stringify(transactions)
    );
  }, [transactions]);


  useEffect(() => {
    localStorage.setItem(
      "bulletJournalWishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);


  useEffect(() => {
    localStorage.setItem(
      "bulletJournalNotes",
      JSON.stringify(notes)
    );
  }, [notes]);


  useEffect(() => {
    localStorage.setItem(
      "bulletJournalMonthlyGoals",
      JSON.stringify(monthlyGoals)
    );
  }, [monthlyGoals]);


  useEffect(() => {
    localStorage.setItem(
      "bulletJournalWeekly",
      JSON.stringify(weeklyTasks)
    );
  }, [weeklyTasks]);


  useEffect(() => {
    localStorage.setItem(
      "bulletJournalWeeklyGoals",
      JSON.stringify(weeklyGoals)
    );
  }, [weeklyGoals]);


  /* =========================
     WISHLIST FUNCTIONS
  ========================= */

  const addWishlistItem = (
    text,
    category = "general"
  ) => {

    if (!text.trim()) return;

    setWishlist((previous) => [
      ...previous,

      {
        id: Date.now(),
        text: text.trim(),
        category,
        completed: false,
      },
    ]);
  };


  const toggleWishlistItem = (id) => {

    setWishlist((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              completed:
                !item.completed,
            }
          : item
      )
    );
  };


  const deleteWishlistItem = (id) => {

    setWishlist((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };


  /* =========================
     FINANCE FUNCTIONS
  ========================= */

  const addTransaction = (
    transaction
  ) => {

    setTransactions((previous) => [
      ...previous,

      {
        ...transaction,
        id: Date.now(),
        amount: Number(
          transaction.amount
        ),
      },
    ]);
  };


  const deleteTransaction = (id) => {

    setTransactions((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };


  /* =========================
     NOTES
  ========================= */

  const createNote = () => {

    const note = {
      id: Date.now(),
      title: "untitled note",
      content: "",
    };

    setNotes((previous) => [
      note,
      ...previous,
    ]);

    return note.id;
  };


  const updateNote = (
    id,
    field,
    value
  ) => {

    setNotes((previous) =>
      previous.map((note) =>
        note.id === id
          ? {
              ...note,
              [field]: value,
            }
          : note
      )
    );
  };


  const deleteNote = (id) => {

    setNotes((previous) =>
      previous.filter(
        (note) => note.id !== id
      )
    );
  };


  /* =========================
     MONTHLY GOALS
  ========================= */

  const addMonthlyGoal = (text) => {

    if (!text.trim()) return;

    setMonthlyGoals((previous) => [
      ...previous,

      {
        id: Date.now(),
        text: text.trim(),
        completed: false,
      },
    ]);
  };


  const toggleMonthlyGoal = (id) => {

    setMonthlyGoals((previous) =>
      previous.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              completed:
                !goal.completed,
            }
          : goal
      )
    );
  };


  const deleteMonthlyGoal = (id) => {

    setMonthlyGoals((previous) =>
      previous.filter(
        (goal) =>
          goal.id !== id
      )
    );
  };


  /* =========================
     CONTEXT VALUE
  ========================= */

  const value = {

    tasks: [], // Temporarily empty until Dashboard is updated to use API
    habits: [], // Temporarily empty until Dashboard is updated to use API
    events: {}, // Temporarily empty until Settings is updated to use API
    setTasks: () => {},
    addTask: () => {},
    toggleTask: () => {},
    deleteTask: () => {},
    setHabits: () => {},

    transactions,
    setTransactions,
    addTransaction,
    deleteTransaction,

    wishlist,
    setWishlist,
    addWishlistItem,
    toggleWishlistItem,
    deleteWishlistItem,

    notes,
    setNotes,
    createNote,
    updateNote,
    deleteNote,

    monthlyGoals,
    setMonthlyGoals,
    addMonthlyGoal,
    toggleMonthlyGoal,
    deleteMonthlyGoal,

    weeklyTasks,
    setWeeklyTasks,

    weeklyGoals,
    setWeeklyGoals,
  };


  return (
    <JournalContext.Provider
      value={value}
    >
      {children}
    </JournalContext.Provider>
  );
}


/* =========================
   CUSTOM HOOK
========================= */

export function useJournal() {

  const context =
    useContext(JournalContext);

  if (!context) {
    throw new Error(
      "useJournal must be used inside JournalProvider"
    );
  }

  return context;
}
