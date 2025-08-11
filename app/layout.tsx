// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Widgets from '@/components/Widgets';
// Correct the import path to match where you created the file
import AuthProvider from '@components/AuthProvider'; 

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
          The AuthProvider MUST wrap the entire application layout.
          This makes the session context available to all child components.
        */}
        <AuthProvider>
          {/* Main container to center the entire app */}
          <div className="container mx-auto flex min-h-screen max-w-7xl">
            {/* 1. Sidebar */}
            <Sidebar />

            {/* 2. Main Content Feed */}
            <main className="w-full max-w-[600px] border-x border-neutral-800">
              {children}
            </main>

            {/* 3. Widgets Column */}
            <Widgets />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}