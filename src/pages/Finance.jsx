import { useState, useEffect } from "react";
import { getFinance, addFinance, deleteFinance } from "../services/api";
import "./Finance.css";

function Finance() {
  const currencyMap = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
  const currency = currencyMap[localStorage.getItem("bulletJournalCurrency")] || "₹";

  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFinance = async () => {
      try {
        setLoading(true);
        const data = await getFinance();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadFinance();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!description.trim() || !amount || Number(amount) <= 0) {
      setError("Please provide a valid description and amount.");
      return;
    }

    try {
      const newTransaction = await addFinance({
        description: description.trim(),
        amount: Number(amount),
        type,
        category,
        date: new Date().toISOString(),
      });

      setTransactions([newTransaction, ...transactions]);
      setDescription("");
      setAmount("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteFinance(id);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = income - expenses;

  return (
    <div className="finance-page fade-in">
      <div className="page-heading welcome">
        <p className="small-title">finance breakdown ✦</p>
        <h2>august finances</h2>
        <p className="date">keep track of where your money goes</p>
      </div>

      {error && <p className="form-error" style={{ color: "#d9534f" }}>{error}</p>}

      {/* SUMMARY */}
      <div className="finance-summary">
        <div className="journal-card finance-card">
          <p>income</p>
          <h3 className="income-total">{currency}{loading ? "-" : income.toLocaleString("en-IN")}</h3>
        </div>

        <div className="journal-card finance-card">
          <p>expenses</p>
          <h3 className="expense-total">{currency}{loading ? "-" : expenses.toLocaleString("en-IN")}</h3>
        </div>

        <div className="journal-card finance-card">
          <p>remaining</p>
          <h3 className={balance < 0 ? "negative balance-total" : "balance-total"}>
            {currency}{loading ? "-" : balance.toLocaleString("en-IN")}
          </h3>
        </div>
      </div>

      {/* ADD TRANSACTION */}
      <div className="journal-card finance-form-card">
        <h3>add transaction</h3>
        <form className="finance-form" onSubmit={handleAddTransaction}>
          <input
            className="finance-input"
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="finance-input"
            type="number"
            min="1"
            placeholder="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className="finance-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">expense</option>
            <option value="income">income</option>
          </select>

          <select
            className="finance-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="food">food</option>
            <option value="travel">travel</option>
            <option value="shopping">shopping</option>
            <option value="college">college</option>
            <option value="subscription">subscription</option>
            <option value="salary">salary</option>
            <option value="other">other</option>
          </select>

          <button className="add-task-button" type="submit">
            + add
          </button>
        </form>
      </div>

      {/* TRANSACTIONS */}
      <div className="journal-card transactions-card">
        <div className="transactions-header">
          <h3>transactions</h3>
          <span className="count-badge">{transactions.length} entries</span>
        </div>

        {loading ? (
          <p style={{ padding: "20px" }}>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <div className="empty-state">no transactions yet ✦</div>
        ) : (
          <div className="transaction-list">
            {transactions.map((transaction) => (
              <div className="transaction-item" key={transaction._id}>
                <div className="transaction-info">
                  <p>{transaction.description}</p>
                  <div className="transaction-meta">
                    <span className="category-badge">{transaction.category}</span>
                    <span className="category-badge">{transaction.type}</span>
                  </div>
                </div>

                <strong
                  className={
                    transaction.type === "income"
                      ? "income-text"
                      : "expense-text"
                  }
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {currency}{transaction.amount.toLocaleString("en-IN")}
                </strong>

                <button
                  className="delete-task remove-btn"
                  onClick={() => handleDeleteTransaction(transaction._id)}
                  title="Delete transaction"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Finance;
