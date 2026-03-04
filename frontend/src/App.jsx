import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages (we'll create these next)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PostProject from "./pages/PostProject";
import ProjectDetail from "./pages/ProjectDetail";
import MyBids from "./pages/MyBids";
import Messages from "./pages/Messages";
import Navbar from "./components/Navbar";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/post-project" element={<ProtectedRoute><PostProject /></ProtectedRoute>} />
        <Route path="/my-bids"      element={<ProtectedRoute><MyBids /></ProtectedRoute>} />
        <Route path="/messages"     element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;