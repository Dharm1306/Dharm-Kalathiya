import Booking from "../models/bookingModel.js";

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.auth.userId })
      .populate({
        path: "room",
        populate: { path: "hotel" },
      });

    return res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};