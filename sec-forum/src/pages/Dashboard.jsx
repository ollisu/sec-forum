import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const conversationHeaders = [
  "What's on your mind today?",
  "How do you spend your weekends?",
  "Any interesting news you've come across?",
  "What's the latest update from the admin team?",
  "Any upcoming events we should know about?",
  "New features added to the forum!",
  "Tell us a bit about yourself!",
  "What brings you to this forum?",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleLogout, username } = useAuth();

  const onLogout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f4f4f9",
        padding: "60px 40px",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "40px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#333" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "30px" }}>
          Welcome to the forum, <strong>{username}</strong>!
        </p>
  
        <button
          onClick={onLogout}
          style={{
            backgroundColor: "#ff4b5c",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "12px 24px",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: "30px",
          }}
        >
          Logout
        </button>
  
        <ul style={{ listStyle: "none", padding: 0 }}>
          {conversationHeaders.map((topic, index) => (
            <li
              key={index}
              style={{
                padding: "15px 20px",
                borderBottom: "1px solid #eee",
                fontSize: "1rem",
                color: "#333",
                cursor: "pointer",
              }}
            >
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
};

export default Dashboard;