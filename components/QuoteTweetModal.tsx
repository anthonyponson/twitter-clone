// src/components/QuoteTweetModal.tsx
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { mutate } from 'swr';
import { HydratedIPost } from '@app/model/Post';
import PostItem from './Postitem'; // We'll reuse this to show the embedded post

interface QuoteTweetModalProps {
  post: HydratedIPost;
  children: React.ReactNode; // The button that opens the modal
  onClose: () => void; // Function to close the parent dropdown
}

export const QuoteTweetModal = ({ post, children, onClose }: QuoteTweetModalProps) => {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    await fetch(`/api/posts/${post._id}/repost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    setOpen(false);
    onClose(); // Close the dropdown
    mutate('/api/posts'); // Refresh the feed
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black p-4">
          <Dialog.Close className="absolute right-4 top-4"><X /></Dialog.Close>
          <div className="flex gap-4">
            <Image src={session?.user?.image || '/default-avatar.png'} alt="avatar" width={40} height={40} className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Add a comment!" className="w-full bg-transparent focus:outline-none" rows={4}/>
              {/* Embedded Post */}
              <div className="mt-2 rounded-xl border border-neutral-800">
                <PostItem post={post} isEmbedded />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={handleSubmit} className="rounded-full bg-sky-500 px-4 py-1.5 font-bold">Post</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};