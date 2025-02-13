import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./VendorManagement.css";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    bestPrice: "",
    timelyDelivery: "",
    rejectionRate: "",
  });
  const [editingVendor, setEditingVendor] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get("/api/vendors", { headers: { Authorization: `Bearer ${token}` } });
      setVendors(res.data);
    } catch (err) {
      console.error("❌ Error Fetching Vendors:", err);
    }
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Sending Vendor Data:", formData);
    try {
      if (editingVendor) {
        await axios.put(`/api/vendors/${editingVendor._id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        alert("✅ Vendor Updated Successfully!");
      } else {
        await axios.post("/api/vendors", formData, { headers: { Authorization: `Bearer ${token}` } });
        alert("✅ Vendor Added Successfully!");
      }
      setFormData({
        name: "",
        contact: "",
        email: "",
        address: "",
        bestPrice: "",
        timelyDelivery: "",
        rejectionRate: "",
      });
      setEditingVendor(null);
      fetchVendors();
    } catch (err) {
      console.error("❌ Error Saving Vendor:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.message || "Server Error"}`);
    }
  };

  const onEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      contact: vendor.contact,
      email: vendor.email,
      address: vendor.address,
      bestPrice: vendor.bestPrice,
      timelyDelivery: vendor.timelyDelivery,
      rejectionRate: vendor.rejectionRate,
    });
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await axios.delete(`/api/vendors/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        alert("🗑️ Vendor Deleted Successfully!");
        fetchVendors();
      } catch (err) {
        console.error("❌ Error Deleting Vendor:", err);
      }
    }
  };

  return (
    <div className="vendor-container">
      <h2>Vendor Management</h2>
      <form onSubmit={onSubmit}>
        <input type="text" name="name" placeholder="Vendor Name" value={formData.name} onChange={onChange} required />
        <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={onChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={onChange} required />
        <input type="number" name="bestPrice" placeholder="Best Price ($)" value={formData.bestPrice} onChange={onChange} required />
        <input type="number" name="timelyDelivery" placeholder="Timely Delivery (%)" value={formData.timelyDelivery} onChange={onChange} required />
        <input type="number" name="rejectionRate" placeholder="Rejection Rate (%)" value={formData.rejectionRate} onChange={onChange} required />
        <button type="submit">{editingVendor ? "Update Vendor" : "Add Vendor"}</button>
      </form>
      <h3>Vendor List</h3>
      <table className="vendor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Address</th>
            <th>Best Price ($)</th>
            <th>Timely Delivery (%)</th>
            <th>Rejection Rate (%)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor._id}>
              <td>{vendor.name}</td>
              <td>{vendor.contact}</td>
              <td>{vendor.email}</td>
              <td>{vendor.address}</td>
              <td>{vendor.bestPrice}</td>
              <td>{vendor.timelyDelivery}</td>
              <td>{vendor.rejectionRate}</td>
              <td>
                <button onClick={() => onEdit(vendor)} className="edit-btn">Edit</button>
                <button onClick={() => onDelete(vendor._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorManagement;
