'use client'

import Link from 'next/link';

const SidebarLogo = () => {
  return (
    <Link href="/" className="hover:bg-blue-100 p-2 rounded-full transition">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-8 w-8 text-sky-500"
      >
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.43.36a9.06 9.06 0 01-2.88 1.1 4.52 4.52 0 00-7.72 4.12A12.94 12.94 0 013 2.16a4.48 4.48 0 001.4 6.06A4.41 4.41 0 012 7.14v.05a4.52 4.52 0 003.63 4.42 4.5 4.5 0 01-2.04.08 4.52 4.52 0 004.22 3.14A9.05 9.05 0 012 19.54a12.76 12.76 0 006.92 2.04c8.3 0 12.84-7.1 12.84-13.26 0-.2 0-.39-.01-.58A9.18 9.18 0 0023 3z" />
      </svg>
    </Link>
  );
};

export default SidebarLogo;
