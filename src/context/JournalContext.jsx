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




  /* =========================
     MONTHLY GOALS
  ========================= */

  /* =========================
     WEEKLY TASKS
  ========================= */


  /* =========================
     WEEKLY GOALS
  ========================= */

  /* =========================
     SAVE EVERYTHING
  ========================= */


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
