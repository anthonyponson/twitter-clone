// src/app/api/posts/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@app/lib/mongoose';
import Post from '@app/model/Post'; // Using your corrected path

// ============ THE FIX IS HERE ============
// Import the User model to make it available for Mongoose's populate method.
import User from '@/app/model/User';
// ===========================================

// === HANDLER FOR CREATING A NEW POST ===
export async function POST(request: Request) {
  // ... (Your POST logic for creating a new post remains the same)
  // It's already correct.
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content cannot be empty.' }, { status: 400 });
    }

    const newPost = await Post.create({
      content,
      author: session.user.id,
    });
    
    const populatedPost = await newPost.populate('author', 'name email image');
    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// === HANDLER FOR FETCHING ALL POSTS ===
export async function GET() {
  try {
    await dbConnect();

    // This query will now work correctly because the User model is imported.
    const posts = await Post.find({})
      .populate({
        path: 'author',
        model: User, // Explicitly providing the model is even more robust
        select: 'name email image'
      })
      .populate({
        path: 'originalPost',
        populate: {
          path: 'author',
          model: User, // Also be explicit here
          select: 'name email image'
        }
      })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}