import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import VendorManagement from "./components/VendorManagement";
import VendorRating from "./components/VendorRating";
import "./App.css";

const Dashboard = ({ isAuthenticated, handleLogout }) => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Vendor Rating System</h1>
      <p className="dashboard-subtitle">Manage and Rate Vendors</p>
      <div className="card-container">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="card">
              <h3>Login</h3>
              <p>Access your account</p>
            </Link>
            <Link to="/signup" className="card">
              <h3>Signup</h3>
              <p>Create a new account</p>
            </Link>
          </>
        ) : (
          <>
            <Link to="/vendors" className="card">
              <h3>Manage Vendors</h3>
              <p>View & edit vendor details</p>
            </Link>
            <Link to="/ratings" className="card">
              <h3>View Ratings</h3>
              <p>See vendor performance</p>
            </Link>
            <button onClick={handleLogout} className="card logout-card">
              <h3>Logout</h3>
              <p>Exit your account</p>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Dashboard isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <Routes>
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/vendors" element={isAuthenticated ? <VendorManagement /> : <Navigate to="/login" />} />
          <Route path="/ratings" element={isAuthenticated ? <VendorRating /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
