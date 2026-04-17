import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "../../lib/utils";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="h-full flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-[#0b1020]/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 animate-in">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className={cn("flex-1 overflow-y-auto px-4 lg:px-8 py-6 lg:py-8 bg-[color:var(--color-surface-alt)]")}>
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
