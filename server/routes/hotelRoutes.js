import express from "express";
import { requireAuth } from "@clerk/express";
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel, getHotel } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post("/", requireAuth(), protect, registerHotel);
hotelRouter.get("/", requireAuth(), protect, getHotel);

export default hotelRouter;
