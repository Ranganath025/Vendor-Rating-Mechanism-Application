// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import VendorManagement from "./components/VendorManagement";
import VendorRating from "./components/VendorRating";
import Navbar from "./components/Navbar"; // NEW
import "./App.css";

const Dashboard = ({ isAuthenticated }) => {
  return (
    <div className="dashboard-container">
      {/* Hero/Feature Banner */}
      <div className="hero-banner">
        <h1>Vendor Rating System</h1>
        <p>Manage and Rate Your Vendors Seamlessly</p>
        {!isAuthenticated && (
          <div className="hero-cta">
            <Link to="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Cards Section */}
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
        {/* Top Navbar */}
        <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />

        {/* Main Content */}
        <Routes>
          <Route
            path="/"
            element={<Dashboard isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/signup"
            element={<Signup setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/vendors"
            element={
              isAuthenticated ? (
                <VendorManagement />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/ratings"
            element={
              isAuthenticated ? <VendorRating /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
