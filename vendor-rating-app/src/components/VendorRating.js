// src/components/VendorRating.js
import React, { useEffect, useState } from "react";
import axios from "../axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import "./VendorRating.css";

const VendorRating = () => {
  const [vendors, setVendors] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get("/api/vendors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };

  return (
    <div className="vendor-rating-container">
      <h2>Vendor Ratings</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={vendors}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" stroke="#333" />
            <YAxis stroke="#333" />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #ddd" }}
              labelStyle={{ color: "#333" }}
            />
            <Legend />
            <Bar dataKey="ratingScore" fill="#6a1b9a" name="Rating Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="table-wrapper">
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
    </div>
  );
};

export default VendorRating;
