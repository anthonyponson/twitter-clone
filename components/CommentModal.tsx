// src/components/CommentModal.tsx
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { mutate } from 'swr';
import { HydratedIPost } from '@app/model/Post';

interface CommentModalProps {
  post: HydratedIPost;
  children: React.ReactNode; // The button that opens the modal
}

export const CommentModal = ({ post, children }: CommentModalProps) => {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    const res = await fetch(`/api/posts/${post._id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      setContent('');
      setOpen(false);
      mutate('/api/posts'); // Revalidate the feed to show the new comment count
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-lg bg-black p-4">
          <Dialog.Close className="absolute right-4 top-4"><X /></Dialog.Close>
          <div className="flex gap-4">
            <Image src={session?.user?.image || '/default-avatar.png'} alt="avatar" width={40} height={40} className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Replying to @${post.author.name}`}
                className="w-full bg-transparent focus:outline-none"
                rows={4}
              />
              <button onClick={handleSubmit} className="mt-2 rounded-full bg-sky-500 px-4 py-1.5 font-bold">Reply</button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};