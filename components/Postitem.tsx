// src/components/PostItem.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { MessageCircle, Repeat, Share } from 'lucide-react';
import clsx from 'clsx';
import { mutate } from 'swr';
import { HydratedIPost } from '@/app/model/Post';
import { LikeButton } from './LikeButton';
import { RepostButton } from './RepostButton';
import { CommentModal } from './CommentModal';
import { PostActionsMenu } from './PostActionMenu';

interface PostItemProps {
  post: HydratedIPost;
  isEmbedded?: boolean;
  isMainPost?: boolean;
}

const PostItem = ({ post, isEmbedded = false, isMainPost = false }: PostItemProps) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post?.content || '');

  if (!post || !post.author) return null; 

  const isRetweet = post.originalPost && !post.content;
  const displayPost = isRetweet ? post.originalPost! : post;

  if (!displayPost || !displayPost.author) return null;
  
  const hasLiked = session ? displayPost.likes.includes(session.user.id) : false;
  const hasReposted = session ? displayPost.repostedBy.includes(session.user.id) : false;

  const handleSaveEdit = async () => {
    if (editedContent === post.content || !editedContent.trim()) {
      return setIsEditing(false);
    }
    await fetch(`/api/posts/${post._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editedContent }),
    });
    setIsEditing(false);
    mutate('/api/posts');
  };

  return (
    <div className="relative flex gap-3 p-4 border-b border-neutral-800">
      <div className="flex flex-col items-end w-10 flex-shrink-0">
        {isRetweet && <Repeat size={14} className="text-neutral-500 mb-1" />}
        <Link href={`/profile/${displayPost.author?.name}`}>
            <Image
              src={displayPost.author?.image || '/default-avatar.png'}
              alt={`${displayPost.author?.name || 'Unknown User'}'s avatar`}
              width={40} height={40} className="h-10 w-10 rounded-full cursor-pointer object-cover"
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
          
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editedContent} onChange={(e) => setEditedContent(e.target.value)}
              className="w-full resize-none border border-neutral-700 bg-black p-2 text-white focus:border-sky-500 focus:outline-none rounded-md"
              rows={4} autoFocus
            />
            <div className="mt-2 flex justify-end gap-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-1.5 text-sm font-bold rounded-full hover:bg-neutral-800">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-1.5 text-sm font-bold rounded-full bg-white text-black">Save</button>
            </div>
          </div>
        ) : (
          <div>
            <Link href={`/post/${displayPost._id}`} className="cursor-pointer">
              {post.content && <p className="mt-1 whitespace-pre-wrap">{post.content}</p>}
            </Link>
            {displayPost.image && (
              <Link href={`/post/${displayPost._id}`} className="mt-2 block cursor-pointer">
                <Image
                  src={displayPost.image} alt="Post image" width={500} height={500}
                  className="w-full h-auto max-h-[500px] object-cover rounded-2xl border border-neutral-800"
                />
              </Link>
            )}
            {post.originalPost && post.content && (
              <div className="mt-2 rounded-xl border border-neutral-800 hover:bg-neutral-900/50">
                <PostItem post={post.originalPost} isEmbedded />
              </div>
            )}
          </div>
        )}
        
        {!isEmbedded && !isEditing && (
          <div className="mt-3 flex items-center justify-between text-neutral-500 max-w-xs">
            <CommentModal post={displayPost}>
              <button className="group flex items-center gap-2">
                <MessageCircle size={18} className="transition-colors group-hover:text-sky-500"/>
                <span className="text-sm">{displayPost.comments.length}</span>
              </button>
            </CommentModal>
            <RepostButton post={displayPost} hasReposted={hasReposted} />
            <LikeButton 
              postId={displayPost._id} initialLikes={displayPost.likes} initialHasLiked={hasLiked}
            />
            <button className="group"><Share size={18} /></button>
          </div>
        )}
      </div>

      {/* --- THIS IS THE CHANGE --- */}
      {/* The menu is now always rendered here (unless it's a retweet or in edit mode) */}
      {/* It will decide internally whether to show up and what options to display. */}
      {!isRetweet && !isEditing && <PostActionsMenu post={post} onEdit={() => setIsEditing(true)} />}
    </div>
  );
};

export default PostItem;