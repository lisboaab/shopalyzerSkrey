import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true },
  isSaved:{ type: Boolean, required: true },
},
  {
    collection: "search",
    timestamps: true,
  });

const User = mongoose.model("Search", schema);
export default Search;
