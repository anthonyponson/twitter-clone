// src/components/PostItem.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { MessageCircle, Share } from 'lucide-react';
import clsx from 'clsx';
import { HydratedIPost } from '@/app/model/Post'; // Using your corrected path
import { LikeButton } from './LikeButton';
import { RepostButton } from './RepostButton';
import { CommentModal } from './CommentModal';

// Define the complete props for this component
interface PostItemProps {
  post: HydratedIPost;
  isEmbedded?: boolean; // Is this post rendered inside another post (like a quote tweet)?
  isMainPost?: boolean;  // Is this the main, focused post on a detail page?
}

const PostItem = ({ post, isEmbedded = false, isMainPost = false }: PostItemProps) => {
  const { data: session } = useSession();
  
  // Defensive check: If the post or its author is missing, render nothing to prevent crashes.
  if (!post || !post.author) {
    return null; 
  }

  // Determine if this post is a simple retweet (no content of its own, just points to another post)
  const isRetweet = post.originalPost && !post.content;
  
  // Determine which post's data to display (the retweet's original post, or the post itself)
  const displayPost = isRetweet ? post.originalPost! : post;

  // Another defensive check in case the originalPost data is malformed
  if (!displayPost || !display-post.author) {
    return null;
  }
  
  // Check if the currently logged-in user has liked the displayPost
  const hasLiked = session ? displayPost.likes.includes(session.user.id as any) : false;

  return (
    <div className={clsx("flex gap-4 p-4", {
      "border-b border-neutral-800": !isMainPost && !isEmbedded // Add bottom border unless it's a main post or embedded
    })}>
      {/* Avatar Section */}
      <div className="flex flex-col items-center w-10 flex-shrink-0">
        <Link href={`/profile/${displayPost.author?.name}`}>
            <Image
              src={displayPost.author?.image || '/default-avatar.png'}
              alt={`${displayPost.author?.name || 'Unknown User'}'s avatar`}
              width={40} height={40} className="h-10 w-10 rounded-full cursor-pointer"
            />
        </Link>
      </div>
      
      {/* Main Content Section */}
      <div className="flex-1">
        {isRetweet && (
          <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500 font-semibold">
            {/* ... Retweet indicator icon can go here ... */}
            <p>{post.author.name} reposted</p>
          </div>
        )}

        {/* Post Header and Content (wrapped in a Link to the post detail page) */}
        <Link href={`/post/${displayPost._id}`} className="cursor-pointer">
          <div className="flex items-center gap-2">
            <p className="font-bold hover:underline">{displayPost.author?.name || 'Unknown User'}</p>
            <p className="text-sm text-neutral-500">@{displayPost.author?.email?.split('@')[0] || 'unknown'}</p>
            <span className="text-sm text-neutral-500">·</span>
            <p className="text-sm text-neutral-500 hover:underline">
              {formatDistanceToNowStrict(new Date(displayPost.createdAt))} ago
            </p>
          </div>
          
          {/* Render the post's own content if it's not a simple retweet */}
          {post.content && (
            <p className={clsx("mt-1 whitespace-pre-wrap", { "text-xl": isMainPost })}>
              {post.content}
            </p>
          )}
        </Link>

        {/* If it's a Quote Tweet, render the original post embedded inside */}
        {post.originalPost && post.content && (
          <div className="mt-2 rounded-xl border border-neutral-800 hover:bg-neutral-900/50 transition-colors">
            <PostItem post={post.originalPost} isEmbedded />
          </div>
        )}
        
        {/* Action Buttons: Only show if not an embedded post */}
        {!isEmbedded && (
          <div className="mt-3 flex items-center justify-between text-neutral-500 max-w-xs">
            <CommentModal post={displayPost}>
              <button className="group flex items-center gap-2">
                <MessageCircle size={18} className="transition-colors group-hover:text-sky-500"/>
                <span className="text-sm transition-colors group-hover:text-sky-500">{displayPost.comments.length}</span>
              </button>
            </CommentModal>

            <RepostButton post={displayPost} />

            <LikeButton 
              postId={displayPost._id.toString()}
              initialLikes={displayPost.likes as any[]}
              initialHasLiked={hasLiked}
            />
            
            <button className="group">
              <Share size={18} className="transition-colors group-hover:text-sky-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostItem;