import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "vendor" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sign up request
      await axios.post("/api/auth/signup", formData);
      alert("✅ Signup Successful! Please log in.");
      // Do NOT automatically set token or authenticate; redirect to login page instead.
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={onSubmit}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={onChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} required />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
