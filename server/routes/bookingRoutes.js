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

// ✅ 1. Availability check (PUBLIC)
bookingRouter.post("/check-availability", checkAvailabilityAPI);

// ✅ 2. Create booking
bookingRouter.post("/book", requireAuth(), protect, createBooking);

// ✅ 3. Get user bookings (IMPORTANT FIX)
// 🔴 OLD: /user
// ✅ NEW: /user-bookings  (match frontend)
bookingRouter.get("/user-bookings", requireAuth(), protect, getUserBookings);

// ✅ 4. My bookings page (keep this)
bookingRouter.get("/my-bookings", requireAuth(), protect, getMyBookings);

// ✅ 5. Hotel bookings
bookingRouter.get("/hotel", requireAuth(), protect, getHotelBookings);

// ✅ 6. Payment
bookingRouter.post("/stripe-payment", requireAuth(), protect, stripePayment);

// ✅ 7. Update booking
bookingRouter.put("/:bookingId", requireAuth(), protect, updateBooking);

// ✅ 8. Cancel booking
bookingRouter.delete("/:bookingId", requireAuth(), protect, cancelBooking);

export default bookingRouter;