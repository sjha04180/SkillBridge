import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import DsaTracker from '@/models/DsaTracker';

// GET: Fetch tracker
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    await dbConnect();

    let tracker = await DsaTracker.findOne({ userId });
    if (!tracker) {
      tracker = new DsaTracker({
        userId,
        profile: {
          totalQuestions: 0,
          easyQuestions: 0,
          mediumQuestions: 0,
          hardQuestions: 0,
          currentStreak: 0,
          longestStreak: 0,
          targetCompanyTier: 'Tier 3',
          linkedinUrl: '',
        },
        platformLinks: {
          leetcode: '',
          codechef: '',
          codeforces: '',
          hackerrank: '',
          geeksforgeeks: '',
        },
        platformAchievements: {
          leetcode: { questionsSolved: 0, contestParticipated: 0, globalRanking: 0 },
          codechef: { rating: 0, starRating: '1★', contestParticipated: 0 },
          codeforces: { rating: 0, rank: 'Newbie', contestParticipated: 0 },
          hackerrank: { problemSolvingBadge: 0, javaBadge: 0, sqlBadge: 0, contestParticipated: 0 },
        },
      });
      await tracker.save();
    }

    return NextResponse.json(tracker);
  } catch (error) {
    console.error('Error fetching DSA tracker:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching your DSA progress' },
      { status: 500 }
    );
  }
}

// PUT: Update profile, links, achievements, and topics checklist
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    await dbConnect();

    const { profile, platformLinks, platformAchievements, topics } = body;

    const updatedData = {};
    if (profile) updatedData.profile = profile;
    if (platformLinks) updatedData.platformLinks = platformLinks;
    if (platformAchievements) updatedData.platformAchievements = platformAchievements;
    if (topics) updatedData.topics = topics;

    const tracker = await DsaTracker.findOneAndUpdate(
      { userId },
      { $set: updatedData },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: 'DSA Tracker updated successfully',
      tracker,
    });
  } catch (error) {
    console.error('Error updating DSA tracker:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating your DSA progress' },
      { status: 500 }
    );
  }
}

// POST: Add a new problem
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    await dbConnect();

    const { name, topic, difficulty, platform, url, solvedStatus, revisionNeeded, solvedAt } = body;

    if (!name || !topic || !difficulty || !platform) {
      return NextResponse.json(
        { error: 'Problem name, topic, difficulty, and platform are required' },
        { status: 400 }
      );
    }

    const tracker = await DsaTracker.findOne({ userId });
    if (!tracker) {
      return NextResponse.json({ error: 'DSA Tracker not found' }, { status: 404 });
    }

    const newProblem = {
      name,
      topic,
      difficulty,
      platform,
      url: url || '',
      solvedStatus: solvedStatus || 'Solved',
      revisionNeeded: !!revisionNeeded,
      solvedAt: solvedAt ? new Date(solvedAt) : new Date(),
    };

    tracker.problems.push(newProblem);
    await tracker.save();

    return NextResponse.json({
      message: 'Problem added successfully',
      problems: tracker.problems,
    });
  } catch (error) {
    console.error('Error adding problem to DSA tracker:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while adding the problem' },
      { status: 500 }
    );
  }
}
