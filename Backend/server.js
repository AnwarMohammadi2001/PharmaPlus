// server.js — Final Production Version
import "dotenv/config"; // ✅ Must be first
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { sequelize } from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Allowed origins (update this with your live site)
const allowedOrigins = [
  // "https://tet-soft.com", // your live frontend domain
  "http://localhost:3000", // local React dev
  "http://localhost:5173",
  // "https://backend.tet-soft.com",
];

// ✅ Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Access denied from ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle CORS errors
app.use((err, req, res, next) => {
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ✅ Serve static files (for uploads)
const uploadsDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsDir));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 TET Backend is running successfully...");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);

// ✅ Start Server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected via Sequelize!");
    await sequelize.sync({ alter: true });
    console.log("✅ Database tables synced successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
