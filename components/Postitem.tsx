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
import { HydratedIPost } from '@/app/model/Post'; // Using your corrected path
import { LikeButton } from './LikeButton';
import { RepostButton } from './RepostButton';
import { CommentModal } from './CommentModal';
import { PostActionsMenu } from './PostActionMenu';

// Define the complete props for this component
interface PostItemProps {
  post: HydratedIPost;
  isEmbedded?: boolean; // Is this post rendered inside another post (like a quote tweet)?
  isMainPost?: boolean;  // Is this the main, focused post on a detail page?
}

const PostItem = ({ post, isEmbedded = false, isMainPost = false }: PostItemProps) => {
  const { data: session } = useSession();
  
  // State for managing edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post?.content || '');

  // Defensive check: If the post or its author is missing, render nothing to prevent crashes.
  if (!post || !post.author) {
    return null; 
  }

  // Determine post type and which post's data to display
  const isRetweet = post.originalPost && !post.content;
  const displayPost = isRetweet ? post.originalPost : post;

  // Another defensive check in case the originalPost data is malformed
  if (!displayPost || !displayPost.author) {
    return null;
  }
  
  // Calculate interaction states for the current user
  const hasLiked = session ? displayPost.likes.includes(session.user.id) : false;
  const hasReposted = session ? displayPost.repostedBy.includes(session.user.id) : false;

  // Function to handle saving an edited post
  const handleSaveEdit = async () => {
    if (editedContent === post.content || !editedContent.trim()) {
      return setIsEditing(false); // No changes made or content is empty
    }
    await fetch(`/api/posts/${post._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editedContent }),
    });
    setIsEditing(false);
    mutate('/api/posts'); // Revalidate the feed to show the updated post
  };

  return (
    <div className={clsx("relative flex gap-3 p-4", { // Added 'relative' for menu positioning
      "border-b border-neutral-800": !isMainPost && !isEmbedded
    })}>
      {/* Avatar Section */}
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
      
      {/* Main Content Section */}
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
          
        {/* Conditional Rendering for Edit Mode vs. Display Mode */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full resize-none border border-neutral-700 bg-black p-2 text-white focus:border-sky-500 focus:outline-none rounded-md"
              rows={4}
              autoFocus
            />
            <div className="mt-2 flex justify-end gap-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-1.5 text-sm font-bold rounded-full hover:bg-neutral-800">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-1.5 text-sm font-bold rounded-full bg-white text-black">Save</button>
            </div>
          </div>
        ) : (
          <div>
            <Link href={`/post/${displayPost._id}`} className="cursor-pointer">
              {/* Render the post's own content (for normal posts and quote tweets) */}
              {post.content && (
                <p className={clsx("mt-1 whitespace-pre-wrap", { "text-xl": isMainPost })}>
                  {post.content}
                </p>
              )}
            </Link>
            
            {/* Render the post's image, if it has one */}
            {displayPost.image && (
              <Link href={`/post/${displayPost._id}`} className="mt-2 block">
                <Image
                  src={displayPost.image}
                  alt="Post image"
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-xl border border-neutral-800"
                />
              </Link>
            )}

            {/* If it's a Quote Tweet, render the original post embedded inside */}
            {post.originalPost && post.content && (
              <div className="mt-2 rounded-xl border border-neutral-800 hover:bg-neutral-900/50 transition-colors">
                <PostItem post={post.originalPost} isEmbedded />
              </div>
            )}
          </div>
        )}
        
        {/* Action Buttons: Only show if not an embedded post and not in edit mode */}
        {!isEmbedded && !isEditing && (
          <div className="mt-3 flex items-center justify-between text-neutral-500 max-w-xs">
            <CommentModal post={displayPost}>
              <button className="group flex items-center gap-2">
                <MessageCircle size={18} className="transition-colors group-hover:text-sky-500"/>
                <span className="text-sm transition-colors group-hover:text-sky-500">{displayPost.comments.length}</span>
              </button>
            </CommentModal>

            <RepostButton post={displayPost} hasReposted={hasReposted} />

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

      {/* The three-dots menu for Edit/Delete actions */}
      {/* It will only render if the current user is the owner and not in edit mode */}
      {!isRetweet && !isEditing && <PostActionsMenu post={post} onEdit={() => setIsEditing(true)} />}
    </div>
  );
};

export default PostItem;