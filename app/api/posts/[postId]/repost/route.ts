// src/app/api/posts/[postId]/repost/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@app/lib/mongoose';
import Post from '@app/model/Post';

interface Params {
  postId: string;
}

export async function POST(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = params;
  // Content is optional. If present, it's a quote tweet.
  const { content } = (await request.json().catch(() => ({}))) as { content?: string };

  try {
    await dbConnect();
    
    // 1. Ensure the original post exists
    const originalPost = await Post.findById(postId);
    if (!originalPost) {
      return NextResponse.json({ error: 'Original post not found' }, { status: 404 });
    }

    // 2. Create the new post (the retweet or quote tweet)
    const newPost = await Post.create({
      author: session.user.id,
      originalPost: postId,
      content: content || null, // content will be null for a simple retweet
    });

    // 3. Update the original post to track the repost
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { repostedBy: session.user.id },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error reposting:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}