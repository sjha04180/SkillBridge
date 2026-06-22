import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import TeammatePost from '@/models/TeammatePost';
import User from '@/models/User';

const SEED_POSTS = [
  {
    name: 'Sachin Jha',
    college: 'TCET Mumbai',
    branch: 'Computer Engineering',
    hackathon: 'Smart India Hackathon (SIH) 2026',
    message: 'Looking for a Python/Deep Learning developer to work on a Ministry of Agriculture AI problem statement. We have already designed the frontend schema!',
    needs: ['Python', 'Machine Learning', 'TensorFlow'],
    userId: '6a383d026b15e69a86f17854', // seeded admin user id
  },
  {
    name: 'Prince Jha',
    college: 'TCET Mumbai',
    branch: 'Computer Engineering',
    hackathon: 'Microsoft Imagine Cup 2026',
    message: 'Building a cloud-based healthcare SaaS app on Azure. Looking for an iOS/Swift developer and a database admin.',
    needs: ['Swift', 'Kotlin', 'AWS/Azure'],
    userId: '6a383d026b15e69a86f17854',
  },
  {
    name: 'Pooja Patel',
    college: 'VJE Mumbai',
    branch: 'Information Technology',
    hackathon: 'Google Hash Code 2026',
    message: 'Looking for competitive programmers who are fast with algorithms and graphs for Google Hash Code team. Currently we are a team of 2.',
    needs: ['C++', 'Algorithms', 'VisuAlgo'],
    userId: '6a383d026b15e69a86f17854',
  }
];

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    let posts = await TeammatePost.find({}).sort({ createdAt: -1 });

    // Auto-seed collection if empty
    if (posts.length === 0) {
      await TeammatePost.insertMany(SEED_POSTS);
      posts = await TeammatePost.find({}).sort({ createdAt: -1 });
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching teammate posts:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching teammate posts' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { hackathon, message, needs } = body;

    if (!hackathon || !message) {
      return NextResponse.json(
        { error: 'Hackathon and message are required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Query user profile info to populate post fields
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newPost = new TeammatePost({
      userId,
      name: userDoc.name || 'Anonymous Peer',
      college: userDoc.college || 'SkillBridge Member',
      branch: userDoc.branch || 'Student',
      hackathon,
      message,
      needs: Array.isArray(needs) ? needs : [],
    });

    await newPost.save();

    return NextResponse.json(
      { message: 'Teammate post created successfully', post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating teammate post:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating teammate post' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    await dbConnect();

    const post = await TeammatePost.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Teammate post not found' }, { status: 404 });
    }

    // Authorization check
    if (post.userId.toString() !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await post.deleteOne();

    return NextResponse.json({ message: 'Teammate post deleted successfully' });
  } catch (error) {
    console.error('Error deleting teammate post:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting teammate post' },
      { status: 500 }
    );
  }
}
