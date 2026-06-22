import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Goal from '@/models/Goal';

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await params;
    const body = await req.json();
    const { title, description, category, deadline, priority, status } = body;

    await dbConnect();

    // Verify ownership
    const goal = await Goal.findById(id);
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    if (goal.userId.toString() !== userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this goal' }, { status: 403 });
    }

    // Update fields if provided
    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (category !== undefined) goal.category = category;
    if (deadline !== undefined) goal.deadline = new Date(deadline);
    if (priority !== undefined) goal.priority = priority;
    if (status !== undefined) goal.status = status;

    await goal.save();

    return NextResponse.json({
      message: 'Goal updated successfully',
      goal,
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating weekly goal' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await params;

    await dbConnect();

    // Verify ownership
    const goal = await Goal.findById(id);
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    if (goal.userId.toString() !== userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this goal' }, { status: 403 });
    }

    await Goal.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting weekly goal' },
      { status: 500 }
    );
  }
}
