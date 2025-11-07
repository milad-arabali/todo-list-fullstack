import mongoose from "mongoose";

async function connectDataBase() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error("MONGODB_URI environment variable is not set");
    }

    try {
        if (mongoose.connections[0].readyState) return;
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
}

export default connectDataBase;
