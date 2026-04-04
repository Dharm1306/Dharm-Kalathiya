import mongoose from "mongoose";

const connectDB = async () => {

    const envUri = process.env.MONGODB_URI?.trim();
    const isAtlasPlaceholder = !envUri || envUri.includes('<db_password>');

    if (isAtlasPlaceholder) {
        console.warn("WARNING: Invalid MONGODB_URI detected in .env. Falling back to local MongoDB (mongodb://127.0.0.1:27017/hotel-booking)");
    }

    const mongoUri = isAtlasPlaceholder
        ? "mongodb://127.0.0.1:27017/hotel-booking"
        : envUri.replace(/\/+$/, ""); // assume full Atlas URI in env

    // if a plain host string is provided (without DB name), attach it
    const finalMongoUri = !isAtlasPlaceholder && !/\/[^/]+$/.test(envUri)
        ? `${mongoUri}/hotel-booking`
        : mongoUri;

    try {
        mongoose.connection.on('connected', () => console.log("MongoDB connected"));
        mongoose.connection.on('error', (err) => console.error("MongoDB connection error:", err));
        mongoose.connection.on('disconnected', () => console.error("MongoDB disconnected"));

        await mongoose.connect(finalMongoUri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        console.log("MongoDB connection successful:", finalMongoUri);
    } catch (error) {
        console.error("MongoDB connect failed:", error.message);
        if (finalMongoUri !== envUri) {
            console.error("Tried fallback local MongoDB and failed. Please start MongoDB locally or set a valid MONGODB_URI in server/.env.");
        } else {
            console.error("Please check your Atlas credentials, network access, and MONGODB_URI value in server/.env.");
        }
        process.exit(1);
    }

};

export default connectDB;
// Note: Do not use the '@' symbol in your database user's password.