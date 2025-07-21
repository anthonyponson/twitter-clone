// src/components/Widgets.tsx

import SearchBar from './Search';

const Widgets = () => {
  return (
    <aside className="hidden w-[350px] flex-shrink-0 px-4 py-2 lg:block">
      {/* Sticky container for the search bar */}
      <div className="sticky top-0 z-10 bg-black py-1.5">
        <SearchBar />
      </div>

      {/* Placeholder for "Subscribe to Premium" */}
      <div className="my-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
        <h2 className="text-xl font-bold">Subscribe to Premium</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Subscribe to unlock new features and if eligible, receive a share of ads revenue.
        </p>
        <button className="mt-3 rounded-full bg-sky-500 px-4 py-1.5 font-bold text-white">
          Subscribe
        </button>
      </div>

      {/* Placeholder for "What's happening" */}
      <div className="my-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
        <h2 className="text-xl font-bold">What's happening</h2>
        <p className="mt-4 text-sm text-neutral-500">Placeholder for trends...</p>
        {/* You would map over trend data here */}
      </div>
    </aside>
  );
};

export default Widgets;