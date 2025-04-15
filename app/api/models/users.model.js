import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userType: { type: String, required: true },
  password: { type: String, required: true },
  notifications:{ type: Boolean, required: true },
  profilePicture: { type: String, required: false },
  token: { type: String, required: false },
  cloudinaryID: { type: String, required: false },
  createdAt: { type: Date },
  updatedAt: { type: Date },
},
  {
    collection: "user",
    timestamps: true,
  });

const User = mongoose.model("User", schema);
export default User;
