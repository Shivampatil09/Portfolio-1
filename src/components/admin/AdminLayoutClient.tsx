"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { Menu, Code2 } from "lucide-react";
import Link from "next/link";

interface AdminLayoutClientProps {
  username?: string;
  children: React.ReactNode;
}

export function AdminLayoutClient({
  username = "admin",
  children,
}: AdminLayoutClientProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // If on login page, render only the login container without sidebar or offset margins
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-[#090706] text-[#faf7f2] flex flex-col justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090706] text-[#faf7f2] flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        username={username}
        isOpenMobile={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Mobile Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#110d0b]/95 backdrop-blur-md border-b border-[#261c17] px-4 flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-[#1c1512] border border-[#352923] text-[#faf7f2] hover:text-amber-400 focus:outline-none cursor-pointer"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-[#faf7f2]">
              Portfolio CMS
            </span>
          </Link>

          <div className="w-9" /> {/* Spacer for balance */}
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
