import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import {
  getProjects,
  getSkills,
  getCertifications,
  getEducation,
  getExperience,
  getContactMessages,
  getResume,
  isDatabaseConfigured,
} from "@/lib/db";
import {
  Layers,
  Terminal,
  Award,
  GraduationCap,
  Briefcase,
  Mail,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight,
  PlusCircle,
  Eye,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [projects, skills, certs, educations, experiences, messages, resume] =
    await Promise.all([
      getProjects(),
      getSkills(),
      getCertifications(),
      getEducation(),
      getExperience(),
      getContactMessages(),
      getResume(),
    ]);

  const unreadMessages = messages.filter((m) => !m.isRead).length;
  const isDbReady = isDatabaseConfigured();
  const hasResumePdf = Boolean(resume?.pdfUrl);

  const stats = [
    {
      title: "Projects",
      count: projects.length,
      icon: Layers,
      href: "/admin/projects",
      badge: "Portfolio Items",
      color: "text-amber-400",
    },
    {
      title: "Skills",
      count: skills.length,
      icon: Terminal,
      href: "/admin/skills",
      badge: "Tech Stack",
      color: "text-blue-400",
    },
    {
      title: "Certifications",
      count: certs.length,
      icon: Award,
      href: "/admin/certifications",
      badge: "Verified Creds",
      color: "text-emerald-400",
    },
    {
      title: "Education",
      count: educations.length,
      icon: GraduationCap,
      href: "/admin/education",
      badge: "Degrees",
      color: "text-purple-400",
    },
    {
      title: "Experience",
      count: experiences.length,
      icon: Briefcase,
      href: "/admin/experience",
      badge: "Career Roles",
      color: "text-cyan-400",
    },
    {
      title: "Inquiries",
      count: messages.length,
      icon: Mail,
      href: "/admin/messages",
      badge: unreadMessages > 0 ? `${unreadMessages} unread` : "All read",
      badgeAlert: unreadMessages > 0,
      color: "text-rose-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#261c17]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Content Management Center
          </div>
          <h1 className="text-3xl font-extrabold text-[#faf7f2] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs font-mono text-[#a39687] mt-1">
            Logged in as{" "}
            <span className="text-amber-400 font-semibold">
              {session.username}
            </span>{" "}
            • High-level portfolio metrics & shortcuts
          </p>
        </div>

        {/* Database Status Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#140f0d] border border-[#2d221c] text-xs font-mono self-start sm:self-auto">
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[#a39687]">Database:</span>
          {isDbReady ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Neon Cloud Active
            </span>
          ) : (
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Local / Fallback Mode
            </span>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="glass-card p-5 rounded-2xl border-amber-500/15 hover:border-amber-500/40 hover:-translate-y-0.5 transition-all group block space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#8f8072] uppercase font-semibold">
                  {stat.title}
                </span>
                <div className="p-2 rounded-lg bg-[#1a1310] border border-[#2d221c] group-hover:border-amber-500/30 transition-colors">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>

              <div>
                <p className="text-3xl font-extrabold text-[#faf7f2] tracking-tight">
                  {stat.count}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#261c17]">
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      stat.badgeAlert
                        ? "bg-rose-500/20 text-rose-300 font-bold"
                        : "bg-[#1f1713] text-[#a39687]"
                    }`}
                  >
                    {stat.badge}
                  </span>
                  <span className="text-xs text-amber-400 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Resume Status & Summary Card */}
      <div className="glass-card p-6 rounded-3xl border-amber-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#faf7f2]">
                Resume PDF Status
              </h2>
              <p className="text-xs font-mono text-[#a39687]">
                Live downloadable CV on the public portfolio
              </p>
            </div>
          </div>

          <Link
            href="/admin/resume"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1512] border border-[#3b2d24] text-xs font-semibold text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/40 transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>Manage Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#140f0d] border border-[#261c17] space-y-1">
            <span className="text-[11px] font-mono text-[#8f8072] uppercase block">
              Document State
            </span>
            <div className="flex items-center gap-2">
              {hasResumePdf ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-sm font-bold text-emerald-400">
                    Active & Downloadable
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-sm font-bold text-amber-400">
                    No PDF Uploaded
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#140f0d] border border-[#261c17] space-y-1">
            <span className="text-[11px] font-mono text-[#8f8072] uppercase block">
              Target Download Name
            </span>
            <span className="text-sm font-semibold text-[#faf7f2] truncate block">
              {resume?.displayFileName || "Shivam_Patil_Resume.pdf"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#140f0d] border border-[#261c17] space-y-1">
            <span className="text-[11px] font-mono text-[#8f8072] uppercase block">
              File Size
            </span>
            <span className="text-sm font-semibold text-[#faf7f2]">
              {resume?.fileSize
                ? `${(resume.fileSize / (1024 * 1024)).toFixed(2)} MB`
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Useful Quick-Action Shortcuts */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#faf7f2] flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Quick Actions</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/projects"
            className="p-4 rounded-2xl bg-[#140f0d] border border-[#261c17] hover:border-amber-500/30 hover:bg-[#1a1310] transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#faf7f2] group-hover:text-amber-300">
                Manage Projects
              </p>
              <p className="text-xs text-[#8f8072] mt-0.5">
                Add, edit, or reorder showcase projects
              </p>
            </div>
          </Link>

          <Link
            href="/admin/skills"
            className="p-4 rounded-2xl bg-[#140f0d] border border-[#261c17] hover:border-amber-500/30 hover:bg-[#1a1310] transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#faf7f2] group-hover:text-blue-300">
                Manage Skills
              </p>
              <p className="text-xs text-[#8f8072] mt-0.5">
                Update tech stack & proficiencies
              </p>
            </div>
          </Link>

          <Link
            href="/admin/certifications"
            className="p-4 rounded-2xl bg-[#140f0d] border border-[#261c17] hover:border-amber-500/30 hover:bg-[#1a1310] transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#faf7f2] group-hover:text-emerald-300">
                Upload Certificate
              </p>
              <p className="text-xs text-[#8f8072] mt-0.5">
                Attach credentials & verification PDFs
              </p>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="p-4 rounded-2xl bg-[#140f0d] border border-[#261c17] hover:border-amber-500/30 hover:bg-[#1a1310] transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#faf7f2] group-hover:text-purple-300 flex items-center gap-1">
                View Public Site ↗
              </p>
              <p className="text-xs text-[#8f8072] mt-0.5">
                Inspect live changes in new tab
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* System Status Summary */}
      <div className="p-5 rounded-2xl bg-[#110d0b] border border-[#261c17] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-[#8f8072]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Security: Active JWT Cookie Session</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>System Status: Healthy & Online</span>
        </div>
      </div>
    </div>
  );
}
