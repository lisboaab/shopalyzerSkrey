import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description:{ type: String, required: true },
  graphType:{ type: String, required: true },
  status:{ type: String, required: true },
},
  {
    collection: "metric",
    timestamps: true,
  });

const User = mongoose.model("Metric", schema);
export default Metric;
