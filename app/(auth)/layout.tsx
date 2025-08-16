// src/app/(auth)/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is minimal, with no Sidebar or Widgets.
  // It applies only to pages inside the (auth) group, like /login and /register.
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      {children}
    </div>
  );
}