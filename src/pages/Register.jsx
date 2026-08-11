import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
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
        <h2>create account</h2>
        <p>start your new journal.</p>
      </div>

      <div className="journal-card">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", fontSize: "14px" }}
          />

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
            minLength={6}
            required
            style={{ width: "100%", padding: "10px", fontSize: "14px" }}
          />

          {error && <p className="form-error" style={{ color: "#d9534f", margin: "5px 0 0", fontSize: "12px" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: "12px", background: "var(--ink)", color: "var(--paper)", border: "none", cursor: "pointer", marginTop: "10px" }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center", fontSize: "12px" }}>
          already have an account? <Link to="/login" style={{ color: "var(--ink)", fontWeight: "bold" }}>log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
