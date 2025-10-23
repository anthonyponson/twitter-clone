// src/components/HomeFeed.tsx
"use client"; // Keep this as a client component for the tabs

import { useState } from 'react';
import clsx from 'clsx';
import CreatePost from './CreatePost';
import PostFeed from './PostFeed'; // Import the PostFeed

type Tab = 'For you' | 'Following';

const HomeFeed = () => {
  const [activeTab, setActiveTab] = useState<Tab>('For you');

  return (
    <div>
      {/* Sticky Header with Tabs */}
      <div className="sticky top-0 z-10 border-b border-neutral-800 bg-black/80 backdrop-blur-md">
        <h2 className="p-4 text-xl font-bold">Home</h2>
        <div className="flex">
          {['For you', 'Following'].map((tabName) => (
            <button key={tabName} /* ... tab logic ... */>
              {/* ... tab content ... */}
            </button>
          ))}
        </div>
      </div>

      {/* Create Post Component */}
      <CreatePost />
      
      {/* Post Feed Component */}
      {/* Note: This is a Server Component being rendered inside a Client Component */}
      {/* Next.js handles this pattern gracefully. */}
      <PostFeed />
    </div>
  );
};

export default HomeFeed;