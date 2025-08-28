// src/app/profile/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Import the UploadButton component and the router type
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "../api/uploadthing/core";

export default function ProfilePage() {
  // Get the user's session data and the special `update` function
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  
  // State to provide feedback to the user
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // If the session is loading, show a loading message
  if (!session) {
    return <div className="p-4">Loading session...</div>;
  }

  return (
    <div className="border-b border-neutral-800 p-4">
      <h1 className="text-xl font-bold">Edit Profile</h1>
      <p className="mb-6 text-neutral-500">
        Update your profile information and picture.
      </p>
      
      <div className="flex flex-col items-center gap-6">
        {/* Display current profile picture */}
        <div className="flex flex-col items-center gap-2">
            <p className="font-semibold text-neutral-400">Current Profile Picture</p>
            <Image 
                src={session.user?.image || '/default-avatar.png'}
                alt="Current profile picture"
                width={128}
                height={128}
                className="rounded-full border-4 border-neutral-700"
            />
        </div>

        {/* The UploadButton component */}
        <div className="flex flex-col items-center gap-2">
            <p className="font-semibold text-neutral-400">Upload a New Picture</p>
            <UploadButton<OurFileRouter>
              endpoint="profilePictureUploader"
              onClientUploadComplete={async (res) => {
                if (res && res.length > 0) {
                  const imageUrl = res[0].url;
                  setFeedbackMessage("Upload complete! Saving to profile...");

                  // 1. Call our API to save the new image URL in the database
                  const apiResponse = await fetch('/api/user/image', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ imageUrl }),
                  });

                  if (apiResponse.ok) {
                    // 2. IMPORTANT: Trigger a session update to refresh the UI
                    await updateSession({ image: imageUrl }); // Optimistically update
                    setFeedbackMessage("Profile updated successfully!");
                    router.refresh(); // Forces a server-side rerender to show the new image everywhere
                  } else {
                    setFeedbackMessage("Error: Failed to update profile.");
                  }
                }
              }}
              onUploadError={(error: Error) => {
                setFeedbackMessage(`Upload Error: ${error.message}`);
              }}
            />
        </div>
        
        {feedbackMessage && <p className="mt-4 text-center text-green-500">{feedbackMessage}</p>}
      </div>
    </div>
  );
}