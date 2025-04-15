import { v2 as cloudinary } from "cloudinary";
import dontenv from "dotenv";
dontenv.config();

cloudinary.config({
  cloud_name: process.env.C_CLOUD_NAME,
  api_key: process.env.C_API_KEY,
  api_secret: process.env.C_API_SECRET,
});

export default cloudinary;