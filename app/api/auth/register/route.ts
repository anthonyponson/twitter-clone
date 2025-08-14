// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@app/lib/Mongodb';
import User from '@app/model/User';

export async function POST(request: Request) {
  try {
    await clientPromise; // Ensure DB connection
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'User created successfully.', user: newUser }, { status: 201 });

  } catch (error) {
    console.error('REGISTRATION_ERROR', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}