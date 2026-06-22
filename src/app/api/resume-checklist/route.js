import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Profile from '@/models/Profile';
import ResumeChecklist from '@/models/ResumeChecklist';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    await dbConnect();

    // Fetch user details
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch profile details
    const profileDoc = await Profile.findOne({ userId });
    const profile = profileDoc || {
      skills: [],
      projects: [],
      certifications: [],
      targetRole: '',
      cgpa: 0,
    };

    // Fetch resume checklist state
    let checklistDoc = await ResumeChecklist.findOne({ userId });
    if (!checklistDoc) {
      checklistDoc = new ResumeChecklist({ userId, checkedItems: [] });
      await checklistDoc.save();
    }

    return NextResponse.json({
      name: userDoc.name,
      email: userDoc.email,
      college: userDoc.college,
      branch: userDoc.branch,
      graduationYear: userDoc.graduationYear,
      cgpa: profile.cgpa,
      skills: profile.skills || [],
      projects: profile.projects || [],
      certifications: profile.certifications || [],
      targetRole: profile.targetRole || '',
      checkedItems: checklistDoc.checkedItems || [],
    });
  } catch (error) {
    console.error('Error fetching resume checklist:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching resume checklist data' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { checkedItems } = body;

    if (!Array.isArray(checkedItems)) {
      return NextResponse.json({ error: 'checkedItems must be an array' }, { status: 400 });
    }

    await dbConnect();

    const updatedChecklist = await ResumeChecklist.findOneAndUpdate(
      { userId },
      { checkedItems },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: 'Resume checklist updated successfully',
      checkedItems: updatedChecklist.checkedItems,
    });
  } catch (error) {
    console.error('Error updating resume checklist:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating resume checklist data' },
      { status: 500 }
    );
  }
}
