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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
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
      console.log("📊 Updated Vendors Data:", res.data);
      setVendors(res.data);
    } catch (err) {
      console.error("❌ Error fetching vendors:", err);
    }
  };

  // Get top 3 vendors for Pie Chart
  const topVendors = [...vendors].sort((a, b) => b.rating.score - a.rating.score).slice(0, 3);
  const pieColors = ["#6a1b9a", "#ff7043", "#26a69a"];

  return (
    <div className="vendor-rating-container">
      <h2>Vendor Ratings</h2>

      {/* Grid Layout for Charts */}
      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-item">
          <h3>Vendor Rating Bar Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={vendors} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" stroke="#333" />
              <YAxis stroke="#333" />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #ddd" }} />
              <Legend />
              <Bar dataKey="rating.score" fill="#6a1b9a" name="Rating Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-item">
          <h3>Top 3 Vendors</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={topVendors} dataKey="rating.score" nameKey="name" outerRadius={120}>
                {topVendors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Restored Line Chart (Price vs. Delivery) */}
        <div className="chart-item">
          <h3>Price vs. Delivery Performance</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={vendors}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rating.price" stroke="#6a1b9a" name="Best Price ($)" />
              <Line type="monotone" dataKey="rating.delivery" stroke="#ff7043" name="Timely Delivery (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart for Rejection Rate */}
        <div className="chart-item">
          <h3>Rejection Rate Trend</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={vendors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="rating.rejection" stroke="#d32f2f" fill="#ef9a9a" name="Rejection Rate (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vendor Rating Table */}
      <div className="table-wrapper">
        <h3>Vendor Rating Table</h3>
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
                <td>{vendor.rating?.price || "N/A"}</td>
                <td>{vendor.rating?.delivery || "N/A"}</td>
                <td>{vendor.rating?.rejection !== undefined ? vendor.rating.rejection : "N/A"}</td>
                <td>{vendor.rating?.score || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorRating;
