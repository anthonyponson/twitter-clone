// src/components/Sidebar.tsx

import Link from 'next/link';
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
} from 'lucide-react';

// Define the type for a sidebar link
interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
}

// Data for the navigation links
const sidebarLinks: SidebarLink[] = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Explore', href: '/explore', icon: Search },
  { title: 'Notifications', href: '/notifications', icon: Bell },
  { title: 'Messages', href: '/messages', icon: Mail },
  { title: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { title: 'Communities', href: '/communities', icon: Users },
  { title: 'Profile', href: '/profile', icon: User },
];

const Sidebar = () => {
  return (
    <aside className="fixed flex h-screen flex-col justify-between border-r border-gray-700 bg-black p-2 text-white lg:w-64 lg:p-4">
      {/* Main Content: Logo, Nav, Tweet Button */}
      <div className="flex flex-col items-center space-y-2 lg:items-start">
        {/* Twitter Logo */}
        <Link
          href="/"
          className="mb-2 flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-800"
          aria-label="Twitter Home"
        >
          <X size={32} />
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="flex items-center gap-4 rounded-full p-3 transition-colors duration-200 hover:bg-gray-800"
            >
              <link.icon size={28} />
              <span className="hidden text-xl lg:inline">{link.title}</span>
            </Link>
          ))}
        </nav>

        {/* Tweet Button */}
        <button
          className="mt-4 w-14 rounded-full bg-sky-500 p-4 text-xl font-bold text-white transition-colors duration-200 hover:bg-sky-600 lg:w-full"
          aria-label="Tweet"
        >
          <span className="hidden lg:inline">Tweet</span>
          {/* Feather icon for mobile view could go here */}
          <span className="inline lg:hidden">+</span>
        </button>
      </div>

      {/* User Profile Section (Bottom) */}
      {/* In a real app, this would be dynamic data */}
      <div className="group flex cursor-pointer items-center justify-between rounded-full p-3 transition-colors duration-200 hover:bg-gray-800">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="h-10 w-10 rounded-full bg-gray-500">
            {/* In a real app, use next/image here */}
            {/* <Image src={user.avatarUrl} alt="User Avatar" width={40} height={40} className="rounded-full" /> */}
          </div>
          {/* User Info */}
          <div className="hidden lg:inline">
            <p className="font-bold">Your Name</p>
            <p className="text-sm text-gray-400">@yourhandle</p>
          </div>
        </div>
        {/* More Options Icon */}
        <div className="hidden lg:inline">
          <MoreHorizontal size={20} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;