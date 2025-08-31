// src/models/User.ts
import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  image: { type: String }, // <-- ADD THIS LINE
  emailVerified: { type: Date },
});

const User = models.User || model('User', UserSchema);
export default User;