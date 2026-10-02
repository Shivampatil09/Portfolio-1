import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Code2, LayoutDashboard, Terminal, Layers, Mail, LogOut, ArrowLeft } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-[#090706] text-[#faf7f2] flex flex-col">
      {/* Admin Top Navigation */}
      <header className="border-b border-[#2d221c] bg-[#140f0d] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-xs font-mono text-[#a39687] hover:text-amber-300">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
            </Link>

            <div className="h-4 w-px bg-[#352923]" />

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-[#faf7f2]">
                Portfolio CMS <span className="text-[11px] font-mono text-amber-400 font-normal">| Shivam Patil</span>
              </span>
            </div>
          </div>

          {session && (
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#a39687] hover:text-[#faf7f2] hover:bg-[#1f1814]"
                >
                  Dashboard & Profile
                </Link>
                <Link
                  href="/admin/projects"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#a39687] hover:text-[#faf7f2] hover:bg-[#1f1814]"
                >
                  Projects
                </Link>
                <Link
                  href="/admin/skills"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#a39687] hover:text-[#faf7f2] hover:bg-[#1f1814]"
                >
                  Skills
                </Link>
                <Link
                  href="/admin/certifications"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#a39687] hover:text-[#faf7f2] hover:bg-[#1f1814]"
                >
                  Certifications
                </Link>
                <Link
                  href="/admin/resume"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#a39687] hover:text-[#faf7f2] hover:bg-[#1f1814]"
                >
                  Resume
                </Link>
                <Link
                  href="/admin/messages"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#a39687] hover:text-[#faf7f2] hover:bg-[#1f1814]"
                >
                  Inquiries
                </Link>
              </nav>

              <LogoutButton />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
