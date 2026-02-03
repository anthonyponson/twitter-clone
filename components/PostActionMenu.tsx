// src/components/PostActionsMenu.tsx
"use client";

import { useSession } from "next-auth/react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { mutate } from 'swr';
import { HydratedIPost } from "@/app/model/Post";
import { useConfirmationStore } from "@/store/confirmationstore"; // <-- IMPORT THE STORE HOOK

interface PostActionsMenuProps {
  post: HydratedIPost;
  onEdit: () => void;
}

export const PostActionsMenu = ({ post, onEdit }: PostActionsMenuProps) => {
  const { data: session } = useSession();
  const confirm = useConfirmationStore((state) => state.show); // <-- GET THE 'show' FUNCTION

  const isOwner = session?.user?.id === post.author?._id;

  if (!isOwner) {
    return null;
  }

  const handleDelete = async () => {
    // --- REPLACE window.confirm WITH OUR CUSTOM HOOK ---
    const confirmed = await confirm({
      title: 'Delete Post?',
      description: 'This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.',
      confirmText: 'Delete',
    });

    if (confirmed) {
      await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });
      mutate('/api/posts');
    }
    // ---------------------------------------------------
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="absolute right-2 top-2 rounded-full p-1.5 text-neutral-500 hover:bg-sky-500/10 hover:text-sky-500">
          <MoreHorizontal size={20} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="min-w-[180px] rounded-lg bg-black p-1.5 shadow-lg border border-neutral-800 z-10" sideOffset={5} align="end">
          <DropdownMenu.Item onSelect={onEdit} /* ... */ >
            <Edit size={16} /> Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleDelete} /* ... */ >
            <Trash2 size={16} /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};