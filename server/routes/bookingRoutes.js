import express from 'express';
import { requireAuth } from '@clerk/express';
import { protect } from '../middleware/authMiddleware.js';
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings, stripePayment } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', requireAuth(), protect, createBooking);
bookingRouter.get('/user', requireAuth(), protect, getUserBookings);
bookingRouter.get('/hotel', requireAuth(), protect, getHotelBookings);
bookingRouter.post('/stripe-payment', requireAuth(), protect, stripePayment);

export default bookingRouter;