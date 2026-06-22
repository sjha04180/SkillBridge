import mongoose, { Schema } from 'mongoose';

const ResumeChecklistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    checkedItems: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ResumeChecklist =
  mongoose.models.ResumeChecklist ||
  mongoose.model('ResumeChecklist', ResumeChecklistSchema);

export default ResumeChecklist;
