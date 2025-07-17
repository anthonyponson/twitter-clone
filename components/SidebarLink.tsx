// src/components/SidebarLink.tsx

import Link from 'next/link';
import { type SidebarLinkType } from './Sidebar'; // Import the type
import clsx from 'clsx';

interface SidebarLinkProps extends SidebarLinkType {
  isActive: boolean;
}

const SidebarLink = ({ title, href, icon: Icon, isActive }: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className="flex w-full items-center justify-center rounded-full p-3 transition-colors duration-200 hover:bg-neutral-800 xl:justify-start"
    >
      <div className="flex items-center gap-4">
        <Icon
          size={28}
          // The 'fill' trick for active icons
          className={clsx(isActive && 'fill-white')}
        />
        <span
          className={clsx(
            'hidden text-xl xl:inline',
            // The 'font-bold' for active text
            isActive && 'font-bold'
          )}
        >
          {title}
        </span>
      </div>
    </Link>
  );
};

export default SidebarLink;