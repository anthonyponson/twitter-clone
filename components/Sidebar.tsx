// src/components/Sidebar.tsx
"use client"; // This must be a client component to use hooks

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  Home,
  Mail,
  MoreHorizontal,
  Search,
  User,
  Users,
  X,
  Bookmark,
  Sparkles,
  ShieldCheck,
  Pencil,
} from 'lucide-react';
import SidebarLink from './SidebarLink'; // We will create this next
import Image from 'next/image';

// Define the type for our navigation links
export interface SidebarLinkType {
  title: string;
  href: string;
  icon: LucideIcon;
  auth?: boolean; // Optional: show only if user is logged in
  active?: boolean; // Optional: specify custom active paths
}

// Data for the sidebar navigation
// The order and content now match your screenshot
const sidebarLinks: SidebarLinkType[] = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Explore', href: '/explore', icon: Search },
  { title: 'Notifications', href: '/notifications', icon: Bell, auth: true },
  { title: 'Messages', href: '/messages', icon: Mail, auth: true },
  { title: 'Grok', href: '/grok', icon: Sparkles, auth: true },
  { title: 'Bookmarks', href: '/bookmarks', icon: Bookmark, auth: true },
  { title: 'Communities', href: '/communities', icon: Users, auth: true },
  { title: 'Premium', href: '/premium', icon: X },
  { title: 'Verified Orgs', href: '/verified-orgs', icon: ShieldCheck },
  { title: 'Profile', href: '/profile', icon: User, auth: true },
  { title: 'More', href: '/more', icon: MoreHorizontal },
];

const Sidebar = () => {
  const pathname = usePathname();

  // In a real app, you'd get this from your auth context
  const isAuthenticated = true; 

  return (
    <aside className="fixed flex h-screen flex-col justify-between border-r border-neutral-800 bg-black p-2 text-white xl:w-[275px] xl:p-3">
      {/* Top Section: Logo, Nav, Post Button */}
      <div className="flex flex-col items-center xl:items-start">
        <div className="mb-2 p-3">
          <Link
            href="/"
            className="flex h-full w-full items-center justify-center rounded-full transition-colors duration-200 hover:bg-neutral-800"
            aria-label="X Home"
          >
            <X size={30} />
          </Link>
        </div>

        <nav className="flex flex-col items-center xl:items-start">
          {sidebarLinks.map((link) => {
            // Hide auth-required links if not logged in
            if (link.auth && !isAuthenticated) return null;
            
            const isActive = pathname === link.href;
            return <SidebarLink key={link.title} {...link} isActive={isActive} />;
          })}
        </nav>

        <button className="mt-4 w-full max-w-[225px] rounded-full bg-sky-500 py-3.5 text-lg font-bold text-white transition-colors duration-200 hover:bg-sky-600 xl:w-full">
            <span className="hidden xl:inline">Post</span>
            <span className="inline xl:hidden"><Pencil size={24} /></span>
        </button>
      </div>

      {/* Bottom Section: User Profile */}
      <div className="group mb-2 w-full cursor-pointer rounded-full p-3 transition-colors duration-200 hover:bg-neutral-800">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* User Avatar - Replace with next/image */}
                <Image 
                    src="/default-avatar.png" // Placeholder - put your avatar in /public
                    alt="Antony ponson"
                    width={40}
                    height={40}
                    className="rounded-full bg-neutral-600"
                />
                <div className="hidden xl:inline">
                    <p className="font-bold">Antony ponson</p>
                    <p className="text-sm text-neutral-500">@Antonyponson</p>
                </div>
            </div>
            <div className="hidden xl:inline">
                <MoreHorizontal size={20} />
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;