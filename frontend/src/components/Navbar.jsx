import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        🚀 FreelanceHub
      </Link>

      <div style={styles.links}>
        {!user ? (
          <>
            <Link to="/login"    style={styles.link}>Login</Link>
            <Link to="/register" style={styles.btn}>Sign Up</Link>
          </>
        ) : (
          <>
            <span style={styles.welcome}>Hi, {user.name} ({user.role})</span>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            {user.role === "client" && (
              <Link to="/post-project" style={styles.link}>Post Job</Link>
            )}
            {user.role === "freelancer" && (
              <Link to="/my-bids" style={styles.link}>My Bids</Link>
            )}
            <Link to="/messages" style={styles.link}>Messages</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    backgroundColor: "#1a1a2e",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  logo: {
    color: "#e94560",
    fontSize: "22px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "15px",
  },
  btn: {
    backgroundColor: "#e94560",
    color: "white",
    padding: "8px 18px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "15px",
  },
  welcome: {
    color: "#a0a0b0",
    fontSize: "14px",
  },
  logoutBtn: {
    backgroundColor: "transparent",
    border: "1px solid #e94560",
    color: "#e94560",
    padding: "7px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Navbar;