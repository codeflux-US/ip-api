require("dotenv").config();
const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10
});
app.use(limiter);

function checkApiKey(req, res, next) {
  if (req.query.key !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API Key" });
  }
  next();
}

app.get("/api/ip", checkApiKey, async (req, res) => {
  const ip = req.query.ip;

  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const data = response.data;

    res.json({
      ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      latitude: data.latitude,
      longitude: data.longitude,
      isp: data.org
    });

  } catch {
    res.json({ error: "Failed" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
