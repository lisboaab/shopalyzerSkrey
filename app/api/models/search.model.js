import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  name: { type: String, required: true },
  isSaved:{ type: Boolean, required: true },
  metrics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Metric" }],
  metricsGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  timePeriod: { type: String, required: true },
},
  {
    collection: "search",
    timestamps: true,
  });

const Search = mongoose.model("Search", schema);
export default Search;
