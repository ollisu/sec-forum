import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleLogout = () => {
    setIsLoggedIn(false); 
    navigate("/");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Dashboard</h1>
      <p>Welcome to the forum! This is a placeholder page.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;