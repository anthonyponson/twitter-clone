// src/components/PostItem.tsx
"use client";

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { MessageCircle, Repeat, Share } from 'lucide-react';
import { HydratedIPost } from '@app/model/Post';
import { LikeButton } from './LikeButton'; // Import the new component

interface PostItemProps {
  post: HydratedIPost;
}

const PostItem = ({ post }: PostItemProps) => {
  const { data: session } = useSession();

  const hasLiked = session ? post.likes.includes(session.user.id as any) : false;

  return (
    <div className="flex gap-4 border-b border-neutral-800 p-4">
      {/* ... Avatar and Post content ... */}
      <div className="mt-3 flex items-center justify-between text-neutral-500">
        <button className="group flex ..."><MessageCircle size={18} /><span>{post.comments.length}</span></button>
        <button className="group flex ..."><Repeat size={18} /><span>{post.repostedBy.length}</span></button>
        
        {/* Replace the old button with the new component */}
        <LikeButton 
          postId={post._id.toString()}
          initialLikes={post.likes as any[]}
          initialHasLiked={hasLiked}
        />
        
        <button className="group"><Share size={18} /></button>
      </div>
    </div>
  );
};

export default PostItem;