// src/components/CreatePost.tsx
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// ... other imports

// Accept the new parentPostId prop
const CreatePost = ({ parentPostId }: { parentPostId?: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Determine the correct API endpoint
      const endpoint = parentPostId 
        ? `/api/posts/${parentPostId}/comment`
        : '/api/posts';
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to post');

      setContent('');
      router.refresh(); // Refresh data on the current page
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <div className="flex gap-4 border-b border-neutral-800 p-4">
      {/* ... Avatar ... */}
      <div className="flex-1">
        <textarea
          // Change placeholder based on whether it's a reply
          placeholder={parentPostId ? "Post your reply" : "What's happening?"}
          // ... rest of textarea props
        />
        <div className="mt-4 flex items-center justify-end">
          {/* Change button text based on whether it's a reply */}
          <button onClick={handlePost} disabled={!content.trim() || isSubmitting} /* ... */>
            {isSubmitting ? '...' : (parentPostId ? 'Reply' : 'Post')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;