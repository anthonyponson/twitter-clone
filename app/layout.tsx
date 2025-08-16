// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Import all necessary components
import Sidebar from '@/components/Sidebar';
import Widgets from '@/components/Widgets';
import AuthProvider from '@/components/AuthProvider';

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
        {/*
          The AuthProvider MUST wrap everything to make the session
          available globally to all components.
        */}
        <AuthProvider>
          {/*
            This main container centers the entire app on larger screens.
            It's a flex container for the three columns.
          */}
          <div className="container mx-auto flex min-h-screen max-w-7xl">
            
            {/* Column 1: The main Sidebar */}
            <Sidebar />

            {/*
              Column 2: The main content feed.
              'children' will be your home page (page.tsx) or other pages
              like /explore, /notifications, etc.
            */}
            <main className="w-full max-w-[600px] border-x border-neutral-800">
              {children}
            </main>

            {/* Column 3: The Widgets section on the right */}
            <Widgets />
            
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}