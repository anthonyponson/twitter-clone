import "./globals.css";
import { ReactNode } from "react";
import dynamic from "next/dynamic";

// Lazy-load Sidebar to split the bundle
const Sidebar = dynamic(() => import("../components/Sidebar"), {
  ssr: false,
});

export const metadata = {
  title: "BirdFeed – A Next.js Twitter Clone",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-950 text-white font-sans antialiased">
        {/* Sidebar on desktop; you can later wire up a mobile drawer here */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl">{children}</div>
          <div className="fixed inset-x-0 bottom-0 border-t border-gray-700">
            car4d
             </div>
        </main>
      </body>
    </html>
  );
}
