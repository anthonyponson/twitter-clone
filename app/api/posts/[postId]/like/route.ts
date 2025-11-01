// src/app/api/posts/[postId]/like/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@app/lib/mongoose';
import Post from '@app/model/Post';

interface Params {
  postId: string;
}

// Handler for LIKING or UNLIKING a post
export async function POST(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = params;
  const userId = session.user.id;

  try {
    await dbConnect();
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if the user has already liked the post
    const hasLiked = post.likes.includes(userId);

    let updatedPost;
    if (hasLiked) {
      // User is unliking the post
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      // User is liking the post
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } }, // $addToSet prevents duplicate likes
        { new: true }
      );
    }

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}