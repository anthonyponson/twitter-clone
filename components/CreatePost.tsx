// src/components/CreatePost.tsx
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImageIcon, List, Smile, Calendar, MapPin } from 'lucide-react';
import clsx from 'clsx';

// The component accepts an optional parentPostId to know if it's a reply
const CreatePost = ({ parentPostId }: { parentPostId?: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const endpoint = parentPostId 
        ? `/api/posts/${parentPostId}/comment`
        : '/api/posts';
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post');
      }

      setContent('');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render the component if the user isn't logged in
  if (!session) return null;

  return (
    <div className="flex gap-4 border-b border-neutral-800 p-4">
      <Image
        src={session.user?.image || '/default-avatar.png'}
        alt="User avatar"
        width={40} height={40} className="h-10 w-10 rounded-full"
      />
      <div className="flex-1">
        {/* ======================= THE STYLING FIX IS HERE ======================= */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentPostId ? "Post your reply" : "What's happening?"}
          className="w-full resize-none border-none bg-transparent text-xl text-white placeholder-neutral-500 focus:outline-none"
          rows={2} 
          maxLength={280}
        />
        {/* ======================================================================= */}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1">
            {/* Action Icons with modern hover effects */}
            {[ImageIcon, List, Smile, Calendar, MapPin].map((Icon, index) => (
              <button
                key={index}
                className="rounded-full p-2 text-sky-500 transition-colors duration-200 hover:bg-sky-500/10"
              >
                <Icon size={20} />
              </button>
            ))}
          </div>
          <button
            onClick={handlePost}
            disabled={!content.trim() || isSubmitting}
            className={clsx(
              'rounded-full px-4 py-1.5 font-bold text-white transition-all duration-200',
              // Classes for the enabled state
              {
                'bg-sky-500 hover:bg-sky-600': content.trim() && !isSubmitting,
                // Classes for the disabled state
                'cursor-not-allowed bg-sky-900 text-neutral-500': !content.trim() || isSubmitting,
              }
            )}
          >
            {isSubmitting ? '...' : (parentPostId ? 'Reply' : 'Post')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;