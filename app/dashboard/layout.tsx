"use client";
import { useState } from "react";
import Sidebar from "@/components/grubdash/Sidebar";
import PersonaSwitcher from "@/components/PersonaSwitcher";
import MobileMenuContext from "./MobileMenuContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-slate-950">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="flex-1 flex flex-col min-w-0">
        <MobileMenuContext.Provider value={{ open: () => setMobileOpen(true) }}>
          {children}
        </MobileMenuContext.Provider>
      </main>
      <PersonaSwitcher />
    </div>
  );
}
