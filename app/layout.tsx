// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Widgets from '@components/Widgets';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'X Clone',
  description: 'A modern X clone built with Next.js and TypeScript',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        {/* Main container to center the entire app */}
        <div className="container mx-auto flex min-h-screen max-w-7xl">
          {/* 1. Sidebar */}
          <Sidebar />

          {/* 2. Main Content Feed */}
          <main className="flex-1 border-x border-neutral-800">
            {/* The page content will be rendered here */}
            {children}
          </main>

          {/* 3. Widgets / Right-hand column (Optional but recommended for layout) */}
          <aside className="hidden w-[350px] p-4 lg:block">
            {/* You can add a "What's happening" or "Who to follow" component here later */}
            <div className="sticky top-0">
              <Widgets/>
                <h2 className="text-xl font-bold">What's happening</h2>
                {/* ... more widget content */}
            </div>
          </aside>
        </div>
      </body>
    </html>
  );
}