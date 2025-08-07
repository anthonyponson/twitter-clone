// src/components/sidebarItems.ts

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
} from 'lucide-react';

// 1. Define the type for a single sidebar link
export interface SidebarLinkType {
  title: string;
  href: string;
  icon: LucideIcon;
  auth?: boolean; // Does this link require authentication?
}

// 2. Create and export the array of sidebar links
export const sidebarLinks: SidebarLinkType[] = [
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