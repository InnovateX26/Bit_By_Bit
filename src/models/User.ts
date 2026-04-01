import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  mobileNumber: string;
  password?: string;
  profile: {
    firstName?: string;
    lastName?: string;
    location?: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobileNumber: { type: String, default: '' },
    password: { type: String }, // Hashed password
    profile: {
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      location: { type: String, default: '' },
      avatar: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
