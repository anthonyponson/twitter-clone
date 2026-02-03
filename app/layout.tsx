// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Sidebar from '@/components/Sidebar';
import Widgets from '@/components/Widgets';
import AuthProvider from '@/components/AuthProvider';
import { ConfirmationDialog } from '@/components/ConfirmationDialog'; // <-- IMPORT

const inter = Inter({ subsets: ['latin'] });

export const metadata = { /* ... */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>
          <div className="container mx-auto flex min-h-screen max-w-7xl">
            <Sidebar />
            <main className="w-full max-w-[600px] border-x border-neutral-800">
              {children}
            </main>
            <Widgets />
          </div>
          
          {/* Render the confirmation dialog here, outside the main layout */}
          <ConfirmationDialog />
        </AuthProvider>
      </body>
    </html>
  );
}