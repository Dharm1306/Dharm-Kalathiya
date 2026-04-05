import express from "express";
// ...existing imports...
import bookingRouter from "./routes/bookingRoutes.js";
// ...existing imports...

const app = express();

app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
// ...existing CORS setup...

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(clerkMiddleware());

app.post("/api/clerk", clerkWebhooks);
app.get("/", (req, res) => res.send("API is working"));

app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/booking", bookingRouter); // alias if frontend uses singular route

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
});