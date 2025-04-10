// server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.get("/", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send("Missing 'url' query parameter.");
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117.0.0.0 Safari/537.36",
      },
    });

    const body = await response.text();

    res.set("Content-Type", "text/html");
    res.status(response.status).send(body);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).send("Proxy fetch failed.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Прокси-обёртка запущена на порту ${PORT}`);
});
