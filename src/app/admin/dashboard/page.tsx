import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getHeroProfile, getAboutDetails, getProjects, getSkills, getContactMessages, getCertifications, isDatabaseConfigured } from "@/lib/db";
import { ProfilePhotoManager } from "./ProfilePhotoManager";
import { ProfileContentEditor } from "./ProfileContentEditor";
import { Layers, Terminal, Mail, CheckCircle2, AlertCircle, Database, Award, FileText } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [profile, about, projects, skills, messages, certs] = await Promise.all([
    getHeroProfile(),
    getAboutDetails(),
    getProjects(),
    getSkills(),
    getContactMessages(),
    getCertifications(),
  ]);

  const unreadMessages = messages.filter((m) => !m.isRead).length;
  const isDbReady = isDatabaseConfigured();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#2d221c]">
        <div>
          <h1 className="text-3xl font-extrabold text-[#faf7f2]">Admin Dashboard</h1>
          <p className="text-xs font-mono text-[#a39687] mt-1">
            Logged in as <span className="text-amber-400 font-semibold">{session.username}</span>
          </p>
        </div>

        {/* Database Status Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17120e] border border-[#352923] text-xs font-mono">
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[#a39687]">Storage Mode:</span>
          {isDbReady ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Neon PostgreSQL
            </span>
          ) : (
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Local / Hybrid (Pending DB URL)
            </span>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-5 rounded-2xl border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-[#a39687]">
            <span className="text-xs font-mono uppercase">Projects</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-[#faf7f2]">{projects.length}</p>
          <a href="/admin/projects" className="text-[11px] text-amber-400 hover:text-amber-300 font-medium block">
            Manage Projects →
          </a>
        </div>

        <div className="glass-card p-5 rounded-2xl border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-[#a39687]">
            <span className="text-xs font-mono uppercase">Skills</span>
            <Terminal className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-[#faf7f2]">{skills.length}</p>
          <a href="/admin/skills" className="text-[11px] text-amber-400 hover:text-amber-300 font-medium block">
            Manage Skills →
          </a>
        </div>

        <div className="glass-card p-5 rounded-2xl border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-[#a39687]">
            <span className="text-xs font-mono uppercase">Certificates</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-[#faf7f2]">{certs.length}</p>
          <a href="/admin/certifications" className="text-[11px] text-amber-400 hover:text-amber-300 font-medium block underline">
            Upload & Edit →
          </a>
        </div>

        <div className="glass-card p-5 rounded-2xl border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-[#a39687]">
            <span className="text-xs font-mono uppercase">Inquiries</span>
            <Mail className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-[#faf7f2]">{messages.length}</p>
          <a href="/admin/messages" className="text-[11px] text-amber-400 font-mono block">
            {unreadMessages} unread messages →
          </a>
        </div>

        <div className="glass-card p-5 rounded-2xl border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-[#a39687]">
            <span className="text-xs font-mono uppercase">Resume PDF</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-sm font-bold text-[#faf7f2] truncate">Custom PDF</p>
          <a href="/admin/resume" className="text-[11px] text-amber-400 hover:text-amber-300 font-medium block underline">
            Manage & Upload →
          </a>
        </div>
      </div>

      {/* 1. Profile Photo Upload / Edit / Delete (Fulfills exact User prompt) */}
      <section>
        <ProfilePhotoManager initialPhotoUrl={profile.profileImageUrl} />
      </section>

      {/* 2. Hero & About Content Editor */}
      <section>
        <ProfileContentEditor initialProfile={profile} initialAbout={about} />
      </section>
    </div>
  );
}
