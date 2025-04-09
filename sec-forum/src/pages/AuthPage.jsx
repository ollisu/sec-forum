import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLogin) {
      // Check if user exists in local storage
      const user = users.find(
        (u) => u.username === formData.username && u.password === formData.password
      );
      if (user) {
        console.log("Login successful");
        navigate("/dashboard");
      } else {
        console.log("Invalid credentials");
      }
    } else {
      // Sign up logic - write to local storage
      if (users.some((u) => u.username === formData.username)) {
        console.log("Username already exists");
      } else {
        users.push(formData);
        localStorage.setItem("users", JSON.stringify(users));
        console.log("User registered successfully");
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>Welcome to the Forum</h1>
      <p>A place to discuss and share ideas.</p>
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;