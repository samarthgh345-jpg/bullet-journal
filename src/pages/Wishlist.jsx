import { useState } from "react";
import { useJournal } from "../context/JournalContext";
import "./Wishlist.css";

const categories = ["buy", "learn", "experience", "build"];

function Wishlist() {
  const { wishlist: items, addWishlistItem, toggleWishlistItem, deleteWishlistItem } = useJournal();

  const [text, setText] = useState("");
  const [category, setCategory] = useState("buy");

  const handleAddItem = (e) => {
    e.preventDefault();
    addWishlistItem(text, category);
    setText("");
  };

  return (
    <div className="wishlist-page fade-in">
      <div className="page-heading welcome">
        <p className="small-title">little dreams ✦</p>
        <h2>wishlist</h2>
        <p className="date">things I want to make happen</p>
      </div>

      <div className="journal-card form-wrapper">
        <form className="wishlist-form" onSubmit={handleAddItem}>
          <input
            className="wishlist-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="add something..."
          />

          <select
            className="wishlist-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="buy">things to buy</option>
            <option value="learn">things to learn</option>
            <option value="experience">things to experience</option>
            <option value="build">things to build</option>
          </select>

          <button className="add-task-button" type="submit">
            + add
          </button>
        </form>
      </div>

      <div className="wishlist-grid">
        {categories.map((categoryName) => {
          const categoryItems = items.filter(
            (item) => item.category === categoryName
          );

          const titles = {
            buy: "things to buy",
            learn: "things to learn",
            experience: "things to experience",
            build: "things to build",
          };

          return (
            <div className="journal-card wishlist-card" key={categoryName}>
              <h3>{titles[categoryName]}</h3>

              {categoryItems.length === 0 ? (
                <p className="wishlist-empty">nothing here yet...</p>
              ) : (
                <div className="wishlist-items">
                  {categoryItems.map((item) => (
                    <div
                      className={
                        item.completed
                          ? "wishlist-item completed"
                          : "wishlist-item"
                      }
                      key={item.id}
                    >
                      <label className="task-checkbox-wrapper">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleWishlistItem(item.id)}
                        />
                        <span className="checkbox-custom" />
                      </label>

                      <span className="wishlist-text">{item.text}</span>

                      <button
                        className="delete-task remove-btn"
                        onClick={() => deleteWishlistItem(item.id)}
                        title="Delete item"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Wishlist;
