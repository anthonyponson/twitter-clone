// src/components/LikeButton.tsx
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import { mutate } from 'swr'; // Import mutate for revalidation

interface LikeButtonProps {
  postId: string;
  initialLikes: string[]; // Array of user IDs
  initialHasLiked: boolean;
}

export const LikeButton = ({ postId, initialLikes, initialHasLiked }: LikeButtonProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Use local state for instant feedback
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [likeCount, setLikeCount] = useState(initialLikes.length);

  const handleLike = async () => {
    if (!session) return router.push('/login');
    
    // --- Optimistic UI Update ---
    // Instantly update the UI based on the current state
    if (hasLiked) {
      setHasLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setHasLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    // ----------------------------

    // Send the request to the server in the background
    const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });

    if (!res.ok) {
      // --- Revert UI on failure ---
      // If the server fails, revert the changes
      if (hasLiked) { // The original state was 'liked'
        setHasLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        setHasLiked(false);
        setLikeCount((prev) => prev - 1);
      }
      alert("Failed to update like status.");
    }
    
    // Tell SWR to re-fetch the data for this key to ensure consistency
    mutate('/api/posts');
  };

  return (
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
        {likeCount}
      </span>
    </button>
  );
};