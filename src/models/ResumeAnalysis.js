import mongoose, { Schema } from 'mongoose';

const ResumeAnalysisSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileData: {
      type: String, // Base64 representation of file
      required: true,
    },
    extractedText: {
      type: String,
      default: '',
    },
    parsedData: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      education: { type: [String], default: [] },
      skills: { type: [String], default: [] },
      projects: {
        type: [
          {
            title: { type: String, default: '' },
            description: { type: String, default: '' },
            technologies: { type: [String], default: [] },
            githubLink: { type: String, default: '' },
            liveLink: { type: String, default: '' },
          }
        ],
        default: [],
      },
      certifications: { type: [String], default: [] },
      experience: { type: [String], default: [] },
      achievements: { type: [String], default: [] },
    },
    readinessScore: {
      type: Number,
      default: 0,
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    missingSections: {
      type: [String],
      default: [],
    },
    targetRole: {
      type: String,
      default: '',
    },
    skillGap: {
      acquired: { type: [String], default: [] },
      missing: { type: [String], default: [] },
    },
    projectAnalysis: {
      strengthScore: { type: Number, default: 0 },
      suggestions: { type: [String], default: [] },
    },
    suggestions: {
      type: [
        {
          text: { type: String, required: true },
          priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
          category: { type: String, default: 'General' },
        }
      ],
      default: [],
    },
    placementInsights: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis =
  mongoose.models.ResumeAnalysis ||
  mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);

export default ResumeAnalysis;
