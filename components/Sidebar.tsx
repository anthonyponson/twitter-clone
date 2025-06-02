'use client'

import {
  HomeIcon,
  HashtagIcon,
  BellIcon,
  EnvelopeIcon,
  BookmarkIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import SidebarLogo from './SidebarLogo';

const Sidebar = () => {
  const navItems = [
    { name: 'Home', icon: HomeIcon, href: '/' },
    { name: 'Explore', icon: HashtagIcon, href: '/explore' },
    { name: 'Notifications', icon: BellIcon, href: '/notifications' },
    { name: 'Messages', icon: EnvelopeIcon, href: '/messages' },
    { name: 'Bookmarks', icon: BookmarkIcon, href: '/bookmarks' },
    { name: 'Profile', icon: UserIcon, href: '/profile' },
  ];

  return (
    <div className="col-span-1 flex flex-col items-start px-4 py-8 space-y-6">
      <SidebarLogo />
      {navItems.map(({ name, icon: Icon, href }) => (
        <Link
          key={name}
          href={href}
          className="flex items-center space-x-4 text-white hover:bg-gray-800 p-3 rounded-full w-full transition"
        >
          <Icon className="h-6 w-6" />
          <span className="hidden xl:inline text-lg font-semibold">{name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
