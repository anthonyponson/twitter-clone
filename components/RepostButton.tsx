// src/components/RepostButton.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Repeat, Edit } from 'lucide-react';
import { mutate } from 'swr';
import { HydratedIPost } from '@/app/model/Post';
import { QuoteTweetModal } from './QuoteTweetModal';

interface RepostButtonProps {
  post: HydratedIPost;
  hasReposted: boolean; // <-- NEW PROP
}

export const RepostButton = ({ post, hasReposted }: RepostButtonProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // This function now handles both reposting and undoing a repost.
  const handleToggleRepost = async () => {
    if (!session) return router.push('/login');
    
    // We call the exact same API endpoint for both actions.
    // The server is smart enough to figure out what to do.
    await fetch(`/api/posts/${post._id}/repost`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}), // Empty body for a simple repost/undo
    });
    
    // Refresh the feed to show the change.
    mutate('/api/posts');
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="group flex items-center gap-2">
          {/* Change icon color if the user has reposted */}
          <Repeat size={18} className={hasReposted ? 'text-green-500' : 'transition-colors group-hover:text-green-500'}/>
          <span className={hasReposted ? 'text-green-500' : 'text-sm transition-colors group-hover:text-green-500'}>
            {post.repostedBy.length}
          </span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="min-w-[200px] rounded-lg bg-black p-1.5 shadow-lg border border-neutral-800 z-10" sideOffset={5} align="start">
          
          {/* Show "Undo Repost" or "Repost" based on the prop */}
          <DropdownMenu.Item onSelect={handleToggleRepost} className="flex items-center gap-3 p-3 text-sm font-bold cursor-pointer rounded-md hover:bg-neutral-900 focus:outline-none">
            <Repeat size={18} /> {hasReposted ? 'Undo Repost' : 'Repost'}
          </DropdownMenu.Item>
          
          <QuoteTweetModal post={post} onClose={() => setOpen(false)}>
            <DropdownMenu.Item onSelect={(e) => e.preventDefault()} className="flex items-center gap-3 p-3 text-sm font-bold cursor-pointer rounded-md hover:bg-neutral-900 focus:outline-none">
              <Edit size={18} /> Quote
            </DropdownMenu.Item>
          </QuoteTweetModal>

        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};