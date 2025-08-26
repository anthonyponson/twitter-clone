// src/app/api/user/image/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@app/lib/mongoose';
import User from '@app/model/User';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { imageUrl } = await request.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    await dbConnect();

    // Find user by email from session and update their image
    await User.findOneAndUpdate(
      { email: session.user?.email },
      { image: imageUrl },
      { new: true } // Return the updated document
    );

    return NextResponse.json({ message: 'Profile picture updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}