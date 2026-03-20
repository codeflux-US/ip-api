require("dotenv").config();
const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");

const app = express();

// Rate limit
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 10
}));

// Root route (important)
app.get("/", (req, res) => {
  res.send("API is running 🚀 Use /api/ip");
});

// API Key middleware
function checkApiKey(req, res, next) {
  if (!req.query.key || req.query.key !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API Key" });
  }
  next();
}

// Main API
app.get("/api/ip", checkApiKey, async (req, res) => {
  const ip = req.query.ip;

  if (!ip) {
    return res.status(400).json({ error: "IP is required" });
  }

  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const data = response.data;

    return res.json({
      ip: ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      latitude: data.latitude,
      longitude: data.longitude,
      isp: data.org
    });

  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
