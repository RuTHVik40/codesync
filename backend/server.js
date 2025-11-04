// server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken"; // <-- 1. IMPORT JWT

// --- Import your new routes ---
import authRoutes from "./routes/auth.js"; // <-- 2. IMPORT AUTH ROUTES

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // you can restrict this to your frontend URL later
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json()); // This is needed to parse req.body for your API

// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://arslaanrehaan_db_user:poSu8DgnoJ2wfEq1@cluster0.ka4khqa.mongodb.net/";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- API Routes ---
app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully!");
});

// --- Use Auth Routes ---
// All routes in auth.js will be prefixed with /api/auth
app.use("/api/auth", authRoutes); // <-- 3. USE THE ROUTES

// --- 4. ADD NEW SOCKET.IO AUTHENTICATION MIDDLEWARE ---
// This code runs BEFORE a client is allowed to connect
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user's ID to the socket object
    // 'decoded.userId' comes from the 'payload' we created in auth.js
    socket.userId = decoded.userId;
    next(); // All good, allow connection
  } catch (err) {
    console.log("Socket auth error:", err.message);
    return next(new Error('Authentication error: Invalid token'));
  }
});


// --- Socket.io Connection Logic ---
io.on("connection", (socket) => {
  // This code will NOW only run for authenticated users
  console.log(`🟢 New authenticated client connected: ${socket.id}`);
  console.log(`   User ID: ${socket.userId}`); // You can now access this!

  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id} (User: ${socket.userId})`);
  });
  
  // You can add your other socket event listeners here
  // e.g., socket.on('joinRoom', ...)
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

