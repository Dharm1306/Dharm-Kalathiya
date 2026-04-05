import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { seedSampleData } from "./configs/seed.js";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import connectCloudinary from "./configs/cloudinary.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

const app = express();

app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const RENDER_API_URL = process.env.RENDER_API_URL || "https://quickstay-api-fr34.onrender.com";
const allowedOrigins = [
  CLIENT_URL,
  RENDER_API_URL,
  "https://dharm-kalathiya.vercel.app",
  "https://dharm-kalathiya-git-main-dharm1306s-projects.vercel.app",
  "https://dharm-kalathiya-9k05vromu-dharm1306s-projects.vercel.app",
];

const ALLOWED_VERCEL_REGEX = /^https:\/\/([a-z0-9-]+\.)?vercel\.app$/i;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || ALLOWED_VERCEL_REGEX.test(origin)) {
      return callback(null, true);
    }
    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(new Error("CORS not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(clerkMiddleware());

app.post("/api/clerk", clerkWebhooks);
app.get("/", (req, res) => res.send("API is working"));

app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/booking", bookingRouter); // alias if frontend calls singular route

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  if (process.env.NODE_ENV !== "production") {
    await seedSampleData();
  }
  await connectCloudinary();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});