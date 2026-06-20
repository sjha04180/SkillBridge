import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Profile from '@/models/Profile';

export async function GET(req: Request) {
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

    // Fetch or create profile
    let profileDoc = await Profile.findOne({ userId });
    if (!profileDoc) {
      profileDoc = new Profile({
        userId,
        cgpa: 0,
        skills: [],
        certifications: [],
        targetRole: '',
      });
      await profileDoc.save();
    }

    return NextResponse.json({
      name: userDoc.name,
      email: userDoc.email,
      college: userDoc.college,
      branch: userDoc.branch,
      graduationYear: userDoc.graduationYear,
      cgpa: profileDoc.cgpa,
      skills: profileDoc.skills,
      certifications: profileDoc.certifications,
      targetRole: profileDoc.targetRole,
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    const {
      name,
      college,
      branch,
      graduationYear,
      cgpa,
      skills,
      certifications,
      targetRole,
    } = body;

    // Validate inputs
    if (!name || !college || !branch || !graduationYear) {
      return NextResponse.json(
        { error: 'Name, college, branch, and graduation year are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Update User
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        college,
        branch,
        graduationYear: Number(graduationYear),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update or create Profile
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      {
        cgpa: cgpa ? Number(cgpa) : 0,
        skills: Array.isArray(skills) ? skills : [],
        certifications: Array.isArray(certifications) ? certifications : [],
        targetRole: targetRole || '',
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: {
        name: updatedUser.name,
        email: updatedUser.email,
        college: updatedUser.college,
        branch: updatedUser.branch,
        graduationYear: updatedUser.graduationYear,
        cgpa: updatedProfile.cgpa,
        skills: updatedProfile.skills,
        certifications: updatedProfile.certifications,
        targetRole: updatedProfile.targetRole,
      },
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating the profile' },
      { status: 500 }
    );
  }
}
