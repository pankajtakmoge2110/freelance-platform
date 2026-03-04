import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "client" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", form);
      login(data.user, data.token);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account 🚀</h2>
        <p style={styles.subtitle}>Join as a client or freelancer</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Pankaj Sharma"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>I am a...</label>
            <div style={styles.roleContainer}>
              <div
                onClick={() => setForm({ ...form, role: "client" })}
                style={{
                  ...styles.roleCard,
                  border: form.role === "client" ? "2px solid #e94560" : "2px solid #2a2a4a",
                }}
              >
                <span style={styles.roleIcon}>💼</span>
                <span style={styles.roleText}>Client</span>
                <span style={styles.roleDesc}>I want to hire</span>
              </div>
              <div
                onClick={() => setForm({ ...form, role: "freelancer" })}
                style={{
                  ...styles.roleCard,
                  border: form.role === "freelancer" ? "2px solid #e94560" : "2px solid #2a2a4a",
                }}
              >
                <span style={styles.roleIcon}>💻</span>
                <span style={styles.roleText}>Freelancer</span>
                <span style={styles.roleDesc}>I want to work</span>
              </div>
            </div>
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f0f1a",
  },
  card: {
    backgroundColor: "#1a1a2e",
    padding: "40px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  title: { color: "white", fontSize: "26px", marginBottom: "6px" },
  subtitle: { color: "#a0a0b0", marginBottom: "28px" },
  field: { marginBottom: "18px" },
  label: { display: "block", color: "#a0a0b0", marginBottom: "6px", fontSize: "14px" },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1px solid #2a2a4a",
    backgroundColor: "#0f0f1a",
    color: "white",
    fontSize: "15px",
    boxSizing: "border-box",
  },
  roleContainer: { display: "flex", gap: "12px" },
  roleCard: {
    flex: 1,
    padding: "16px",
    borderRadius: "8px",
    backgroundColor: "#0f0f1a",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  roleIcon: { fontSize: "24px" },
  roleText: { color: "white", fontWeight: "bold", fontSize: "15px" },
  roleDesc: { color: "#a0a0b0", fontSize: "12px" },
  btn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#e94560",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "8px",
  },
  footer: { color: "#a0a0b0", textAlign: "center", marginTop: "20px" },
  link: { color: "#e94560", textDecoration: "none" },
};

export default Register;