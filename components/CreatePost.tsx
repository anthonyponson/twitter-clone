// src/components/CreatePost.tsx
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImageIcon, FileBox, List, Smile } from 'lucide-react';
import clsx from 'clsx';

const CreatePost = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      setContent(''); // Clear input on success
      router.refresh(); // This is the Next.js 13+ way to refresh server data
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null; // Don't show the composer if not logged in

  return (
    <div className="flex gap-4 border-b border-neutral-800 p-4">
      <Image
        src={session.user?.image || '/default-avatar.png'}
        alt="User avatar"
        width={40} height={40} className="h-10 w-10 rounded-full"
      />
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full resize-none bg-transparent text-xl placeholder-neutral-500 focus:outline-none"
          rows={2} maxLength={280}
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1 text-sky-500">
            <ImageIcon size={20} className="cursor-pointer" />
            <FileBox size={20} className="cursor-pointer" />
            <List size={20} className="cursor-pointer" />
            <Smile size={20} className="cursor-pointer" />
          </div>
          <button
            onClick={handlePost}
            disabled={!content.trim() || isSubmitting}
            className={clsx(
              'rounded-full px-4 py-1.5 font-bold text-white transition-all duration-200',
              {
                'bg-sky-500 hover:bg-sky-600': content.trim() && !isSubmitting,
                'cursor-not-allowed bg-sky-900 text-neutral-500': !content.trim() || isSubmitting,
              }
            )}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;