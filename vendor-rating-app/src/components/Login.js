import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import "./Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      alert("✅ Successfully Logged In!");
      navigate("/vendors");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
