import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const { data } = await API.get("/bids/my");
        setBids(data.bids);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  const statusColor = (s) => {
    if (s === "accepted") return "#40c87a";
    if (s === "rejected") return "#e94560";
    return "#f0a500";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Bids 💼</h1>
      <p style={styles.sub}>Track all your submitted bids here</p>

      {loading ? (
        <p style={styles.msg}>Loading...</p>
      ) : bids.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.msg}>You haven't placed any bids yet.</p>
          <Link to="/" style={styles.btn}>Browse Projects →</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {bids.map((bid) => (
            <div key={bid._id} style={styles.card}>
              <div style={styles.cardTop}>
                <h3 style={styles.cardTitle}>{bid.project?.title}</h3>
                <span style={{ ...styles.badge, color: statusColor(bid.status) }}>
                  {bid.status}
                </span>
              </div>
              <div style={styles.row}>
                <span style={styles.meta}>💰 Your Bid: ₹{bid.amount}</span>
                <span style={styles.meta}>⏱ {bid.deliveryDays} days</span>
              </div>
              <p style={styles.cover}>
                {bid.coverLetter.length > 120
                  ? bid.coverLetter.slice(0, 120) + "..."
                  : bid.coverLetter}
              </p>
              <div style={styles.cardBottom}>
                <span style={styles.meta}>
                  Project Budget: ₹{bid.project?.budget}
                </span>
                <Link to={`/projects/${bid.project?._id}`} style={styles.link}>
                  View Project →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#0f0f1a", minHeight: "100vh", padding: "40px" },
  title: { color: "white", fontSize: "28px", marginBottom: "8px" },
  sub: { color: "#a0a0b0", marginBottom: "32px" },
  msg: { color: "#a0a0b0" },
  empty: { textAlign: "center", paddingTop: "60px" },
  btn: { display: "inline-block", marginTop: "16px", backgroundColor: "#e94560", color: "white", padding: "12px 24px", borderRadius: "8px", textDecoration: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" },
  card: { backgroundColor: "#1a1a2e", borderRadius: "12px", padding: "24px", border: "1px solid #2a2a4a" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" },
  cardTitle: { color: "white", fontSize: "16px", flex: 1, marginRight: "10px" },
  badge: { fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", whiteSpace: "nowrap" },
  row: { display: "flex", gap: "20px", marginBottom: "12px" },
  meta: { color: "#a0a0b0", fontSize: "13px" },
  cover: { color: "#a0a0b0", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #2a2a4a", paddingTop: "14px" },
  link: { color: "#e94560", textDecoration: "none", fontSize: "14px" },
};

export default MyBids;