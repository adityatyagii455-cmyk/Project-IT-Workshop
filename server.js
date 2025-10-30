import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Configure CORS to allow requests from your frontend
// Allow all origins during development, including file:// (Origin null)
app.use(cors({ origin: true, credentials: true, methods: ['GET','POST','DELETE','OPTIONS'] }));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect("mongodb://127.0.0.1:27017/nss_gallery", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const photoSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  imageUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});

const Photo = mongoose.model("Photo", photoSchema);

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\\s/g, "_")),
});
const upload = multer({ storage });

app.post("/api/upload", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const { title = "Untitled", description = "", category = "general" } = req.body;
    const photo = new Photo({
      title,
      description,
      category,
      imageUrl: `/uploads/${req.file.filename}`,
    });
    await photo.save();
    res.json({ success: true, photo });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

app.get("/api/photos", async (req, res) => {
  const photos = await Photo.find().sort({ uploadedAt: -1 });
  res.json(photos);
});

// AI chat endpoint (proxy to OpenAI). Requires OPENAI_API_KEY in environment
app.post("/api/ai-chat", async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "Server missing OPENAI_API_KEY" });
    }

    const { message = "", history = [] } = req.body || {};
    const siteSystemPrompt = `You are the helpful AI assistant for the NSS IIIT–Naya Raipur website.
Answer concisely and accurately about: slideshow uploads (category 'gallery'), header logo uploads (category 'logo'), photo gallery categories (education, health, environment, community), admin login/upload/delete flow, events/initiatives/about/contact sections.
If the user asks for steps, give short, numbered steps. If you don't know, say so.`;

    const messages = [
      { role: "system", content: siteSystemPrompt },
      ...history.slice(-6), // keep last few turns if provided
      { role: "user", content: String(message).slice(0, 2000) },
    ];

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.3,
        max_tokens: 400,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(500).json({ success: false, message: "OpenAI error", details: text });
    }
    const data = await resp.json();
    const answer = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.json({ success: true, answer });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ success: false, message: "AI chat failed" });
  }
});

// Delete photo by id (removes DB record and file)
app.delete("/api/photos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }
    const photo = await Photo.findById(id);
    if (!photo) return res.status(404).json({ success: false, message: "Not found" });
    // Remove file from disk
    if (photo.imageUrl) {
      const diskPath = path.join(__dirname, photo.imageUrl.replace(/^\//, ""));
      try {
        await fs.promises.unlink(diskPath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.warn("Could not remove file:", diskPath, err.message);
        }
      }
    }
    await Photo.deleteOne({ _id: photo._id });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));