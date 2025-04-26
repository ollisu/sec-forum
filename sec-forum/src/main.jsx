import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./pages/AuthProvider";
import PrivateRoute from "./pages/PrivateRoute";
import TopicPage from "./pages/TopicPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/topic/:id" element={<TopicPage />} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  </React.StrictMode>
);