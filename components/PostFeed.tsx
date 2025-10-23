// src/components/PostFeed.tsx
import { HydratedIPost } from '@app/model/Post';
import PostItem from './Postitem';

// Helper function to fetch posts
async function getPosts(): Promise<HydratedIPost[]> {
  try {
    // In server components, you should use the full URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/posts`, {
      // This ensures we always get the latest posts
      cache: 'no-store', 
    });

    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

const PostFeed = async () => {
  const posts = await getPosts();

  if (posts.length === 0) {
    return <p className="p-4 text-center text-neutral-500">No posts yet. Be the first!</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostItem key={post._id.toString()} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;