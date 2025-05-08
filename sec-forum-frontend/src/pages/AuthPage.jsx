import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import "../styles/AuthPage.css";
import axios from '../api/axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", firstname: "", lastname: "" });
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      axios.post('/auth/login', {
        username: formData.username,
        password: formData.password,
      }).then(function (response) {
        handleLogin(response.data.accessToken);
        navigate('/dashboard')
      })
      .catch(function (err) {
        console.log(err);
      });

    } else {
      // Sign up logic - write to MONGODB
      axios.post('/auth/signup', {
        username: formData.username,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,

      })
      .then(function (response) {
        setIsLogin(true);
      })
      .catch(function (err) {
        console.log(err);
      });

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
          {!isLogin && (
            <>
              <input
               type="text"
               name="firstname"
               placeholder="First name"
               value={formData.firstname}
               onChange={handleChange}
               required
              />
              <input
               type="text"
               name="lastname"
               placeholder="Last name"
               value={formData.lastname}
               onChange={handleChange}
               required
              />
              <input
               type="email"
               name="email"
               placeholder="Email"
               value={formData.email}
               onChange={handleChange}
               required
              />
          </>)}
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