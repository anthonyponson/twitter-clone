// src/components/PostActionsMenu.tsx
"use client";

import { useSession } from "next-auth/react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { mutate } from 'swr';
import { HydratedIPost } from "@/app/model/Post";

interface PostActionsMenuProps {
  post: HydratedIPost;
  onEdit: () => void; // Function to trigger edit mode in the parent
}

export const PostActionsMenu = ({ post, onEdit }: PostActionsMenuProps) => {
  const { data: session } = useSession();

  // Check if the current user is the author of the post
  const isOwner = session?.user?.id === post.author?._id;

  // If not the owner, don't render anything
  if (!isOwner) {
    return null;
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });
    mutate('/api/posts'); // Revalidate the feed
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
          <DropdownMenu.Item
            onSelect={onEdit}
            className="flex items-center gap-3 p-3 text-sm font-bold cursor-pointer rounded-md hover:bg-neutral-900 focus:outline-none"
          >
            <Edit size={16} /> Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={handleDelete}
            className="flex items-center gap-3 p-3 text-sm font-bold text-red-500 cursor-pointer rounded-md hover:bg-neutral-900 focus:outline-none"
          >
            <Trash2 size={16} /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};