import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Resource from '@/models/Resource';

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, description, category, resourceType, resourceLink, difficultyLevel } = body;

    // Validate inputs
    if (!title || !description || !category || !resourceType || !resourceLink || !difficultyLevel) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        resourceType,
        resourceLink,
        difficultyLevel,
      },
      { new: true }
    );

    if (!updatedResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Resource updated successfully',
      resource: updatedResource,
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating resource' },
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

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { id } = await params;

    await dbConnect();

    const deletedResource = await Resource.findByIdAndDelete(id);

    if (!deletedResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting resource' },
      { status: 500 }
    );
  }
}
