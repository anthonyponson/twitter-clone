// src/components/PostItem.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { MessageCircle, Repeat, Share } from 'lucide-react';
import clsx from 'clsx';
import { HydratedIPost } from '@/app/model/Post';
import { LikeButton } from './LikeButton';
import { RepostButton } from './RepostButton';
import { CommentModal } from './CommentModal';

interface PostItemProps {
  post: HydratedIPost;
  isEmbedded?: boolean;
  isMainPost?: boolean;
}

const PostItem = ({ post, isEmbedded = false, isMainPost = false }: PostItemProps) => {
  const { data: session } = useSession();
  
  if (!post || !post.author) {
    return null; 
  }

  const isRetweet = post.originalPost && !post.content;
  const displayPost = isRetweet ? post.originalPost! : post;

  if (!displayPost || !displayPost.author) {
    return null;
  }
  
  const hasLiked = session ? displayPost.likes.includes(session.user.id) : false;

  return (
    <div className={clsx("flex gap-3 p-4", {
      "border-b border-neutral-800": !isMainPost && !isEmbedded
    })}>
      <div className="flex flex-col items-end w-10 flex-shrink-0">
        {isRetweet && <Repeat size={14} className="text-neutral-500 mb-1" />}
        <Link href={`/profile/${displayPost.author?.name}`}>
            <Image
              src={displayPost.author?.image || '/default-avatar.png'}
              alt={`${displayPost.author?.name || 'Unknown User'}'s avatar`}
              width={40} height={40} className="h-10 w-10 rounded-full cursor-pointer"
            />
        </Link>
      </div>
      
      <div className="flex-1">
        {isRetweet && (
          <div className="mb-1 text-sm text-neutral-500 font-semibold">
            <Link href={`/profile/${post.author.name}`} className="hover:underline">{post.author.name} reposted</Link>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Link href={`/profile/${displayPost.author.name}`} className="font-bold hover:underline">{displayPost.author?.name || 'Unknown User'}</Link>
          <p className="text-sm text-neutral-500">@{displayPost.author?.email?.split('@')[0] || 'unknown'}</p>
          <span className="text-sm text-neutral-500">·</span>
          <Link href={`/post/${displayPost._id}`} className="text-sm text-neutral-500 hover:underline">
            {formatDistanceToNowStrict(new Date(displayPost.createdAt))} ago
          </Link>
        </div>
          
        <Link href={`/post/${displayPost._id}`} className="cursor-pointer">
          {post.content && (
            <p className={clsx("mt-1 whitespace-pre-wrap", { "text-xl": isMainPost })}>
              {post.content}
            </p>
          )}
        </Link>

        {post.originalPost && post.content && (
          <div className="mt-2 rounded-xl border border-neutral-800 hover:bg-neutral-900/50 transition-colors">
            <PostItem post={post.originalPost} isEmbedded />
          </div>
        )}
        
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
              postId={displayPost._id}
              initialLikes={displayPost.likes}
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