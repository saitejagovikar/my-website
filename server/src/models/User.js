import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    cart: { type: [mongoose.Schema.Types.Mixed], default: [] },
    picture: { type: String }, // For Google OAuth profile picture
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);

