import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  APIKey:{ type: String, required: true },
  APIToken:{ type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
},
  {
    collection: "store",
    timestamps: true,
  });

const User = mongoose.model("Store", schema);
export default Store;
