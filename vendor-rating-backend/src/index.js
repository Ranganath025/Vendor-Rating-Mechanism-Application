require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRouter = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');

const app = express();

// CORS Config
const corsOptions = {
  origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRouter);
console.log("✅ Auth Routes Loaded");
app.use('/api/vendors', vendorRoutes);
console.log("✅ Vendor Routes Loaded");

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


app.use("/api/vendors", vendorRoutes); // ✅ Add vendor routes
console.log("✅ Vendor Management Routes Loaded");
