import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: _id, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userType,
  nnotifications:{ type: Boolean, required: true, unique: true },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
