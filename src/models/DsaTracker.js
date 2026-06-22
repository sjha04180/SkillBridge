import mongoose, { Schema } from 'mongoose';

const DsaTrackerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    profile: {
      totalQuestions: { type: Number, default: 0 },
      easyQuestions: { type: Number, default: 0 },
      mediumQuestions: { type: Number, default: 0 },
      hardQuestions: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      targetCompanyTier: { 
        type: String, 
        enum: ['Tier 1', 'Tier 2', 'Tier 3'], 
        default: 'Tier 3' 
      },
      linkedinUrl: { type: String, default: '' },
    },
    platformLinks: {
      leetcode: { type: String, default: '' },
      codechef: { type: String, default: '' },
      codeforces: { type: String, default: '' },
      hackerrank: { type: String, default: '' },
      geeksforgeeks: { type: String, default: '' },
    },
    platformAchievements: {
      leetcode: {
        questionsSolved: { type: Number, default: 0 },
        contestParticipated: { type: Number, default: 0 },
        globalRanking: { type: Number, default: 0 },
      },
      codechef: {
        rating: { type: Number, default: 0 },
        starRating: { type: String, default: '1★' },
        contestParticipated: { type: Number, default: 0 },
      },
      codeforces: {
        rating: { type: Number, default: 0 },
        rank: { type: String, default: 'Newbie' },
        contestParticipated: { type: Number, default: 0 },
      },
      hackerrank: {
        problemSolvingBadge: { type: Number, default: 0 },
        javaBadge: { type: Number, default: 0 },
        sqlBadge: { type: Number, default: 0 },
        contestParticipated: { type: Number, default: 0 },
      },
    },
    topics: {
      type: [
        {
          name: { type: String, required: true },
          status: { 
            type: String, 
            enum: ['Not Started', 'In Progress', 'Completed'], 
            default: 'Not Started' 
          },
        }
      ],
      default: [
        { name: 'Arrays', status: 'Not Started' },
        { name: 'Strings', status: 'Not Started' },
        { name: 'Searching', status: 'Not Started' },
        { name: 'Sorting', status: 'Not Started' },
        { name: 'Recursion', status: 'Not Started' },
        { name: 'Backtracking', status: 'Not Started' },
        { name: 'Linked List', status: 'Not Started' },
        { name: 'Stack', status: 'Not Started' },
        { name: 'Queue', status: 'Not Started' },
        { name: 'Hashing', status: 'Not Started' },
        { name: 'Trees', status: 'Not Started' },
        { name: 'Binary Search Tree', status: 'Not Started' },
        { name: 'Heap', status: 'Not Started' },
        { name: 'Graphs', status: 'Not Started' },
        { name: 'Greedy', status: 'Not Started' },
        { name: 'Dynamic Programming', status: 'Not Started' },
        { name: 'Trie', status: 'Not Started' },
        { name: 'Segment Tree', status: 'Not Started' },
        { name: 'Bit Manipulation', status: 'Not Started' },
      ]
    },
    problems: {
      type: [
        {
          name: { type: String, required: true },
          topic: { type: String, required: true },
          difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
          platform: { type: String, required: true },
          url: { type: String, default: '' },
          solvedStatus: { type: String, enum: ['Solved', 'Attempted', 'Todo'], default: 'Solved' },
          revisionNeeded: { type: Boolean, default: false },
          solvedAt: { type: Date, default: Date.now }
        }
      ],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

const DsaTracker = mongoose.models.DsaTracker || mongoose.model('DsaTracker', DsaTrackerSchema);

export default DsaTracker;
