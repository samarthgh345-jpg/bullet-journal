import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

import Dashboard from "./pages/Dashboard";
import Monthly from "./pages/Monthly";
import Habits from "./pages/Habits";
import Tasks from "./pages/Tasks";
import Finance from "./pages/Finance";
import Wishlist from "./pages/Wishlist";
import Weekly from "./pages/Weekly";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import "./App.css";

const NAV_ITEMS = [
  { name: "dashboard", path: "/dashboard" },
  { name: "monthly", path: "/monthly" },
  { name: "weekly", path: "/weekly" },
  { name: "habits", path: "/habits" },
  { name: "tasks", path: "/tasks" },
  { name: "finance", path: "/finance" },
  { name: "wishlist", path: "/wishlist" },
  { name: "notes", path: "/notes" },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, isAuthenticated } = useAuth();

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    closeSidebar();
  };

  /* Restore theme on mount */
  useEffect(() => {
    const saved = localStorage.getItem("bj-theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  return (
      <div className="app">
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar} />
        )}

        <header className="mobile-header">
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <span className="mobile-logo">my journal</span>
          <span aria-hidden="true" style={{ width: 40 }} />
        </header>

        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <h1>my journal</h1>
            <p>bullet journal · 2026</p>
          </div>

          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={closeSidebar}>
                {item.name}
              </NavLink>
            ))}
            <div className="sidebar-divider" style={{ margin: "15px 0", borderBottom: "1px dashed var(--line)" }} />
            <NavLink to="/settings" onClick={closeSidebar}>
              settings
            </NavLink>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  padding: "10px",
                  marginTop: "10px",
                  cursor: "pointer",
                  color: "var(--ink)",
                  fontFamily: "inherit",
                  fontSize: "inherit"
                }}
              >
                logout
              </button>
            )}
          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/weekly" element={<Weekly />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </main>
      </div>
  );
}

export default App;
