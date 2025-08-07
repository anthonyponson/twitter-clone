// src/components/Sidebar.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { MoreHorizontal, Pencil, X } from 'lucide-react';
import { sidebarLinks } from './SidebarItems'; // Import the shared array
import SidebarLink from './SidebarLink';
// =============================================

const Sidebar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // The local definition of `sidebarLinks` is now gone!

  if (status === "loading") {
    // ... loading state ...
  }

  return (
    <header className="flex-shrink-0 px-2 xl:w-[275px]">
      <div className="sticky top-0 flex h-screen flex-col justify-between">
        {/* Top Section */}
        <div className="flex flex-col items-center xl:items-start">
          <div className="mb-2 p-3">
            <Link href="/" aria-label="X Home">
              <X size={30} />
            </Link>
          </div>

          <nav>
            {/* This code now maps over the IMPORTED array. It's much cleaner. */}
            {sidebarLinks.map((link) => {
              if (link.auth && !session) return null;
              
              const isActive = pathname === link.href;
              return <SidebarLink key={link.title} {...link} isActive={isActive} />;
            })}
          </nav>

          {/* ... Post Button ... */}
        </div>
        
        {/* ... Bottom Section with user profile or sign-in ... */}
      </div>
    </header>
  );
};

export default Sidebar;