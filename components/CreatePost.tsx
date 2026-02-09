// src/components/CreatePost.tsx
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import clsx from 'clsx';
import { UploadDropzone } from "@uploadthing/react"; // <-- Import Dropzone
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const CreatePost = ({ parentPostId }: { parentPostId?: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null); // State for the image URL
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    // A post is valid if it has content or an image
    const isValidPost = content.trim() || imageUrl;
    if (!isValidPost || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const endpoint = parentPostId ? `/api/posts/${parentPostId}/comment` : '/api/posts';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, imageUrl }), // Send both content and image URL
      });

      if (!response.ok) throw new Error('Failed to post');

      setContent('');
      setImageUrl(null); // Clear state on success
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

        {/* --- IMAGE UPLOAD AND PREVIEW --- */}
        {imageUrl ? (
          // If an image is uploaded, show a preview with a remove button
          <div className="relative mt-2">
            <Image src={imageUrl} alt="Uploaded preview" width={500} height={500} className="w-full h-auto rounded-xl"/>
            <button
              onClick={() => setImageUrl(null)}
              className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          // If no image, show the upload dropzone
          <div className="mt-2">
            <UploadDropzone<OurFileRouter>
              endpoint="postImageUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  setImageUrl(res[0].url); // Save the URL to state
                }
              }}
              onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
              config={{
                mode: "auto",
              }}
              appearance={{
                container: "border-neutral-800 border-dashed ut-uploading:pointer-events-none",
                label: "text-sky-500 hover:text-sky-600",
                uploadIcon: { color: "#888" },
              }}
            />
          </div>
        )}
        {/* --- END IMAGE UPLOAD AND PREVIEW --- */}
        
        <div className="mt-4 flex items-center justify-end">
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