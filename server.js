import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Config
dotenv.config();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App init
const app = express();

// Middleware (API routes before static so POST /api/contact is not handled by static)
app.use(cors());
app.use(express.json());
// MongoDB Atlas Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

// API routes (must be before express.static to avoid 405 on POST)
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({
      success: false,
      error: "Server error. Please try again.",
    });
  }
});

// Get all messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Resume routes
app.get("/resume", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "resume.pdf"));
});

app.get("/download-resume", (req, res) => {
  res.download(
    path.join(__dirname, "public", "resume.pdf"),
    "Mourya_N_Resume.pdf"
  );
});

// Static files (after API routes so POST /api/* is not handled by static)
app.use(express.static("public"));

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});