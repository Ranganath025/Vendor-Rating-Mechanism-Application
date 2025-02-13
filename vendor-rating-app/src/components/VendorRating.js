import React, { useEffect, useState } from "react";
import axios from "../axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import "./VendorRating.css";

const VendorRating = () => {
  const [vendors, setVendors] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get("/api/vendors", { headers: { Authorization: `Bearer ${token}` } });
      setVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };

  return (
    <div className="vendor-container">
      <h2>Vendor Ratings</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={vendors} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#fff" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip contentStyle={{ background: "#333", border: "none", color: "#fff" }} />
          <Legend />
          <Bar dataKey="ratingScore" fill="#6a1b9a" name="Rating Score" />
        </BarChart>
      </ResponsiveContainer>
      <table className="vendor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Best Price ($)</th>
            <th>Timely Delivery (%)</th>
            <th>Rejection Rate (%)</th>
            <th>Rating Score</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor._id}>
              <td>{vendor.name}</td>
              <td>{vendor.bestPrice}</td>
              <td>{vendor.timelyDelivery}</td>
              <td>{vendor.rejectionRate}</td>
              <td>{vendor.ratingScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorRating;
