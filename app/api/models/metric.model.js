import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description:{ type: String, required: true },
  graphType:{ type: String, required: true },
  status:{ type: String, required: true },
},
  {
    collection: "metric",
    timestamps: true,
  });

const Metric = mongoose.model("Metric", schema);
export default Metric;
