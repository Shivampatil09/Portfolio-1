"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Briefcase,
  GraduationCap,
  Terminal,
  Layers,
  Award,
  FileCode,
  Mail,
  Settings,
  ArrowLeft,
  X,
  Code2,
  LogOut,
  Shield,
} from "lucide-react";
import { LogoutButton } from "@/app/admin/LogoutButton";

interface SidebarGroup {
  label: string;
  items: {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }[];
}

const SIDEBAR_NAV: SidebarGroup[] = [
  {
    label: "OVERVIEW",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "CONTENT",
    items: [
      {
        title: "Profile",
        href: "/admin/profile",
        icon: User,
      },
      {
        title: "About",
        href: "/admin/about",
        icon: BookOpen,
      },
      {
        title: "Experience",
        href: "/admin/experience",
        icon: Briefcase,
      },
      {
        title: "Education",
        href: "/admin/education",
        icon: GraduationCap,
      },
      {
        title: "Skills",
        href: "/admin/skills",
        icon: Terminal,
      },
      {
        title: "Projects",
        href: "/admin/projects",
        icon: Layers,
      },
    ],
  },
  {
    label: "CREDENTIALS",
    items: [
      {
        title: "Certifications",
        href: "/admin/certifications",
        icon: Award,
      },
      {
        title: "Resume",
        href: "/admin/resume",
        icon: FileCode,
      },
    ],
  },
  {
    label: "COMMUNICATION",
    items: [
      {
        title: "Messages",
        href: "/admin/messages",
        icon: Mail,
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

interface AdminSidebarProps {
  username?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  username = "admin",
  isOpenMobile = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#110d0b] border-r border-[#261c17] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#261c17] flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5"
          >
            <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#faf7f2] block leading-tight">
                Portfolio CMS
              </span>
              <span className="text-[10px] font-mono text-amber-400 block">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-[#a39687] hover:text-[#faf7f2] hover:bg-[#1f1814] lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-amber-500/20">
          {SIDEBAR_NAV.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-3 text-[10px] font-mono font-bold tracking-wider text-[#736557] uppercase">
                {group.label}
              </p>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? "bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                          : "text-[#a39687] hover:text-[#faf7f2] hover:bg-[#1c1512] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? "text-amber-400"
                              : "text-[#807264] group-hover:text-amber-300"
                          }`}
                        />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/20 text-amber-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Area: Back to site, User details & Logout */}
        <div className="p-3 border-t border-[#261c17] space-y-2 bg-[#0d0908]">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-[#a39687] hover:text-amber-300 hover:bg-[#1a1310] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Back to Website</span>
          </Link>

          <div className="pt-2 border-t border-[#261c17] flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="truncate max-w-[90px]">
                <p className="text-xs font-semibold text-[#faf7f2] truncate">
                  {username}
                </p>
                <p className="text-[10px] font-mono text-[#736557]">Superadmin</p>
              </div>
            </div>

            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
