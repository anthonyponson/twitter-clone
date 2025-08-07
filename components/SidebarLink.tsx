// src/components/SidebarLink.tsx

import Link from 'next/link';
import clsx from 'clsx';
// No need to import LucideIcon here anymore, as the type is centralized.

// ============ THE KEY CHANGE IS HERE ============
import type { SidebarLinkType } from './SidebarItems'; // Import the shared type
// =============================================

// This interface now extends the shared type, which is robust
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
          className={clsx(isActive && 'fill-white')}
        />
        <span
          className={clsx(
            'hidden text-xl xl:inline',
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