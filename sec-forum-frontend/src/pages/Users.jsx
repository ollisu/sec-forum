import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from '../api/axios';
import { useAuth } from "./AuthProvider";

const Users = () => {

    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();  
    console.log(user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("Fetching users...");
                const resp = await axios.get(`/users`)
                setUsers(resp.data)
                  
            } catch (err) {
                if(err.response) setError(err.response.data.message || "An error occurred while fetching the users");
                else setError("Network error or request failed");           
            } finally{
                setLoading(false);
            }
        }
      
              fetchUsers();
              
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
          <Link to="/dashboard">Back to Dashboard</Link>
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
          Admin Portal
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#444", marginBottom: "30px", fontFamily: "'Roboto', sans-serif", fontWeight: "500", }}>
          You are Logged in as, <strong>{user.username} (Role: {user.role})</strong>
        </p>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.id}
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
              {user.username} - {user.email} - {user.firstname} {user.lastname} - {user.type}
            </li>
          ))}
        </ul>
    
    <Link to="/dashboard">Back to Dashboard</Link>
    </div></div>)
}

export default Users;