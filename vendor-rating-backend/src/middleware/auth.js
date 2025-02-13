const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("Authorization");
    console.log("🔑 Received Token:", token); // ✅ Debugging
  
    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }
  
    try {
      const tokenWithoutBearer = token.replace("Bearer ", "").trim();
      console.log("🔍 Token Without Bearer:", tokenWithoutBearer); // ✅ Debugging
  
      const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (err) {
      console.error("❌ JWT Verification Failed:", err.message);
      res.status(401).json({ message: "Invalid token" });
    }
  };
  