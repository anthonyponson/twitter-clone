// src/app/post/[postId]/page.tsx

import PostItem from '@/components/Postitem';
import CreatePost from '@/components/CreatePost';
import { HydratedIPost } from '@/app/model/Post';

async function getPost(postId: string): Promise<HydratedIPost | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/posts/${postId}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

export default async function PostPage({ params }: { params: { postId: string } }) {
  const post = await getPost(params.postId);

  if (!post) {
    return <p className="p-4 text-center text-neutral-500">Post not found.</p>;
  }

  return (
    <div>
      <PostItem post={post} isMainPost />
      <CreatePost parentPostId={post._id} />
      <div className="border-t border-neutral-800">
        {/* The error is gone because `comment._id` is now correctly typed as a string */}
        {post.comments && post.comments.map((comment) => (
          <PostItem key={comment._id} post={comment} />
        ))}
      </div>
    </div>
  );
}