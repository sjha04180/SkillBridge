import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    college: {
      type: String,
      required: [true, 'Please provide a college name'],
    },
    branch: {
      type: String,
      required: [true, 'Please provide a branch name'],
    },
    graduationYear: {
      type: Number,
      required: [true, 'Please provide a graduation year'],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
