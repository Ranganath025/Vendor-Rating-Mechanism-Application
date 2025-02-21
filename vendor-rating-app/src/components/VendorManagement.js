import React, { useEffect, useState, useCallback } from "react";
import axios from "../axios";
import "./VendorManagement.css";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    price: "",
    delivery: "",
    rejection: "",
  });
  const [editingVendor, setEditingVendor] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch vendors
  const fetchVendors = useCallback(async () => {
    try {
      const res = await axios.get("/api/vendors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(res.data);
    } catch (err) {
      console.error("❌ Error Fetching Vendors:", err.response?.data || err.message);
      alert("❌ Error fetching vendors. Please try again.");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchVendors();
    } else {
      alert("❌ You need to log in first.");
    }
  }, [fetchVendors, token]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.contact || !formData.email || !formData.address ||
        !formData.price || !formData.delivery || !formData.rejection) {
      alert("❌ Error: All fields are required.");
      return;
    }

    try {
      const vendorData = {
        name: formData.name,
        contact: formData.contact,
        email: formData.email,
        address: formData.address,
        price: Number(formData.price),
        delivery: Number(formData.delivery),
        rejection: Number(formData.rejection),
      };

      if (editingVendor) {
        await axios.put(`/api/vendors/rate/${editingVendor._id}`, vendorData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Vendor Rating Updated!");
      } else {
        await axios.post("/api/vendors", vendorData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Vendor Added Successfully!");
      }

      setFormData({
        name: "",
        contact: "",
        email: "",
        address: "",
        price: "",
        delivery: "",
        rejection: "",
      });

      setEditingVendor(null);
      fetchVendors();
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      alert(`❌ Error: ${err.response?.data?.message || "Something went wrong"}`);
    }
  };

  const onEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      contact: vendor.contact,
      email: vendor.email,
      address: vendor.address,
      price: vendor.rating?.price || "",
      delivery: vendor.rating?.delivery || "",
      rejection: vendor.rating?.rejection || "",
    });
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await axios.delete(`/api/vendors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("🗑️ Vendor Deleted Successfully!");
        fetchVendors();
      } catch (err) {
        console.error("❌ Error Deleting Vendor:", err.response?.data || err.message);
        alert("❌ Error deleting vendor. Please try again.");
      }
    }
  };

  const exportCSV = async () => {
    try {
      const response = await axios.get("/api/vendors/export/csv", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "vendors.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("❌ Error exporting CSV:", error);
    }
  };

  const exportPDF = async () => {
    try {
      const response = await axios.get("/api/vendors/export/pdf", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "vendors.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("❌ Error exporting PDF:", error);
    }
  };

  return (
    <div className="vendor-management-container">
      <h2>Vendor Management</h2>
      
      <form onSubmit={onSubmit} className="vendor-form">
        <input type="text" name="name" value={formData.name} onChange={onChange} required placeholder="Vendor Name" />
        <input type="text" name="contact" value={formData.contact} onChange={onChange} required placeholder="Contact" />
        <input type="email" name="email" value={formData.email} onChange={onChange} required placeholder="Email" />
        <input type="text" name="address" value={formData.address} onChange={onChange} required placeholder="Address" />

        <h3>Vendor Ratings</h3>
        <input type="number" name="price" value={formData.price} onChange={onChange} required placeholder="Best Price ($)" />
        <input type="number" name="delivery" value={formData.delivery} onChange={onChange} required placeholder="Timely Delivery (%)" />
        <input type="number" name="rejection" value={formData.rejection} onChange={onChange} required placeholder="Rejection Rate (%)" />

        <button type="submit">{editingVendor ? "Update Vendor" : "Add Vendor"}</button>
      </form>

      <div className="export-buttons">
        <button onClick={exportCSV}>📄 Export CSV</button>
        <button onClick={exportPDF}>📄 Export PDF</button>
      </div>

      <h3>Vendor List</h3>
      <div className="table-wrapper">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Address</th>
              <th>Price</th>
              <th>Delivery</th>
              <th>Rejection</th>
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
                <td>{vendor.rating?.price}</td>
                <td>{vendor.rating?.delivery}</td>
                <td>{vendor.rating?.rejection}</td>
                <td className="action-buttons">
                  <button className="edit-btn" onClick={() => onEdit(vendor)}>Edit</button>
                  <button className="delete-btn" onClick={() => onDelete(vendor._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorManagement;
