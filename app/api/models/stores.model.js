import mongoose from "mongoose";

const schema = new mongoose.Schema({
  shopUrl: { type: String, required: true },
  name: { type: String },
  APIKey:{ type: String, required: true },
  APIToken:{ type: String, required: true },
  APISecretKey:{ type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  createdAt: { type: Date },
  updatedAt: { type: Date },
},
  {
    collection: "store",
    timestamps: true,
  });

const Store = mongoose.model("Store", schema);
export default Store;
