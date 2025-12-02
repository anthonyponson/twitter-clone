// src/components/RepostButton.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Repeat, Edit } from 'lucide-react';
import { mutate } from 'swr';
import { HydratedIPost } from '@app/model/Post';
import { QuoteTweetModal } from './QuoteTweetModal';

interface RepostButtonProps {
  post: HydratedIPost;
}

export const RepostButton = ({ post }: RepostButtonProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const handleRepost = async () => {
    if (!session) return router.push('/login');
    await fetch(`/api/posts/${post._id}/repost`, { method: 'POST' });
    mutate('/api/posts'); // Refresh the feed
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="group flex items-center gap-2">
          <Repeat size={18} className="transition-colors group-hover:text-green-500"/>
          <span className="text-sm transition-colors group-hover:text-green-500">{post.repostedBy.length}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="min-w-[220px] rounded-lg bg-black p-1.5 shadow-lg border border-neutral-800">
          <DropdownMenu.Item onSelect={handleRepost} className="flex items-center gap-3 p-3 text-sm font-bold cursor-pointer rounded hover:bg-neutral-900 focus:outline-none">
            <Repeat size={18} /> Repost
          </DropdownMenu.Item>
          
          <QuoteTweetModal post={post} onClose={() => setOpen(false)}>
            <DropdownMenu.Item onSelect={(e) => e.preventDefault()} className="flex items-center gap-3 p-3 text-sm font-bold cursor-pointer rounded hover:bg-neutral-900 focus:outline-none">
              <Edit size={18} /> Quote
            </DropdownMenu.Item>
          </QuoteTweetModal>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};