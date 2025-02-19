const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Vendor = require("../models/Vendor");

// Helper Function: Calculate Vendor Rating
function calculateRating(price, delivery, rejection) {
  const priceWeight = 30;  // Lower price = higher score
  const deliveryWeight = 40; // Higher % = better
  const rejectionWeight = 30; // Lower % = better

  if (price <= 0) return 0; // Prevent division by zero

  return (
    (100 / price) * priceWeight + 
    delivery * deliveryWeight - 
    rejection * rejectionWeight
  ).toFixed(2);
}

// ✅ Get All Vendors with Ratings (Sorted by Score)
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("📥 Fetching Vendors...");
    const vendors = await Vendor.find().sort({ "rating.score": -1 }); // Sort vendors by rating score
    res.json(vendors);
  } catch (err) {
    console.error("❌ Error Fetching Vendors:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ✅ Add a New Vendor
router.post("/", authMiddleware, async (req, res) => {
  try {
    let { name, contact, email, address, price, delivery, rejection } = req.body;

    // Validate input fields
    if (!name || !contact || !email || !address || price === undefined || delivery === undefined || rejection === undefined) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Convert values to numbers
    price = Number(price);
    delivery = Number(delivery);
    rejection = Number(rejection);

    // Validate numerical values
    if (isNaN(price) || isNaN(delivery) || isNaN(rejection)) {
      return res.status(400).json({ message: "Price, delivery, and rejection must be numeric values." });
    }

    if (price <= 0 || delivery < 0 || delivery > 100 || rejection < 0 || rejection > 100) {
      return res.status(400).json({ message: "Invalid rating values. Ensure price > 0, 0 ≤ delivery ≤ 100, 0 ≤ rejection ≤ 100." });
    }

    // Calculate rating score
    const ratingScore = calculateRating(price, delivery, rejection);

    // Create new vendor
    const newVendor = new Vendor({
      name,
      contact,
      email,
      address,
      rating: { price, delivery, rejection, score: ratingScore },
    });

    await newVendor.save();
    res.status(201).json(newVendor);
  } catch (err) {
    console.error("❌ Error Adding Vendor:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ✅ Update Vendor Ratings
router.put("/rate/:id", authMiddleware, async (req, res) => {
  try {
    let { name, contact, email, address, price, delivery, rejection } = req.body;

    // Validate input fields
    if (!name || !contact || !email || !address || price === undefined || delivery === undefined || rejection === undefined) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Convert rating values to numbers
    price = Number(price);
    delivery = Number(delivery);
    rejection = Number(rejection);

    // Validate rating values
    if (isNaN(price) || isNaN(delivery) || isNaN(rejection)) {
      return res.status(400).json({ message: "Price, delivery, and rejection must be numeric values." });
    }

    if (price <= 0 || delivery < 0 || delivery > 100 || rejection < 0 || rejection > 100) {
      return res.status(400).json({ message: "Invalid rating values. Ensure price > 0, 0 ≤ delivery ≤ 100, 0 ≤ rejection ≤ 100." });
    }

    // Find vendor by ID
    let vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found." });

    // Update vendor details (name, contact, email, address) and ratings
    vendor.name = name;
    vendor.contact = contact;
    vendor.email = email;
    vendor.address = address;
    vendor.rating.price = price;
    vendor.rating.delivery = delivery;
    vendor.rating.rejection = rejection;
    vendor.rating.score = calculateRating(price, delivery, rejection);

    // Save updated vendor
    await vendor.save();
    res.json(vendor);
  } catch (err) {
    console.error("❌ Error Updating Vendor:", err.message);
    res.status(500).json({ message: "Error updating vendor", error: err.message });
  }
});

// ✅ Delete Vendor by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }
    res.status(200).json({ message: "Vendor Deleted Successfully!" });
  } catch (err) {
    console.error("❌ Error Deleting Vendor:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


module.exports = router;
