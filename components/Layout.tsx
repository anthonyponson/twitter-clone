import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      <div className="flex h-full max-w-6xl mx-auto">
        {/* Sidebar Column */}
        <div className="w-1/5 min-w-[64px] md:min-w-[88px] xl:min-w-[275px]">
          <Sidebar />
        </div>
        
        {/* Main Content Column */}
        <div className="flex-1 border-r border-gray-800">
          {children}
        </div>
        
        {/* Right Widgets Column (optional) */}
        <div className="hidden lg:block w-1/3 min-w-[250px] p-4">
          {/* Future right sidebar content */}
        </div>
      </div>
    </div>
  );
}