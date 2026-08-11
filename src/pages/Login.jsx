import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ maxWidth: "400px", margin: "60px auto", padding: "0 20px" }}>
      <div className="page-header" style={{ marginBottom: "30px", textAlign: "center", alignItems: "center" }}>
        <h2>welcome back</h2>
        <p>open your journal.</p>
      </div>

      <div className="journal-card">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", fontSize: "14px" }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", fontSize: "14px" }}
          />

          {error && <p className="form-error" style={{ color: "#d9534f", margin: "5px 0 0", fontSize: "12px" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: "12px", background: "var(--ink)", color: "var(--paper)", border: "none", cursor: "pointer", marginTop: "10px" }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center", fontSize: "12px" }}>
          don't have an account? <Link to="/register" style={{ color: "var(--ink)", fontWeight: "bold" }}>register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
