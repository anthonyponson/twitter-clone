// src/app/api/posts/[postId]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@app/lib/mongoose';
import Post from '@app/model/Post'; // Using your corrected path
import User from '@app/model/User'; // Import User for population

interface Params {
  postId: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  const { postId } = params;

  try {
    await dbConnect();

    const post = await Post.findById(postId)
      // Populate the main post's author
      .populate({
        path: 'author',
        model: User,
        select: 'name email image'
      })
      // Populate the comments array
      .populate({
        path: 'comments',
        // For each comment, also populate its author
        populate: {
          path: 'author',
          model: User,
          select: 'name email image'
        },
        options: { sort: { createdAt: -1 } } // Sort comments by newest first
      });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}