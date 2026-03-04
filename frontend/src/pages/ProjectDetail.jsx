import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidForm, setBidForm] = useState({ amount: "", deliveryDays: "", coverLetter: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await API.get(`/projects/${id}`);
        setProject(data.project);
        if (user?.role === "client" && data.project.client._id === user.id) {
          const bidsRes = await API.get(`/bids/${id}`);
          setBids(bidsRes.data.bids);
        }
      } catch (err) {
        toast.error("Project not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/bids/${id}`, {
        ...bidForm,
        amount: Number(bidForm.amount),
        deliveryDays: Number(bidForm.deliveryDays),
      });
      toast.success("Bid placed successfully!");
      setBidForm({ amount: "", deliveryDays: "", coverLetter: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place bid");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await API.put(`/bids/${bidId}/accept`);
      await API.post("/contracts", { projectId: id, bidId });
      toast.success("Bid accepted! Contract created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept bid");
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!project) return null;

  const isOwner = user?.id === project.client._id;

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        {/* Project Details */}
        <div style={styles.card}>
          <div style={styles.cardTop}>
            <span style={styles.badge}>{project.status}</span>
            <span style={styles.budget}>₹{project.budget}</span>
          </div>
          <h1 style={styles.title}>{project.title}</h1>
          <p style={styles.desc}>{project.description}</p>

          <div style={styles.meta}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>📅 Deadline</span>
              <span style={styles.metaValue}>
                {new Date(project.deadline).toLocaleDateString()}
              </span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>👤 Client</span>
              <span style={styles.metaValue}>{project.client?.name}</span>
            </div>
          </div>

          <div style={styles.skills}>
            {project.skillsRequired.map((s, i) => (
              <span key={i} style={styles.skill}>{s}</span>
            ))}
          </div>
        </div>

        {/* Bids List — visible to project owner */}
        {isOwner && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Bids Received ({bids.length})</h2>
            {bids.length === 0 ? (
              <p style={styles.msg}>No bids yet.</p>
            ) : (
              bids.map((bid) => (
                <div key={bid._id} style={styles.bidCard}>
                  <div style={styles.bidTop}>
                    <span style={styles.bidName}>{bid.freelancer?.name}</span>
                    <span style={styles.bidAmount}>₹{bid.amount}</span>
                  </div>
                  <p style={styles.bidMeta}>⏱ {bid.deliveryDays} days delivery</p>
                  <p style={styles.coverLetter}>{bid.coverLetter}</p>
                  {bid.status === "pending" && project.status === "open" && (
                    <button
                      onClick={() => handleAcceptBid(bid._id)}
                      style={styles.acceptBtn}
                    >
                      Accept Bid ✓
                    </button>
                  )}
                  {bid.status !== "pending" && (
                    <span style={{
                      color: bid.status === "accepted" ? "#40c87a" : "#e94560",
                      fontSize: "13px", fontWeight: "bold"
                    }}>
                      {bid.status.toUpperCase()}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bid Form — visible to freelancers */}
      {user && user.role === "freelancer" && project.status === "open" && (
        <div style={styles.right}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Place Your Bid 💼</h2>
            <form onSubmit={handleBidSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Your Bid Amount (₹)</label>
                <input
                  type="number"
                  value={bidForm.amount}
                  onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. 3000"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Delivery Days</label>
                <input
                  type="number"
                  value={bidForm.deliveryDays}
                  onChange={(e) => setBidForm({ ...bidForm, deliveryDays: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. 7"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Cover Letter</label>
                <textarea
                  value={bidForm.coverLetter}
                  onChange={(e) => setBidForm({ ...bidForm, coverLetter: e.target.value })}
                  style={styles.textarea}
                  placeholder="Why are you the best fit for this project?"
                  required
                  rows={5}
                />
              </div>
              <button type="submit" style={styles.btn} disabled={submitting}>
                {submitting ? "Placing bid..." : "Place Bid 🚀"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#0f0f1a", minHeight: "100vh", padding: "40px", display: "flex", gap: "30px", alignItems: "flex-start" },
  loading: { color: "white", textAlign: "center", padding: "100px", backgroundColor: "#0f0f1a", minHeight: "100vh" },
  left: { flex: 2, display: "flex", flexDirection: "column", gap: "24px" },
  right: { flex: 1 },
  card: { backgroundColor: "#1a1a2e", borderRadius: "12px", padding: "28px", border: "1px solid #2a2a4a" },
  cardTop: { display: "flex", justifyContent: "space-between", marginBottom: "16px" },
  badge: { backgroundColor: "#1b4332", color: "#40c87a", padding: "4px 12px", borderRadius: "20px", fontSize: "13px" },
  budget: { color: "#e94560", fontSize: "24px", fontWeight: "bold" },
  title: { color: "white", fontSize: "24px", marginBottom: "14px" },
  desc: { color: "#a0a0b0", lineHeight: "1.7", marginBottom: "20px" },
  meta: { display: "flex", gap: "30px", marginBottom: "20px" },
  metaItem: { display: "flex", flexDirection: "column", gap: "4px" },
  metaLabel: { color: "#a0a0b0", fontSize: "13px" },
  metaValue: { color: "white", fontSize: "15px" },
  skills: { display: "flex", gap: "8px", flexWrap: "wrap" },
  skill: { backgroundColor: "#0f0f1a", color: "#a0a0b0", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", border: "1px solid #2a2a4a" },
  sectionTitle: { color: "white", fontSize: "18px", marginBottom: "20px" },
  msg: { color: "#a0a0b0" },
  bidCard: { backgroundColor: "#0f0f1a", borderRadius: "8px", padding: "16px", marginBottom: "14px", border: "1px solid #2a2a4a" },
  bidTop: { display: "flex", justifyContent: "space-between", marginBottom: "6px" },
  bidName: { color: "white", fontWeight: "bold" },
  bidAmount: { color: "#e94560", fontWeight: "bold" },
  bidMeta: { color: "#a0a0b0", fontSize: "13px", marginBottom: "8px" },
  coverLetter: { color: "#a0a0b0", fontSize: "14px", lineHeight: "1.6", marginBottom: "12px" },
  acceptBtn: { padding: "8px 18px", backgroundColor: "#40c87a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  field: { marginBottom: "16px" },
  label: { display: "block", color: "#a0a0b0", marginBottom: "6px", fontSize: "14px" },
  input: { width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1px solid #2a2a4a", backgroundColor: "#0f0f1a", color: "white", fontSize: "15px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1px solid #2a2a4a", backgroundColor: "#0f0f1a", color: "white", fontSize: "15px", boxSizing: "border-box", resize: "vertical" },
  btn: { width: "100%", padding: "12px", backgroundColor: "#e94560", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
};

export default ProjectDetail;