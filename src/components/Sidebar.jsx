import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { name: "dashboard", path: "/dashboard", icon: "◈" },
    { name: "monthly", path: "/monthly", icon: "📅" },
    { name: "habits", path: "/habits", icon: "🔥" },
    { name: "tasks", path: "/tasks", icon: "✅" },
    { name: "finance", path: "/finance", icon: "💰" },
    { name: "wishlist", path: "/wishlist", icon: "💭" },
    { name: "weekly", path: "/weekly", icon: "📋" },
    { name: "notes", path: "/notes", icon: "📝" },
  ];

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-title">
          <span className="sidebar-logo-icon">✦</span>
          my journal
          <span className="sidebar-year">2026</span>
        </div>

        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={onClose}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="theme-btn"
            onClick={() => {
              const html = document.documentElement;
              const current = html.getAttribute("data-theme");
              const next = current === "dark" ? "light" : "dark";
              html.setAttribute("data-theme", next);
              localStorage.setItem("bj-theme", next);
            }}
          >
            <span className="nav-item-icon">🌓</span>
            toggle theme
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
