import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

function PostProject() {
  const [form, setForm] = useState({
    title: "", description: "", budget: "", deadline: "", skillsRequired: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/projects", {
        ...form,
        budget: Number(form.budget),
        skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()),
      });
      toast.success("Project posted successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Post a New Project 📋</h2>
        <p style={styles.sub}>Fill in the details to attract top freelancers</p>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Project Title", name: "title", type: "text", placeholder: "e.g. Build a React Website" },
            { label: "Budget (₹)", name: "budget", type: "number", placeholder: "e.g. 5000" },
            { label: "Deadline", name: "deadline", type: "date", placeholder: "" },
            { label: "Skills Required (comma separated)", name: "skillsRequired", type: "text", placeholder: "e.g. React, Node.js, MongoDB" },
          ].map((f) => (
            <div key={f.name} style={styles.field}>
              <label style={styles.label}>{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                style={styles.input}
                placeholder={f.placeholder}
                required
              />
            </div>
          ))}

          <div style={styles.field}>
            <label style={styles.label}>Project Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Describe your project in detail..."
              required
              rows={5}
            />
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Posting..." : "Post Project 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#0f0f1a", minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px" },
  card: { backgroundColor: "#1a1a2e", padding: "40px", borderRadius: "12px", width: "100%", maxWidth: "560px", height: "fit-content" },
  title: { color: "white", fontSize: "24px", marginBottom: "6px" },
  sub: { color: "#a0a0b0", marginBottom: "28px" },
  field: { marginBottom: "18px" },
  label: { display: "block", color: "#a0a0b0", marginBottom: "6px", fontSize: "14px" },
  input: { width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1px solid #2a2a4a", backgroundColor: "#0f0f1a", color: "white", fontSize: "15px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1px solid #2a2a4a", backgroundColor: "#0f0f1a", color: "white", fontSize: "15px", boxSizing: "border-box", resize: "vertical" },
  btn: { width: "100%", padding: "12px", backgroundColor: "#e94560", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", marginTop: "8px" },
};

export default PostProject;