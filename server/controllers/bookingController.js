import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

const getRequestUser = (req) => {
  if (req.user && req.user._id) return req.user;
  if (req.auth?.userId) return { _id: req.auth.userId, email: req.auth?.email, username: req.auth?.username };
  return null;
};

const checkAvailability = async ({ room, checkInDate, checkOutDate }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    return bookings.length === 0;
  } catch (error) {
    console.error("Availability check failed:", error);
    return false;
  }
};

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    if (!room || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: "room, checkInDate and checkOutDate are required" });
    }
    const available = await checkAvailability({ room, checkInDate, checkOutDate });
    return res.json({ success: true, available });
  } catch (error) {
    console.error("checkAvailabilityAPI failed:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to check availability" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const userInfo = getRequestUser(req);

    if (!userInfo?._id) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (!room || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: "Room, check-in date and check-out date are required" });
    }

    const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
    if (!isAvailable) {
      return res.status(409).json({ success: false, message: "Room is not available for the selected dates" });
    }

    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    if (!roomData.hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found for this room" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));
    const totalPrice = roomData.pricePerNight * nights;

    const booking = await Booking.create({
      user: userInfo._id,
      room,
      hotel: roomData.hotel._id,
      guests: Number(guests) || 1,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate({ path: "room", populate: { path: "hotel" } })
      .populate("hotel");

    return res.json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Booking creation failed:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create booking" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userInfo = getRequestUser(req);
    if (!userInfo?._id) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const bookings = await Booking.find({ user: userInfo._id })
      .populate({ path: "room", populate: { path: "hotel" } })
      .populate("hotel")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.error("Fetch user bookings failed:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch bookings" });
  }
};