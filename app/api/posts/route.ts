// src/app/api/posts/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@app/lib/mongoose';
import Post from '@app/model/Post';

// === HANDLER FOR CREATING A NEW POST ===
export async function POST(request: Request) {
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
    if (content.length > 280) {
      return NextResponse.json({ error: 'Content exceeds 280 characters.' }, { status: 400 });
    }

    const newPost = await Post.create({
      content,
      author: session.user.id,
    });
    
    // We can populate the author details right after creating
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

    const posts = await Post.find({})
      .populate('author', 'name email image') // Populate author with specific fields
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(50); // Limit to the latest 50 posts

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}