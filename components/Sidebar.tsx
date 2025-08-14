// src/components/Sidebar.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import * as Popover from '@radix-ui/react-popover';
import { MoreHorizontal, Pencil, X } from 'lucide-react';

// Import the data array from your centralized file
import { sidebarLinks } from './SidebarItems';
import SidebarLink from './SidebarLink';

const Sidebar = () => {
  // useSession is the core hook to get user data and auth status
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Handling the loading state prevents UI flicker.
  if (status === "loading") {
    return (
      <header className="flex-shrink-0 px-2 xl:w-[275px]">
        <div className="sticky top-0 h-screen animate-pulse bg-neutral-900" />
      </header>
    );
  }

  return (
    <header className="flex-shrink-0 px-2 xl:w-[275px]">
      <div className="sticky top-0 flex h-screen flex-col justify-between">
        
        {/* Top Section: Logo, Nav, Post Button */}
        <div className="flex flex-col items-center xl:items-start">
          <div className="mb-2 p-3">
            <Link href="/" aria-label="X Home" className="flex h-full w-full items-center justify-center rounded-full p-2 transition-colors duration-200 hover:bg-neutral-800">
              <X size={30} />
            </Link>
          </div>

          <nav className="flex flex-col items-center xl:items-start">
            {sidebarLinks.map((link) => {
              // Conditionally render links that require authentication
              if (link.auth && !session) {
                return null;
              }
              
              const isActive = pathname === link.href;
              return <SidebarLink key={link.title} {...link} isActive={isActive} />;
            })}
          </nav>

          {/* Show Post button ONLY if the user is logged in */}
          {session && (
            <button className="mt-4 w-14 rounded-full bg-sky-500 py-3.5 text-lg font-bold text-white transition-colors duration-200 hover:bg-sky-600 xl:w-full xl:max-w-[225px]">
              <span className="hidden xl:inline">Post</span>
              <span className="inline xl:hidden"><Pencil size={24} /></span>
            </button>
          )}
        </div>

        {/* Bottom Section: User Profile Popover (if logged in) or Sign In Button (if not) */}
        <div className="mb-2 w-full">
          {session ? (
            <Popover.Root>
              <Popover.Trigger asChild>
                {/* This is the element that opens the popover */}
                <div className="group w-full cursor-pointer rounded-full p-3 transition-colors duration-200 hover:bg-neutral-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={session.user?.image || '/default-avatar.png'}
                        alt={session.user?.name || 'User Avatar'}
                        width={40} height={40} className="rounded-full"
                      />
                      <div className="hidden xl:inline">
                        <p className="font-bold">{session.user?.name}</p>
                        <p className="text-sm text-neutral-500">@{session.user?.email?.split('@')[0]}</p>
                      </div>
                    </div>
                    <div className="hidden xl:inline"><MoreHorizontal size={20} /></div>
                  </div>
                </div>
              </Popover.Trigger>

              {/* This is the content of the popover */}
              <Popover.Portal>
                <Popover.Content 
                  side="top" 
                  align="start"
                  className="mb-3 w-72 origin-bottom-left animate-popover-in rounded-xl border border-neutral-800 bg-black p-0 shadow-lg"
                >
                  <div className="flex flex-col text-sm">
                    <a href="#" className="p-4 font-bold transition-colors hover:bg-neutral-900">Add an existing account</a>
                    <button 
                      onClick={() => signOut({ callbackUrl: '/login' })} 
                      className="p-4 text-left font-bold transition-colors hover:bg-neutral-900"
                    >
                      Log out @{session.user?.name}
                    </button>
                  </div>
                  <Popover.Arrow className="fill-neutral-800" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

          ) : (
            // If NOT AUTHENTICATED, show the SIGN IN button
            <button 
              onClick={() => signIn()} // Sign in on click
              className="w-full rounded-full bg-sky-500 py-3 text-lg font-bold text-white transition-colors duration-200 hover:bg-sky-600"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Sidebar;