// src/app/api/posts/[postId]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next'; 
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@app/lib/mongoose';
import Post from '@app/model/Post'; // Using your corrected path
import User from '@app/model/User'; // Import User for population

interface Params {
  postId: string;
}
// === GET HANDLER ===
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

// === DELETE HANDLER ===

export async function DELETE(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = params;

  try {
    await dbConnect();
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // CRITICAL: Ownership check
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Post.findByIdAndDelete(postId);

    return NextResponse.json({ message: 'Post deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// === PUT HANDLER for editing (NEW) ===
export async function PUT(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = params;
  const { content } = await request.json();

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: 'Content cannot be empty.' }, { status: 400 });
  }

  try {
    await dbConnect();
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // CRITICAL: Ownership check
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { content },
      { new: true }
    ).populate('author', 'name email image'); // Repopulate after update

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error(`Error updating post ${postId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}