// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@app/lib/mongoose'; // <-- IMPORT THE NEW HELPER
import User from '@app/model/User';

export async function POST(request: Request) {
  try {
    await dbConnect(); // <-- USE THE HELPER HERE

    const { name, email, password } = await request.json();
    // ... rest of your registration logic (check if user exists, hash password, create user) ...
    // This part should now work correctly.

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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