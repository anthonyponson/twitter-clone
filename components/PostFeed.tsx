// src/components/PostFeed.tsx
"use client";

import useSWR from 'swr';
import { HydratedIPost } from '@app/model/Post';
import PostItem from './Postitem';

// Define a fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

const PostFeed = () => {
  // Use the SWR hook to fetch and manage posts
  const { data: posts, error, isLoading } = useSWR<HydratedIPost[]>('/api/posts', fetcher);

  if (isLoading) return <p className="p-4 text-center">Loading feed...</p>;
  if (error) return <p className="p-4 text-center text-red-500">Failed to load feed.</p>;
  if (!posts || posts.length === 0) {
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