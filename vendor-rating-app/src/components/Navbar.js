import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">VendorRating</Link>
      </div>
      <ul className="navbar-links">
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/vendors">Vendors</Link>
            </li>
            <li>
              <Link to="/ratings">Ratings</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
