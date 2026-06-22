import mongoose, { Schema } from 'mongoose';

const ResourceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a resource title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a resource description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a resource category'],
      enum: [
        'DSA',
        'Aptitude',
        'DBMS',
        'Operating Systems',
        'Computer Networks',
        'OOP',
        'Web Development',
        'Interview Preparation',
      ],
    },
    resourceType: {
      type: String,
      required: [true, 'Please select a resource type'],
      enum: ['PDF', 'Video', 'Website', 'Notes'],
    },
    resourceLink: {
      type: String,
      required: [true, 'Please provide a resource link'],
      trim: true,
    },
    difficultyLevel: {
      type: String,
      required: [true, 'Please select a difficulty level'],
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);

export default Resource;
