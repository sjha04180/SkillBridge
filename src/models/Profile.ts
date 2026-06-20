import mongoose, { Schema } from 'mongoose';

const ProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    cgpa: {
      type: Number,
      default: 0.0,
    },
    skills: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    targetRole: {
      type: String,
      enum: [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'Software Engineer',
        'Data Analyst',
        '',
      ],
      default: '',
    },
    projects: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, default: '' },
          technologies: { type: [String], default: [] },
        },
      ],
      default: [],
    },
    dsaProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

export default Profile;
