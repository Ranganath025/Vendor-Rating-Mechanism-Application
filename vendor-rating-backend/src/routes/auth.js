const express = require('express');
const bcrypt = require('bcryptjs');  // Ensure bcryptjs is installed
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if necessary
const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    console.log("📥 Incoming signup request:", req.body);

    const { username, email, password, role = "user" } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Trim password before hashing
    const trimmedPassword = password.trim();

    // ✅ Hash password before saving (only ONCE)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

    console.log("🔑 Final Hashed Password Before Saving:", hashedPassword);

    user = new User({
      username,
      email,
      password: hashedPassword, // ✅ Save only the hashed password
      role,
    });

    await user.save();
    console.log("✅ Saved User Object:", user);

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        console.log("✅ JWT Token generated");
        res.json({ token });
      }
    );

  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});


//login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("📥 Incoming Login Request:", req.body);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User Not Found");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("✅ User Found:", user);

    // Trim entered password before comparing
    const trimmedPassword = password.trim();
    console.log("🔑 Entered Password (Trimmed):", trimmedPassword);
    console.log("🗄️ Stored Hashed Password:", user.password);

    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    console.log("🔍 Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        console.log("✅ JWT Token generated:", token);
        res.json({ token });
      }
    );

  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});


module.exports = router;

