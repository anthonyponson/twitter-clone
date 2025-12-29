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
  const body = (await request.json().catch(() => ({}))) as { content?: string };

  try {
    await dbConnect();
    
    const originalPost = await Post.findById(postId);
    if (!originalPost) {
      return NextResponse.json({ error: 'Original post not found' }, { status: 404 });
    }

    const newPost = await Post.create({
      author: session.user.id,
      originalPost: postId,
      content: body.content || null,
    });

    await Post.findByIdAndUpdate(postId, {
      $addToSet: { repostedBy: session.user.id },
    });

    // ============= THIS IS THE CRITICAL FIX =============
    // We must populate all the necessary data before sending the new post back.
    const populatedNewPost = await Post.findById(newPost._id)
      .populate({
        path: 'author',
        model: User,
        select: 'name email image'
      })
      .populate({
        path: 'originalPost',
        model: Post,
        populate: {
          path: 'author',
          model: User,
          select: 'name email image'
        }
      });
    // ====================================================

    return NextResponse.json(populatedNewPost, { status: 201 });
  } catch (error) {
    console.error("Error reposting:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}