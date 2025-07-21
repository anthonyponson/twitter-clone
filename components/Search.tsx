// src/components/SearchBar.tsx
"use client";

import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to a search results page
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-neutral-500" />
        </div>
        <input
          type="text"
          name="search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-full border-none bg-neutral-800 py-2.5 pl-11 pr-4 text-white placeholder-neutral-500 transition-colors duration-200 focus:bg-black focus:outline-none focus:ring-2 focus:ring-sky-500"
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default SearchBar;