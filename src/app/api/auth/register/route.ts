import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password, college, branch, graduationYear } = await req.json();

    // Basic Validation
    if (!name || !email || !password || !college || !branch || !graduationYear) {
      return NextResponse.json(
        { error: 'All fields (name, email, password, college, branch, graduationYear) are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create User
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      college,
      branch,
      graduationYear: Number(graduationYear),
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration' },
      { status: 500 }
    );
  }
}
