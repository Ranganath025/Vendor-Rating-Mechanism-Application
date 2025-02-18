const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Vendor = require("../models/Vendor");

// Helper Function: Calculate Vendor Rating
function calculateRating(bestPrice, timelyDelivery, rejectionRate) {
  const priceWeight = 30;  // Lower price = higher score
  const deliveryWeight = 40; // Higher % = better
  const rejectionWeight = 30; // Lower % = better

  return (
    (100 / bestPrice) * priceWeight +  // Normalize price to a score
    timelyDelivery * deliveryWeight -  // Higher percentage is better
    rejectionRate * rejectionWeight     // Lower percentage is better
  ).toFixed(2);
}

// Get All Vendors with Ratings (Sorted)
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("📥 Fetching Vendors...");
    const vendors = await Vendor.find().sort({ ratingScore: -1 });
    console.log("✅ Vendors Retrieved:", vendors.length);
    res.json(vendors);
  } catch (err) {
    console.error("❌ Error Fetching Vendors:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Add a New Vendor
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("📥 Incoming Vendor Data:", req.body);
    
    const { name, contact, email, address, bestPrice, timelyDelivery, rejectionRate } = req.body;

    // Validate Required Fields
    if (!name || !email || bestPrice === undefined || timelyDelivery === undefined || rejectionRate === undefined) {
      console.error("❌ Missing Required Fields:", req.body);
      return res.status(400).json({ message: "All fields are required!" });
    }

    const ratingScore = calculateRating(bestPrice, timelyDelivery, rejectionRate);

    const newVendor = new Vendor({
      name,
      contact,
      email,
      address,
      bestPrice,
      timelyDelivery,
      rejectionRate,
      ratingScore
    });

    await newVendor.save();
    console.log("✅ Vendor Saved Successfully:", newVendor);
    res.status(201).json(newVendor);
  } catch (err) {
    console.error("❌ Error Saving Vendor:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ✅ Corrected PUT Route: Update Vendor Ratings and Details
router.put("/rate/:id", authMiddleware, async (req, res) => {
  try {
    console.log(`📥 Updating Vendor ID: ${req.params.id}`);
    
    const { name, contact, email, address, bestPrice, timelyDelivery, rejectionRate } = req.body;
    
    let vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      console.error("❌ Vendor Not Found:", req.params.id);
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Validate Fields
    if (bestPrice === undefined || timelyDelivery === undefined || rejectionRate === undefined) {
      return res.status(400).json({ message: "All rating fields are required!" });
    }

    // Update Vendor Details
    vendor.name = name || vendor.name;
    vendor.contact = contact || vendor.contact;
    vendor.email = email || vendor.email;
    vendor.address = address || vendor.address;
    vendor.bestPrice = bestPrice;
    vendor.timelyDelivery = timelyDelivery;
    vendor.rejectionRate = rejectionRate;

    // Recalculate Rating Score
    vendor.ratingScore = calculateRating(bestPrice, timelyDelivery, rejectionRate);

    await vendor.save();
    console.log("✅ Vendor Rating & Details Updated:", vendor);
    res.json(vendor);
  } catch (err) {
    console.error("❌ Error Updating Vendor:", err.message);
    res.status(500).json({ message: "Error updating vendor", error: err.message });
  }
});

// Delete Vendor
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    console.log(`🗑️ Deleting Vendor ID: ${req.params.id}`);

    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      console.error("❌ Vendor Not Found:", req.params.id);
      return res.status(404).json({ message: "Vendor not found" });
    }

    console.log("✅ Vendor Deleted Successfully:", vendor);
    res.json({ message: "Vendor deleted successfully!" });
  } catch (err) {
    console.error("❌ Error Deleting Vendor:", err.message);
    res.status(500).json({ message: "Error deleting vendor", error: err.message });
  }
});

module.exports = router;
