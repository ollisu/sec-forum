import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import axios from '../api/axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleLogout, user } = useAuth();
  const [formData, setFormData] =  useState("");
  const [topics, setTopics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const onLogout = () => {
    handleLogout();
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData(e.target.value);
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/topic`, { title: formData, userId: user.id });
      const savedTopic = response.data;
      console.log("Topic added:", savedTopic);
      topics.push(savedTopic)
    } catch (err) {
      setError("An error occurred while adding the topic.");
      console.error("Error adding topic:", err);
    } finally {
      setFormData("");
    }
  };

  const handleTopicClick = (topicId) => {
    navigate(`/topic/${topicId}`);
  }

  useEffect(() => {
        const fetchTopics = async () => {
            try {
                const resp = await axios.get(`/topic`)
                setTopics(resp.data)
              
            } catch (err) {
                if(err.response) setError(err.response.data.message || "An error occurred while fetching the topic");
                else setError("Network error or request failed");           
            } finally{
                setLoading(false);
            }
         }
  
          fetchTopics();
          
      },[])


  
  if (loading) 
    return (
      <div style={{ 
        width: "100vw", 
        minHeight: "100vh", 
        backgroundColor: "#f4f4f9", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        fontSize: "1.5rem", 
        fontFamily: "'Roboto', sans-serif", 
        color: "#444" 
          }}>
            Loading...
          </div>
        );

  if (error) {
      return (
        <div>
          <div style={{ color: 'white', fontWeight: 'bold' }}>
            Error: {error} {/* Render error message */}
          </div>
        </div>
       );
    }

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
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#444", fontFamily: "'Roboto', sans-serif", fontWeight: "500", }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#444", marginBottom: "30px", fontFamily: "'Roboto', sans-serif", fontWeight: "500", }}>
          Welcome to the forum, <strong>{user.username}</strong>!
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
          onMouseOver={(e) => e.target.style.backgroundColor = "#ff2a3b"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#ff4b5c"}
        >
          Logout
        </button>
  
        <ul style={{ listStyle: "none", padding: 0 }}>
          {topics.map((topic) => (
            <li
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              style={{
                padding: "15px 20px",
                borderBottom: "1px solid #eee",
                fontSize: "1rem",
                color: "#444",
                cursor: "pointer",
                fontFamily: "'Roboto', sans-serif", 
                fontWeight: "500", 
              }}
            >
              {topic.title}
            </li>
          ))}
        </ul>

        <h3
          style={{
            fontSize: "1.6rem",
            fontWeight: "500",
            color: "#444",
            marginBottom: "15px",
            textAlign: "left",
            fontFamily: "'Roboto', sans-serif",
            letterSpacing: "0.5px",
            paddingLeft: "10px",
            marginTop: "30px",
          }}
        >
          Create a new topic to share with the community
        </h3>
      
        <form style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", marginTop: "30px", }}>
          <input
            type="text"
            name="title"
            placeholder="New topic..."
            value={formData}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              fontSize: "1rem",
              border: "1px solid #ddd",
              borderRadius: "6px",
              backgroundColor: "#fff",
              color: "#333",
              outline: "none",
              width: "100%",
              maxWidth: "600px",
              transition: "border-color 0.3s ease",
            }}
          />
        </form>
        <button
          onClick={onSubmit}
          style={{
            backgroundColor: "#ff4b5c",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "12px 24px",
            fontSize: "1rem",
            cursor: "pointer",
            marginTop: "30px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#ff2a3b"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#ff4b5c"}
        >
          Add New Topic
        </button>
      </div>
      
    </div>
  );
  
};

export default Dashboard;