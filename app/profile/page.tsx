// src/app/profile/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "../api/uploadthing/core";

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [feedbackMessage, setFeedbackMessage] = useState("");

  if (status === "loading") {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push('/login');
    return null;
  }
  
  return (
    <div className="border-b border-neutral-800 p-4">
      <h1 className="text-xl font-bold">Edit Profile</h1>
      <p className="mb-6 text-neutral-500">
        Update your profile information and picture.
      </p>
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
            <p className="font-semibold text-neutral-400">Current Profile Picture</p>
            <Image 
                src={session?.user?.image || '/default-avatar.png'}
                alt="Current profile picture"
                width={128}
                height={128}
                className="rounded-full border-4 border-neutral-700 object-cover"
            />
        </div>

        <div className="flex flex-col items-center gap-2">
            <p className="font-semibold text-neutral-400">Upload a New Picture</p>

            <UploadButton<OurFileRouter>
              
              endpoint="profilePictureUploader"
              onClientUploadComplete={async (res) => {
                if (res && res.length > 0) {
                  const imageUrl = res[0].url;
                  setFeedbackMessage("Upload complete! Saving...");

                  const apiResponse = await fetch('/api/user/image', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ imageUrl }),
                  });

                  if (apiResponse.ok) {
                    await updateSession(); 
                    setFeedbackMessage("Profile updated successfully!");
                  } else {
                    setFeedbackMessage("Error: Failed to update profile.");
                  }
                }
              }}
              onUploadError={(error: Error) => {
                // The error from the screenshot is "Failed to run middleware"
                // which is now fixed. We can show a generic error message.
                setFeedbackMessage(`Upload Error: ${error.message}`);
              }}
            />
        </div>
        
        {feedbackMessage && <p className="mt-4 text-center text-green-500">{feedbackMessage}</p>}
      </div>
    </div>
  );
}