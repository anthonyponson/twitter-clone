// src/components/PostItem.tsx
"use client"; // This component is now interactive

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Heart, MessageCircle, Repeat, Share } from 'lucide-react';
import clsx from 'clsx';
import { HydratedIPost } from '@app/model/Post';

interface PostItemProps {
  post: HydratedIPost;
}

const PostItem = ({ post }: PostItemProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  // Determine if the current user has liked this post
  const hasLiked = session ? post.likes.includes(session.user.id as any) : false;

  const handleLike = async () => {
    if (!session) {
      // Redirect to login if not authenticated
      return router.push('/login');
    }
    try {
      await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
      });
      // Refresh the page to show the updated like count and color
      router.refresh();
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };
  
  // Placeholder functions for other actions
  const handleComment = () => console.log("Comment clicked");
  const handleRepost = () => console.log("Repost clicked");

  return (
    <div className="flex gap-4 border-b border-neutral-800 p-4">
      <Image
        src={post.author.image || '/default-avatar.png'}
        alt={`${post.author.name}'s avatar`}
        width={40} height={40} className="h-10 w-10 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold">{post.author.name}</p>
          <p className="text-sm text-neutral-500">@{post.author.email?.split('@')[0]}</p>
          <span className="text-sm text-neutral-500">·</span>
          <p className="text-sm text-neutral-500">
            {formatDistanceToNowStrict(new Date(post.createdAt))} ago
          </p>
        </div>
        <p className="mt-1 whitespace-pre-wrap">{post.content}</p>

        {/* --- ACTION BUTTONS --- */}
        <div className="mt-3 flex items-center justify-between text-neutral-500">
          {/* Comment Button */}
          <button onClick={handleComment} className="group flex items-center gap-2">
            <MessageCircle size={18} className="transition-colors group-hover:text-sky-500"/>
            <span className="text-sm transition-colors group-hover:text-sky-500">{post.comments.length}</span>
          </button>

          {/* Repost Button */}
          <button onClick={handleRepost} className="group flex items-center gap-2">
            <Repeat size={18} className="transition-colors group-hover:text-green-500"/>
            <span className="text-sm transition-colors group-hover:text-green-500">{post.repostedBy.length}</span>
          </button>

          {/* Like Button */}
          <button onClick={handleLike} className="group flex items-center gap-2">
            <Heart
              size={18}
              className={clsx('transition-colors group-hover:text-red-500', {
                'fill-red-500 text-red-500': hasLiked,
              })}
            />
            <span className={clsx('text-sm transition-colors group-hover:text-red-500', {
              'text-red-500': hasLiked,
            })}>
              {post.likes.length}
            </span>
          </button>
          
          {/* Share Button */}
          <button className="group">
            <Share size={18} className="transition-colors group-hover:text-sky-500" />
          </button>
        </div>
        {/* --- END ACTION BUTTONS --- */}

      </div>
    </div>
  );
};

export default PostItem;