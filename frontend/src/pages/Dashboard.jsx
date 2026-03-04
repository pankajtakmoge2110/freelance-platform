import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

function Dashboard() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractRes, projectRes] = await Promise.all([
          API.get("/contracts"),
          user.role === "client" ? API.get("/projects/my") : null,
        ]);
        setContracts(contractRes.data.contracts);
        if (projectRes) setProjects(projectRes.data.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const statusColor = (s) => {
    if (s === "active") return "#40c87a";
    if (s === "completed") return "#a0a0b0";
    if (s === "cancelled") return "#e94560";
    return "#f0a500";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.sub}>Welcome back, {user.name}! 👋</p>
        </div>
        {user.role === "client" && (
          <Link to="/post-project" style={styles.btn}>+ Post New Project</Link>
        )}
        {user.role === "freelancer" && (
          <Link to="/" style={styles.btn}>Browse Projects</Link>
        )}
      </div>

      {loading ? (
        <p style={styles.msg}>Loading...</p>
      ) : (
        <>
          {/* Client Projects */}
          {user.role === "client" && projects.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>My Posted Projects</h2>
              <div style={styles.grid}>
                {projects.map((p) => (
                  <div key={p._id} style={styles.card}>
                    <div style={styles.cardTop}>
                      <h3 style={styles.cardTitle}>{p.title}</h3>
                      <span style={{ ...styles.badge, color: statusColor(p.status) }}>
                        {p.status}
                      </span>
                    </div>
                    <p style={styles.cardMeta}>Budget: ₹{p.budget}</p>
                    <Link to={`/projects/${p._id}`} style={styles.link}>View Bids →</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contracts */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>My Contracts</h2>
            {contracts.length === 0 ? (
              <p style={styles.msg}>No contracts yet.</p>
            ) : (
              <div style={styles.grid}>
                {contracts.map((c) => (
                  <div key={c._id} style={styles.card}>
                    <div style={styles.cardTop}>
                      <h3 style={styles.cardTitle}>{c.project?.title}</h3>
                      <span style={{ ...styles.badge, color: statusColor(c.status) }}>
                        {c.status}
                      </span>
                    </div>
                    <p style={styles.cardMeta}>Amount: ₹{c.amount}</p>
                    <p style={styles.cardMeta}>Delivery: {c.deliveryDays} days</p>
                    {user.role === "freelancer" && c.status === "active" && (
                      <button
                        onClick={async () => {
                          await API.put(`/contracts/${c._id}/complete`, {
                            completionNote: "Work done!",
                          });
                          window.location.reload();
                        }}
                        style={styles.completeBtn}
                      >
                        Mark as Complete ✓
                      </button>
                    )}
                    {user.role === "client" && c.status === "completed" && !c.approvedByClient && (
                      <button
                        onClick={async () => {
                          await API.put(`/contracts/${c._id}/approve`);
                          window.location.reload();
                        }}
                        style={styles.approveBtn}
                      >
                        Approve Completion ✓
                      </button>
                    )}
                    {c.approvedByClient && (
                      <p style={{ color: "#40c87a", fontSize: "13px" }}>✅ Approved</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#0f0f1a", minHeight: "100vh", padding: "40px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
  title: { color: "white", fontSize: "30px", marginBottom: "6px" },
  sub: { color: "#a0a0b0" },
  btn: {
    backgroundColor: "#e94560",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  section: { marginBottom: "40px" },
  sectionTitle: { color: "white", fontSize: "20px", marginBottom: "20px" },
  msg: { color: "#a0a0b0" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" },
  card: { backgroundColor: "#1a1a2e", borderRadius: "12px", padding: "20px", border: "1px solid #2a2a4a" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  cardTitle: { color: "white", fontSize: "16px" },
  badge: { fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" },
  cardMeta: { color: "#a0a0b0", fontSize: "13px", marginBottom: "6px" },
  link: { color: "#e94560", textDecoration: "none", fontSize: "14px" },
  completeBtn: {
    marginTop: "10px", padding: "8px 16px", backgroundColor: "#40c87a",
    color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px",
  },
  approveBtn: {
    marginTop: "10px", padding: "8px 16px", backgroundColor: "#e94560",
    color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px",
  },
};

export default Dashboard;