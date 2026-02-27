// src/components/PostActionsMenu.tsx
"use client";

import { useSession } from "next-auth/react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal, Trash2, Edit, UserPlus, VolumeX, CircleOff, Flag } from 'lucide-react';
import { mutate } from 'swr';
import { HydratedIPost } from "@/app/model/Post";
import { useConfirmationStore } from "@/store/confirmationstore";

interface PostActionsMenuProps {
  post: HydratedIPost;
  onEdit: () => void;
}

export const PostActionsMenu = ({ post, onEdit }: PostActionsMenuProps) => {
  const { data: session } = useSession();
  const confirm = useConfirmationStore((state) => state.show);

  const isOwner = session?.user?.id === post.author?._id;
  const isSimpleRetweet = post.originalPost && !post.content;

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Post?',
      description: 'This can’t be undone.',
      confirmText: 'Delete',
    });

    if (confirmed) {
      await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });
      mutate('/api/posts');
    }
  };

  // Placeholder functions for new actions
  const handleFollow = () => alert(`Following @${post.author.name}`);
  const handleMute = () => alert(`Muting @${post.author.name}`);
  const handleBlock = () => alert(`Blocking @${post.author.name}`);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="absolute right-2 top-2 rounded-full p-1.5 text-neutral-500 hover:bg-sky-500/10 hover:text-sky-500">
          <MoreHorizontal size={20} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="min-w-[240px] rounded-xl bg-black p-0 shadow-lg border border-neutral-800 z-10" sideOffset={5} align="end">
          {isOwner ? (
            <>
              <DropdownMenu.Item onSelect={handleDelete} className="flex items-center gap-3 p-3 text-sm font-bold text-red-500 cursor-pointer hover:bg-neutral-900 focus:outline-none">
                <Trash2 size={18} /> Delete
              </DropdownMenu.Item>
              
              {/* Only show "Edit" if it's not a simple retweet */}
              {!isSimpleRetweet && (
                <DropdownMenu.Item onSelect={onEdit} className="flex items-center gap-3 p-3 text-sm font-bold cursor-pointer hover:bg-neutral-900 focus:outline-none">
                  <Edit size={18} /> Edit
                </DropdownMenu.Item>
              )}
            </>
          ) : (
            <>
              <DropdownMenu.Item onSelect={handleFollow} className="flex items-center gap-3 p-3 text-sm hover:bg-neutral-900 focus:outline-none">
                <UserPlus size={18} /> Follow @{post.author.name}
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={handleMute} className="flex items-center gap-3 p-3 text-sm hover:bg-neutral-900 focus:outline-none">
                <VolumeX size={18} /> Mute @{post.author.name}
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={handleBlock} className="flex items-center gap-3 p-3 text-sm hover:bg-neutral-900 focus:outline-none">
                <CircleOff size={18} /> Block @{post.author.name}
              </DropdownMenu.Item>
            </>
          )}

          <DropdownMenu.Separator className="h-[1px] bg-neutral-800" />
          <DropdownMenu.Item onSelect={() => alert('Reporting...')} className="flex items-center gap-3 p-3 text-sm hover:bg-neutral-900 focus:outline-none">
            <Flag size={18} /> Report post
          </DropdownMenu.Item>

        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};