import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

// URL of the ML service.
const ML_URL = process.env.ML_URL || "http://localhost:8000/generate_projects";

app.post("/fromML", async (req, res) => {
  try {
    //"fetch(..." sends a POST to whatever ML_URL points at.
    //Sends the exact same JSON the frontend sent you (req.body), serialized with JSON.stringify.
    const mlRes = await fetch(ML_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body || {})
    });
    //Tries to parse ML’s response as JSON.
    //If parsing fails (e.g., ML returned HTML or empty body), it falls back to {} instead of crashing.
    const data = await mlRes.json().catch(() => ({}));
    res.json(data); // send exactly what ML sent
  } 
    //If anything throws (network timeout, ML down, etc.),this code logs the error to the server console and returns a HTTP 500 with a small JSON error so the frontend knows it failed.  
    catch (err) {
    console.error("ML fetch failed:", err.message);
    res.status(500).json({ error: "Failed to fetch from ML", detail: err.message });
  }
});

app.listen(8080, () => console.log("API running on :8080"));
