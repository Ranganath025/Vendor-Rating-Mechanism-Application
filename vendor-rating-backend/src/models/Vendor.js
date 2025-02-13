const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: String,
  email: { type: String, required: true },
  address: String,
  bestPrice: { type: Number, required: true }, // Lower price is better
  timelyDelivery: { type: Number, required: true }, // % of on-time deliveries
  rejectionRate: { type: Number, required: true }, // Lower is better
  ratingScore: { type: Number, default: 0 }, // Final computed rating
});

// Calculate rating before saving
VendorSchema.pre("save", function (next) {
  const { bestPrice, timelyDelivery, rejectionRate } = this;
  this.ratingScore = calculateRating(bestPrice, timelyDelivery, rejectionRate);
  next();
});

// Rating Calculation Function
function calculateRating(bestPrice, timelyDelivery, rejectionRate) {
  const priceWeight = 30;  // Lower price = higher score
  const deliveryWeight = 40; // Higher % = better
  const rejectionWeight = 30; // Lower % = better

  return (
    (100 / bestPrice) * priceWeight +
    timelyDelivery * deliveryWeight -
    rejectionRate * rejectionWeight
  ).toFixed(2);
}

module.exports = mongoose.model("Vendor", VendorSchema);
