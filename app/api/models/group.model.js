import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  status:{ type: String, required: true },
  icon:{ type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
},
  {
    collection: "group",
    timestamps: true,
  });

const User = mongoose.model("Group", schema);
export default Group;
