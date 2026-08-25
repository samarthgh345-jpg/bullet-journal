import { useState, useEffect } from "react";
import {
  getWishlist,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
} from "../services/api";
import "./Wishlist.css";

const categories = ["buy", "learn", "experience", "build", "general"];

function Wishlist() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("buy");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const data = await getWishlist();
        if (isMounted) setItems(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchWishlist();
    return () => { isMounted = false; };
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const newItem = await createWishlistItem({ text, category });
      setItems([newItem, ...items]);
      setText("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleItem = async (item) => {
    try {
      const updated = await updateWishlistItem(item._id, {
        completed: !item.completed,
      });
      setItems(items.map((i) => (i._id === updated._id ? updated : i)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteWishlistItem(id);
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="wishlist-page fade-in">
      <div className="page-heading welcome">
        <p className="small-title">little dreams ✦</p>
        <h2>wishlist</h2>
        <p className="date">things I want to make happen</p>
      </div>

      {error && <p className="form-error" style={{ color: "#d9534f" }}>{error}</p>}

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
            <option value="general">general things</option>
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
            general: "general things",
          };

          return (
            <div className="journal-card wishlist-card" key={categoryName}>
              <h3>{titles[categoryName]}</h3>

              {loading ? (
                <p style={{ padding: "10px" }}>Loading...</p>
              ) : categoryItems.length === 0 ? (
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
                      key={item._id}
                    >
                      <label className="task-checkbox-wrapper">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleItem(item)}
                        />
                        <span className="checkbox-custom" />
                      </label>

                      <span className="wishlist-text">{item.text}</span>

                      <button
                        className="delete-task remove-btn"
                        onClick={() => handleDeleteItem(item._id)}
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
