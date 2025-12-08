// src/components/PostItem.tsx
"use client";

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { MessageCircle, Share } from 'lucide-react';
import { HydratedIPost } from '@app/model/Post';
import { LikeButton } from './LikeButton';
import { RepostButton } from './RepostButton';
import { CommentModal } from './CommentModal';

interface PostItemProps {
  post: HydratedIPost;
  isEmbedded?: boolean; 
}

const PostItem = ({ post, isEmbedded = false }: PostItemProps) => {
  const { data: session } = useSession();

  // Defensive check: if for some reason a post is malformed, don't crash the page.
  if (!post || !post.author) {
    return null; 
  }

  const isRetweet = post.originalPost && !post.content;
  const displayPost = isRetweet ? post.originalPost! : post;

  // Defensive check for the display post as well
  if (!displayPost || !displayPost.author) {
    return null;
  }
  
  const hasLiked = session ? displayPost.likes.includes(session.user.id as any) : false;

  return (
    <div className="flex gap-4 border-b border-neutral-800 p-4">
      <div className="flex flex-col items-center w-10">
        {/* ============ DEFENSIVE ACCESS WITH ?. ============ */}
        <Image
          src={displayPost.author?.image || '/default-avatar.png'}
          alt={`${displayPost.author?.name || 'Unknown User'}'s avatar`}
          width={40} height={40} className="h-10 w-10 rounded-full"
        />
        {/* ================================================= */}
      </div>
      <div className="flex-1">
        {isRetweet && (
          <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500">
            {/* ... repost indicator ... */}
          </div>
        )}
        <div className="flex items-center gap-2">
          {/* ============ DEFENSIVE ACCESS WITH ?. ============ */}
          <p className="font-bold">{displayPost.author?.name || 'Unknown User'}</p>
          <p className="text-sm text-neutral-500">@{displayPost.author?.email?.split('@')[0] || 'unknown'}</p>
          {/* ================================================= */}
          <span className="text-sm text-neutral-500">·</span>
          <p className="text-sm text-neutral-500">
            {formatDistanceToNowStrict(new Date(displayPost.createdAt))} ago
          </p>
        </div>

        {post.content && <p className="mt-1 whitespace-pre-wrap">{post.content}</p>}

        {post.originalPost && post.content && (
          <div className="mt-2 rounded-xl border border-neutral-800">
            {/* Recursive call is fine, as it will also have the checks */}
            <PostItem post={post.originalPost} isEmbedded />
          </div>
        )}
        
        {!isEmbedded && (
          <div className="mt-3 flex items-center justify-between text-neutral-500">
            <CommentModal post={displayPost}>
              <button className="group flex items-center gap-2">
                <MessageCircle size={18} className="transition-colors group-hover:text-sky-500"/>
                <span className="text-sm">{displayPost.comments.length}</span>
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