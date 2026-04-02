import express from "express";
import { requireAuth } from "@clerk/express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", requireAuth(), protect, getUserData);
userRouter.post("/store-recent-search", requireAuth(), protect, storeRecentSearchedCities);

export default userRouter;
