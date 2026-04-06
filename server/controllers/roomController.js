import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ CREATE ROOM
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    const hotel = await Hotel.findOne({ owner: req.auth.userId });

    if (!hotel) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    // Upload images to cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    const images = await Promise.all(uploadImages);

    // ✅ FIX: Added isAvailable
    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
      isAvailable: true, // ⭐ IMPORTANT FIX
    });

    res.json({ success: true, message: "Room created successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ GET ALL ROOMS
export const getRooms = async (req, res) => {
  try {
    // ✅ FIX: removed filter (so old data also shows)
    const rooms = await Room.find()
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image",
        },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, rooms });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ GET SINGLE ROOM
export const getRoom = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.json({ success: false, message: "Invalid room ID format" });
    }

    const room = await Room.findById(id).populate({
      path: "hotel",
      populate: {
        path: "owner",
        select: "image name email",
      },
    });

    if (!room) {
      return res.json({ success: false, message: "Room not found in database" });
    }

    if (!room.hotel) {
      return res.json({ success: false, message: "Room hotel data is missing" });
    }

    res.json({ success: true, room });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ GET OWNER ROOMS
export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await Hotel.findOne({ owner: req.auth.userId });

    if (!hotelData) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    const rooms = await Room.find({ hotel: hotelData._id }).populate("hotel");

    res.json({ success: true, rooms });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ TOGGLE ROOM AVAILABILITY
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;

    const roomData = await Room.findById(roomId);

    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();

    res.json({ success: true, message: "Room availability updated" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};