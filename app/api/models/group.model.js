import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  status:{ type: String, required: true },
  icon:{ type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  metrics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Metric" }],
  createdAt: { type: Date },
  updatedAt: { type: Date },
},
  {
    collection: "group",
    timestamps: true,
  });

const Group = mongoose.model("Group", schema);
export default Group;
