// src/components/CreatePost.tsx
"use client";

import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImageIcon, List, Smile, Calendar, MapPin, X } from 'lucide-react';
import clsx from 'clsx';
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Generate the correctly typed hook outside of your component
// This is the main fix for the errors you were seeing.
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const CreatePost = ({ parentPostId }: { parentPostId?: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize the useUploadThing hook with your endpoint name and callbacks
  const { startUpload, isUploading } = useUploadThing(
    "postImageUploader",
    {
      onClientUploadComplete: (res) => {
        if (res) {
          setImageUrl(res[0].url);
        }
      },
      onUploadError: (error: Error) => {
        alert(`Upload Error: ${error.message}`);
      },
    }
  );

  const handlePost = async () => {
    const isValidPost = content.trim() || imageUrl;
    if (!isValidPost || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const endpoint = parentPostId ? `/api/posts/${parentPostId}/comment` : '/api/posts';
      
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, imageUrl }),
      });

      setContent('');
      setImageUrl(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <div className="flex gap-4 border-b border-neutral-800 p-4">
      <Image
        src={session.user?.image || '/default-avatar.png'}
        alt="User avatar"
        width={40} height={40} className="h-10 w-10 rounded-full"
      />
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentPostId ? "Post your reply" : "What's happening?"}
          className="w-full resize-none bg-transparent text-xl placeholder-neutral-500 focus:outline-none"
          rows={2} maxLength={280}
        />

        {imageUrl && (
          <div className="relative mt-2">
            <Image src={imageUrl} alt="Uploaded preview" width={500} height={500} className="w-full h-auto rounded-xl"/>
            <button
              onClick={() => setImageUrl(null)}
              className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black"
            >
              <X size={18} />
            </button>
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => {
                if (e.target.files) {
                  startUpload(Array.from(e.target.files));
                }
              }} 
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || !!imageUrl}
              className="rounded-full p-2 text-sky-500 transition-colors duration-200 hover:bg-sky-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" /> : <ImageIcon size={20} />}
            </button>
            
            <button className="rounded-full p-2 text-sky-500 transition-colors duration-200 hover:bg-sky-500/10"><List size={20} /></button>
            <button className="rounded-full p-2 text-sky-500 transition-colors duration-200 hover:bg-sky-500/10"><Smile size={20} /></button>
            <button className="rounded-full p-2 text-sky-500 transition-colors duration-200 hover:bg-sky-500/10"><Calendar size={20} /></button>
            <button className="rounded-full p-2 text-sky-500 transition-colors duration-200 hover:bg-sky-500/10"><MapPin size={20} /></button>
          </div>
          
          <button
            onClick={handlePost}
            disabled={(!content.trim() && !imageUrl) || isSubmitting}
            className={clsx('rounded-full px-4 py-1.5 font-bold text-white transition-all duration-200',
              {
                'bg-sky-500 hover:bg-sky-600': (content.trim() || imageUrl) && !isSubmitting,
                'cursor-not-allowed bg-sky-900 text-neutral-500': (!content.trim() && !imageUrl) || isSubmitting,
              }
            )}
          >
            {isSubmitting ? '...' : (parentPostId ? 'Reply' : 'Post')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;