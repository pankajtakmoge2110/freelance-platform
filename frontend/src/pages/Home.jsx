import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get("/projects");
        setProjects(data.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find the Perfect Freelancer 🚀</h1>
        <p style={styles.heroSub}>Post your project and get bids from top freelancers instantly</p>
        <Link to="/register" style={styles.heroBtn}>Get Started Free</Link>
      </div>

      {/* Projects */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Open Projects</h2>
        {loading ? (
          <p style={styles.msg}>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p style={styles.msg}>No open projects yet. Be the first to post one!</p>
        ) : (
          <div style={styles.grid}>
            {projects.map((p) => (
              <div key={p._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.badge}>Open</span>
                  <span style={styles.budget}>₹{p.budget}</span>
                </div>
                <h3 style={styles.cardTitle}>{p.title}</h3>
                <p style={styles.cardDesc}>
                  {p.description.length > 100 ? p.description.slice(0, 100) + "..." : p.description}
                </p>
                <div style={styles.skills}>
                  {p.skillsRequired.slice(0, 3).map((s, i) => (
                    <span key={i} style={styles.skill}>{s}</span>
                  ))}
                </div>
                <div style={styles.cardBottom}>
                  <span style={styles.client}>👤 {p.client?.name}</span>
                  <Link to={`/projects/${p._id}`} style={styles.viewBtn}>View & Bid →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#0f0f1a", minHeight: "100vh" },
  hero: {
    textAlign: "center",
    padding: "80px 20px",
    background: "linear-gradient(135deg, #1a1a2e, #16213e)",
  },
  heroTitle: { color: "white", fontSize: "42px", marginBottom: "16px" },
  heroSub: { color: "#a0a0b0", fontSize: "18px", marginBottom: "30px" },
  heroBtn: {
    backgroundColor: "#e94560",
    color: "white",
    padding: "14px 32px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
  },
  section: { padding: "50px 40px" },
  sectionTitle: { color: "white", fontSize: "26px", marginBottom: "28px" },
  msg: { color: "#a0a0b0", fontSize: "16px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #2a2a4a",
    transition: "transform 0.2s",
  },
  cardTop: { display: "flex", justifyContent: "space-between", marginBottom: "12px" },
  badge: {
    backgroundColor: "#1b4332",
    color: "#40c87a",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },
  budget: { color: "#e94560", fontWeight: "bold", fontSize: "18px" },
  cardTitle: { color: "white", fontSize: "17px", marginBottom: "10px" },
  cardDesc: { color: "#a0a0b0", fontSize: "14px", marginBottom: "14px", lineHeight: "1.5" },
  skills: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" },
  skill: {
    backgroundColor: "#0f0f1a",
    color: "#a0a0b0",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    border: "1px solid #2a2a4a",
  },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  client: { color: "#a0a0b0", fontSize: "13px" },
  viewBtn: {
    color: "#e94560",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default Home;