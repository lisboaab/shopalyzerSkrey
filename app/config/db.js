import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    if (!mongoose.connection.readyState) {
      mongoose
        .connect(process.env.uri)
        .then(() => console.log("✅ Connected to MongoDB!"))
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectDB;
