import mongoose, { Schema } from 'mongoose';

const TeammatePostSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: String,
      default: '',
      trim: true,
    },
    branch: {
      type: String,
      default: '',
      trim: true,
    },
    hackathon: {
      type: String,
      required: [true, 'Please specify the hackathon name'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a recruitment message'],
      trim: true,
    },
    needs: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const TeammatePost = mongoose.models.TeammatePost || mongoose.model('TeammatePost', TeammatePostSchema);

export default TeammatePost;
