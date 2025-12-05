// src/components/PostItem.tsx
"use client";

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { MessageCircle, Repeat, Share } from 'lucide-react';
import { HydratedIPost } from '@app/model/Post';
import { LikeButton } from './LikeButton';
import { RepostButton } from './RepostButton'; // Import the new component
import { CommentModal } from './CommentModal';

// Add a new prop to handle the embedded style
interface PostItemProps {
  post: HydratedIPost;
  isEmbedded?: boolean; 
}

const PostItem = ({ post, isEmbedded = false }: PostItemProps) => {
  const { data: session } = useSession();
  const hasLiked = session ? post.likes.includes(session.user.id as any) : false;

  // This is a simple retweet if it has an originalPost but no content of its own
  const isRetweet = post.originalPost && !post.content;

  // The post to display (either the post itself or the original post if it's a retweet)
  const displayPost = isRetweet ? post.originalPost! : post;

  return (
    <div className="flex gap-4 border-b border-neutral-800 p-4">
      <div className="flex flex-col items-center w-10">
        <Image
          src={displayPost.author.image || '/default-avatar.png'}
          alt={`${displayPost.author.name}'s avatar`}
          width={40} height={40} className="h-10 w-10 rounded-full"
        />
      </div>
      <div className="flex-1">
        {isRetweet && (
          <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500">
            <Repeat size={14} />
            <p>{post.author.name} reposted</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <p className="font-bold">{displayPost.author.name}</p>
          <p className="text-sm text-neutral-500">@{displayPost.author.email?.split('@')[0]}</p>
          <span className="text-sm text-neutral-500">·</span>
          <p className="text-sm text-neutral-500">
            {formatDistanceToNowStrict(new Date(displayPost.createdAt))} ago
          </p>
        </div>

        {/* Show the content of the quote tweet */}
        {post.content && <p className="mt-1 whitespace-pre-wrap">{post.content}</p>}

        {/* If it's a quote tweet, render the original post embedded */}
        {post.originalPost && post.content && (
          <div className="mt-2 rounded-xl border border-neutral-800">
            <PostItem post={post.originalPost} isEmbedded />
          </div>
        )}
        
        {/* Hide action buttons on embedded posts for a cleaner look */}
        {!isEmbedded && (
          <div className="mt-3 flex items-center justify-between text-neutral-500">
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
            
            <button className="group"><Share size={18} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostItem;