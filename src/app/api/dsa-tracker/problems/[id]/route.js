import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import DsaTracker from '@/models/DsaTracker';

// PUT: Edit a problem
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: problemId } = await params;
    const userId = session.user.id;
    const body = await req.json();
    await dbConnect();

    const { name, topic, difficulty, platform, url, solvedStatus, revisionNeeded, solvedAt } = body;

    const tracker = await DsaTracker.findOne({ userId });
    if (!tracker) {
      return NextResponse.json({ error: 'DSA Tracker not found' }, { status: 404 });
    }

    // Find problem index in the array
    const problemIndex = tracker.problems.findIndex((p) => p._id.toString() === problemId);
    if (problemIndex === -1) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Update fields
    if (name) tracker.problems[problemIndex].name = name;
    if (topic) tracker.problems[problemIndex].topic = topic;
    if (difficulty) tracker.problems[problemIndex].difficulty = difficulty;
    if (platform) tracker.problems[problemIndex].platform = platform;
    if (url !== undefined) tracker.problems[problemIndex].url = url;
    if (solvedStatus) tracker.problems[problemIndex].solvedStatus = solvedStatus;
    if (revisionNeeded !== undefined) tracker.problems[problemIndex].revisionNeeded = revisionNeeded;
    if (solvedAt) tracker.problems[problemIndex].solvedAt = new Date(solvedAt);

    await tracker.save();

    return NextResponse.json({
      message: 'Problem updated successfully',
      problems: tracker.problems,
    });
  } catch (error) {
    console.error('Error updating problem in DSA tracker:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating the problem' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a problem
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: problemId } = await params;
    const userId = session.user.id;
    await dbConnect();

    const tracker = await DsaTracker.findOne({ userId });
    if (!tracker) {
      return NextResponse.json({ error: 'DSA Tracker not found' }, { status: 404 });
    }

    // Filter out the problem
    tracker.problems = tracker.problems.filter((p) => p._id.toString() !== problemId);
    await tracker.save();

    return NextResponse.json({
      message: 'Problem deleted successfully',
      problems: tracker.problems,
    });
  } catch (error) {
    console.error('Error deleting problem from DSA tracker:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting the problem' },
      { status: 500 }
    );
  }
}
