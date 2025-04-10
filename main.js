import express from "express";
import cors from "cors";
import { request } from "undici";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.get("/", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send("Missing 'url' query parameter.");
  }

  try {
    const { statusCode, headers, body } = await request(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117.0.0.0 Safari/537.36",
      },
    });

    res.set("Content-Type", headers["content-type"] || "text/html");
    res.status(statusCode);
    body.pipe(res);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).send("Proxy fetch failed.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Прокси-обёртка запущена на порту ${PORT}`);
});
