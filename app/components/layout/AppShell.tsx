import TopBar from "@/components/layout/TopBar";
import SideNav from "@/components/layout/SideNav";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="flex min-h-screen">
        {/* Side navigation rail */}
        <aside className="hidden md:flex w-64 border-r border-neutral-800 bg-neutral-950/60">
          <div className="flex flex-col w-full px-4 py-6">
            <SideNav />
          </div>
        </aside>

        {/* Main column */}
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}


