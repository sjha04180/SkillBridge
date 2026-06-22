import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Profile from '@/models/Profile';
import Goal from '@/models/Goal';
import ResumeChecklist from '@/models/ResumeChecklist';
import ResumeAnalysis from '@/models/ResumeAnalysis';

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { id: userIdToDelete } = await params;

    // Prevent admin from deleting themselves!
    if (userIdToDelete === session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You cannot delete your own administrative account' }, { status: 400 });
    }

    await dbConnect();

    // Check if user exists
    const user = await User.findById(userIdToDelete);
    if (!user) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    // WIPE DATABASE records linked to the user
    await User.findByIdAndDelete(userIdToDelete);
    await Profile.findOneAndDelete({ userId: userIdToDelete });
    await Goal.deleteMany({ userId: userIdToDelete });
    await ResumeChecklist.findOneAndDelete({ userId: userIdToDelete });
    await ResumeAnalysis.findOneAndDelete({ userId: userIdToDelete });

    return NextResponse.json({
      message: `User account ${user.name} and all associated profile profiles, goals, and checklists wiped successfully.`,
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting user account' },
      { status: 500 }
    );
  }
}
