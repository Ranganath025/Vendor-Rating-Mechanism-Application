const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: String,
  email: { type: String, required: true },
  address: String,
  rating: {
    price: { type: Number, required: true },
    delivery: { type: Number, required: true },
    rejection: { type: Number, required: true },
    score: { type: Number, default: 0 },
  },
});

// Calculate rating before saving
VendorSchema.pre("save", function (next) {
  this.rating.score = calculateRating(
    this.rating.price,
    this.rating.delivery,
    this.rating.rejection
  );
  next();
});

function calculateRating(price, delivery, rejection) {
  return (100 / price) * 30 + delivery * 40 - rejection * 30;
}

module.exports = mongoose.model("Vendor", VendorSchema);
