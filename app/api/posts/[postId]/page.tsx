// src/app/post/[postId]/page.tsx

import PostItem from '@/components/Postitem';
import CreatePost from '@/components/CreatePost'; // We'll use this for replies
import { HydratedIPost } from '@/app/model/Post'; // Using your corrected path

// This helper function fetches the specific post
async function getPost(postId: string): Promise<HydratedIPost | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/posts/${postId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}


// This is the main page component
export default async function PostPage({ params }: { params: { postId: string } }) {
  const post = await getPost(params.postId);

  if (!post) {
    return <p className="p-4 text-center text-neutral-500">Post not found.</p>;
  }

  return (
    <div>
      {/* 1. The Main Post */}
      {/* We pass a prop to style it more prominently */}
      <PostItem post={post} isMainPost />

      {/* 2. The Reply Composer */}
      {/* We pass the parentPostId to tell it this is a reply */}
      <CreatePost parentPostId={post._id.toString()} />

      {/* 3. The List of Replies (Comments) */}
      <div className="border-t border-neutral-800">
        {post.comments && post.comments.map((comment: any) => (
          <PostItem key={comment._id.toString()} post={comment} />
        ))}
      </div>
    </div>
  );
}