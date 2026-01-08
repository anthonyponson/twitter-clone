// src/app/api/posts/[postId]/repost/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@app/lib/mongoose';
import Post from '@/app/model/Post';
import User from '@/app/model/User';

interface Params {
  postId: string;
}

export async function POST(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = params;
  const userId = session.user.id;
  const { content } = (await request.json().catch(() => ({}))) as { content?: string };

  try {
    await dbConnect();
    
    // If it's a quote tweet, always create a new post.
    if (content) {
      const newQuotePost = await Post.create({
        author: userId,
        originalPost: postId,
        content: content,
      });
      await Post.findByIdAndUpdate(postId, { $addToSet: { repostedBy: userId } });
      const populatedPost = await Post.findById(newQuotePost._id).populate({ path: 'author', model: User, select: 'name email image' });
      return NextResponse.json(populatedPost, { status: 201 });
    }

    // --- THIS IS THE NEW UNDO REPOST LOGIC ---
    // Check if a simple repost from this user for this post already exists.
    const existingRepost = await Post.findOne({
      author: userId,
      originalPost: postId,
      content: null, // Ensure it's a simple repost, not a quote
    });

    if (existingRepost) {
      // If it exists, UNDO the repost.
      // 1. Delete the repost document itself.
      await Post.findByIdAndDelete(existingRepost._id);

      // 2. Remove the user's ID from the original post's `repostedBy` array.
      await Post.findByIdAndUpdate(postId, {
        $pull: { repostedBy: userId },
      });

      return NextResponse.json({ message: 'Repost undone successfully.' }, { status: 200 });

    } else {
      // If it does NOT exist, CREATE the repost.
      // This is the original logic.
      const newRepost = await Post.create({
        author: userId,
        originalPost: postId,
        content: null,
      });

      await Post.findByIdAndUpdate(postId, {
        $addToSet: { repostedBy: userId },
      });

      const populatedNewPost = await Post.findById(newRepost._id)
        .populate({ path: 'author', model: User, select: 'name email image' })
        .populate({
          path: 'originalPost',
          model: Post,
          populate: { path: 'author', model: User, select: 'name email image' }
        });

      return NextResponse.json(populatedNewPost, { status: 201 });
    }
    // --- END OF NEW LOGIC ---

  } catch (error) {
    console.error("Error handling repost:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}