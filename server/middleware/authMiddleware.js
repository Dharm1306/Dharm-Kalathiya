import User from "../models/User.js";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  const { userId } = req.auth;
  if (!userId) {
    return res.json({ success: false, message: "not authenticated" });
  }

  let user = await User.findById(userId);
  if (!user) {
    user = await User.create({
      _id: userId,
      username: `user-${userId.slice(0, 6)}`,
      email: `no-reply+${userId}@quickstay.local`,
      image: 'https://ui-avatars.com/api/?name=Guest&background=FF6B35&color=fff',
      role: 'user',
      recentSearchedCities: [],
    });
  }

  req.user = user;
  next();
};