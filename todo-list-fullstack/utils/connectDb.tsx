import mongoose from "mongoose";


async function connectDataBase() {

    try {
        // if (mongoose.connections[0].readyState) return;
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("✅ Connected to MongoDB")

    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }


}

export default connectDataBase;
