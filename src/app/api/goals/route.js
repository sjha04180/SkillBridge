import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Goal from '@/models/Goal';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    await dbConnect();

    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching weekly goals' },
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
    const { title, description, category, deadline, priority, status } = body;

    if (!title || !category || !deadline) {
      return NextResponse.json(
        { error: 'Title, category, and deadline are required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const newGoal = new Goal({
      userId,
      title,
      description: description || '',
      category,
      deadline: new Date(deadline),
      priority: priority || 'Medium',
      status: status || 'Pending',
    });

    await newGoal.save();

    return NextResponse.json(
      { message: 'Goal created successfully', goal: newGoal },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating goal' },
      { status: 500 }
    );
  }
}
