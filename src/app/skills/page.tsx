import type { Metadata } from "next";
import { Terminal, Sparkles, Database, Wrench, Award, CheckCircle2 } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { SkillCard } from "@/components/sections/SkillCard";
import { CertificationsList } from "@/components/sections/CertificationsList";
import { getSkills, getCertifications } from "@/lib/db";

export const metadata: Metadata = {
  title: "Skills & Tech Stack | Shivam Patil - .NET Full Stack Developer",
  description:
    "Comprehensive technical stack of Shivam Patil: C#, .NET 8, ASP.NET Core Web API, React, TypeScript, SQL Server, PostgreSQL, and Clean Architecture.",
};

export const revalidate = 0;

export default async function SkillsPage() {
  const [skills, certifications] = await Promise.all([
    getSkills(),
    getCertifications(),
  ]);

  const backendSkills = skills.filter((s) => s.category === "backend");
  const frontendSkills = skills.filter((s) => s.category === "frontend");
  const databaseSkills = skills.filter((s) => s.category === "database");
  const toolSkills = skills.filter((s) => s.category === "tools");

  return (
    <PageTransition>
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
            <Terminal className="w-3.5 h-3.5" /> Technical Competencies
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#faf7f2] tracking-tight">
            Skills & <span className="text-gradient-gold">Technology Stack</span>
          </h1>
          <p className="text-base sm:text-lg text-[#b8ada0] leading-relaxed">
            A production-proven technology stack anchored in enterprise Microsoft .NET backend engineering, type-safe modern React, and optimized relational database architecture.
          </p>
        </div>

        {/* 1. Backend & .NET Ecosystem (VISUALLY PRIMARY) */}
        <section className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#2a1e16] via-[#1c1410] to-[#120e0b] border-2 border-amber-500/30 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Terminal className="w-5 h-5" />
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#faf7f2]">
                    Backend & .NET Architecture
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#d4c8b8] max-w-xl">
                  Primary specialization: Scalable services, REST APIs, Object-Relational Mapping, and enterprise clean architecture.
                </p>
              </div>

              <span className="self-start md:self-auto px-3.5 py-1.5 rounded-full text-xs font-mono uppercase bg-amber-400 text-[#090807] font-bold tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                Core Specialization
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
              {backendSkills.map((skill, idx) => (
                <SkillCard key={skill.id} skill={skill} index={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* 2. Frontend Development */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#faf7f2]">Frontend & UI Engineering</h2>
              <p className="text-xs text-[#a39687]">Responsive, interactive, and type-safe user interfaces.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {frontendSkills.map((skill, idx) => (
              <SkillCard key={skill.id} skill={skill} index={idx} />
            ))}
          </div>
        </section>

        {/* 3. Database & Storage */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#faf7f2]">Databases & Data Management</h2>
              <p className="text-xs text-[#a39687]">Relational database modeling, query tuning, and migrations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {databaseSkills.map((skill, idx) => (
              <SkillCard key={skill.id} skill={skill} index={idx} />
            ))}
          </div>
        </section>

        {/* 4. Tools & Developer Workflow */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#faf7f2]">Tools, Testing & Workflow</h2>
              <p className="text-xs text-[#a39687]">Version control, API documentation, testing, and IDEs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {toolSkills.map((skill, idx) => (
              <SkillCard key={skill.id} skill={skill} index={idx} />
            ))}
          </div>
        </section>

        {/* 5. Certifications & Credentials */}
        <section className="space-y-6 pt-6 border-t border-[#261d18]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#faf7f2]">Certifications & Credentials</h2>
              <p className="text-xs text-[#a39687]">Verified technical milestones and course achievements.</p>
            </div>
          </div>

          <CertificationsList certifications={certifications} />
        </section>

      </div>
    </PageTransition>
  );
}
