// src/app/api/posts/[postId]/comment/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@app/lib/mongoose';
import Post, { IPost } from '@app/model/Post';

interface Params {
  postId: string;
}

export async function POST(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = params;
  const { content } = await request.json();

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: 'Comment content cannot be empty.' }, { status: 400 });
  }

  try {
    await dbConnect();
    
    // 1. Create the new comment post
    const newComment = await Post.create({
      content,
      author: session.user.id,
      parentPost: postId,
    });

    // 2. Add the comment's ID to the parent post's `comments` array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });
    
    // TODO: Send a notification to the original post author

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}