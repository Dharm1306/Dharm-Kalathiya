import express from "express";
import { requireAuth } from "@clerk/express";
import { protect } from "../middleware/authMiddleware.js";
import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings,
  stripePayment,
  getMyBookings,
  updateBooking,
  cancelBooking,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

// Availability check (public)
bookingRouter.post("/check-availability", checkAvailabilityAPI);

// Booking creation with error handling
bookingRouter.post("/book", requireAuth(), protect, createBooking);

// Get user's bookings
bookingRouter.get("/user", requireAuth(), protect, getUserBookings);

// Get my bookings (enhanced with filtering/sorting)
bookingRouter.get("/my-bookings", requireAuth(), protect, getMyBookings);

// Get hotel's bookings
bookingRouter.get("/hotel", requireAuth(), protect, getHotelBookings);

// Payment processing
bookingRouter.post("/stripe-payment", requireAuth(), protect, stripePayment);

// Update booking details
bookingRouter.put("/:bookingId", requireAuth(), protect, updateBooking);

// Cancel booking
bookingRouter.delete("/:bookingId", requireAuth(), protect, cancelBooking);

export default bookingRouter;