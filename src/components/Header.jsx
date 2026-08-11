function Header({ onMenuClick }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <header className="header">
      <div>
        <h1>my bullet journal</h1>
        <p>organize your little life ✦</p>
      </div>

      <div className="header-right">
        <span className="header-date">{dateStr}</span>
        <button className="menu-button" onClick={onMenuClick}>
          ☰
        </button>
      </div>
    </header>
  );
}

export default Header;
