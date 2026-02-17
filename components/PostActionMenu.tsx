// src/components/PostActionsMenu.tsx
"use client";

import { useSession } from "next-auth/react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { 
  MoreHorizontal, 
  Trash2, 
  Edit,
  UserPlus,
  VolumeX,
  CircleOff,
  Flag,
  Code,
  BarChart2,
} from 'lucide-react';
import { mutate } from 'swr';
import { HydratedIPost } from "@/app/model/Post"; // Use your corrected path
import { useConfirmationStore } from "@/store/confirmationstore";

interface PostActionsMenuProps {
  post: HydratedIPost;
  onEdit: () => void;
}

export const PostActionsMenu = ({ post, onEdit }: PostActionsMenuProps) => {
  const { data: session } = useSession();
  const confirm = useConfirmationStore((state) => state.show);

  // The component now always renders, but the content inside changes.
  const isOwner = session?.user?.id === post.author?._id;

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Post?',
      description: 'This can’t be undone and it will be removed from your timeline.',
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
  const handleReport = () => alert('Reporting post...');

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="absolute right-2 top-2 rounded-full p-1.5 text-neutral-500 hover:bg-sky-500/10 hover:text-sky-500 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          className="min-w-[240px] rounded-xl bg-black p-0 shadow-lg border border-neutral-800 z-10 overflow-hidden" 
          sideOffset={5} 
          align="end"
        >
          {/* --- CONDITIONAL MENU ITEMS --- */}
          {isOwner ? (
            // --- MENU FOR THE POST OWNER ---
            <>
              <DropdownMenu.Item
                onSelect={handleDelete}
                className="flex items-center gap-3 p-3 text-sm font-bold text-red-500 cursor-pointer rounded-none hover:bg-neutral-900 focus:outline-none"
              >
                <Trash2 size={18} /> Delete
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={onEdit}
                className="flex items-center gap-3 p-3 text-sm font-bold cursor-pointer rounded-none hover:bg-neutral-900 focus:outline-none"
              >
                <Edit size={18} /> Edit
              </DropdownMenu.Item>
            </>
          ) : (
            // --- MENU FOR OTHER USERS' POSTS ---
            <>
              <DropdownMenu.Item onSelect={handleFollow} className="flex items-center gap-3 p-3 text-sm cursor-pointer rounded-none hover:bg-neutral-900 focus:outline-none">
                <UserPlus size={18} /> Follow @{post.author.name}
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={handleMute} className="flex items-center gap-3 p-3 text-sm cursor-pointer rounded-none hover:bg-neutral-900 focus:outline-none">
                <VolumeX size={18} /> Mute @{post.author.name}
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={handleBlock} className="flex items-center gap-3 p-3 text-sm cursor-pointer rounded-none hover:bg-neutral-900 focus:outline-none">
                <CircleOff size={18} /> Block @{post.author.name}
              </DropdownMenu.Item>
            </>
          )}

          {/* --- COMMON MENU ITEMS --- */}
          <DropdownMenu.Separator className="h-[1px] bg-neutral-800" />
          <DropdownMenu.Item className="flex items-center gap-3 p-3 text-sm cursor-pointer rounded-none hover:bg-neutral-900 focus:outline-none">
            <BarChart2 size={18} /> View post activity
          </DropdownMenu.Item>
          <DropdownMenu.Item className="flex items-center gap-3 p-3 text-sm cursor-pointer rounded-none hover:bg-neutral-900 focus:outline-none">
            <Code size={18} /> Embed post
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-[1px] bg-neutral-800" />
          <DropdownMenu.Item onSelect={handleReport} className="flex items-center gap-3 p-3 text-sm cursor-pointer rounded-none hover:bg-neutral-900 focus:outline-none">
            <Flag size={18} /> Report post
          </DropdownMenu.Item>

        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};