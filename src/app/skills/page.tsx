import type { Metadata } from "next";
import {
  Terminal,
  Sparkles,
  Database,
  Wrench,
} from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { PublicBackground } from "@/components/layout/PublicBackground";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SkillCard } from "@/components/sections/SkillCard";
import { getSkills } from "@/lib/db";

export const metadata: Metadata = {
  title: "Skills & Tech Stack | Shivam Patil - .NET Full Stack Developer",
  description:
    "Comprehensive technical stack of Shivam Patil: C#, .NET 8, ASP.NET Core Web API, React, TypeScript, SQL Server, PostgreSQL, and Clean Architecture.",
};

export const revalidate = 0;

export default async function SkillsPage() {
  const skills = await getSkills();

  const backendSkills = skills.filter((s) => s.category === "backend");
  const frontendSkills = skills.filter((s) => s.category === "frontend");
  const databaseSkills = skills.filter((s) => s.category === "database");
  const toolSkills = skills.filter((s) => s.category === "tools");

  return (
    <PageTransition>
      <div className="relative min-h-screen">
        {/* Full-Viewport Ambient Background */}
        <PublicBackground />

        <div className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Page Header */}
          <MotionReveal delay={0.05} yOffset={20}>
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#edbb5f]/15 border border-[#edbb5f]/30 text-xs font-mono text-[#edbb5f]">
                <Terminal className="w-3.5 h-3.5" /> Technical Competencies
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#f1eee8] tracking-tight">
                Skills &{" "}
                <span className="text-gradient-gold">Technology Stack</span>
              </h1>
              <p className="text-base sm:text-lg text-[#c0b8ad] leading-relaxed">
                A production-proven technology stack anchored in enterprise
                Microsoft .NET backend engineering, type-safe modern React, and
                optimized relational database architecture.
              </p>
            </div>
          </MotionReveal>

          {/* 1. Backend & .NET Ecosystem (VISUALLY PRIMARY) */}
          <section className="space-y-6">
            <MotionReveal delay={0.05} yOffset={20}>
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1c140e]/90 via-[#120e0b]/95 to-[#060605] border-2 border-[#edbb5f]/35 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#edbb5f]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2a2118]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
                        <Terminal className="w-5 h-5" />
                      </span>
                      <h2 className="text-2xl font-extrabold text-[#f1eee8]">
                        Backend & .NET Architecture
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-[#c0b8ad] max-w-xl">
                      Primary specialization: Scalable services, REST APIs,
                      Object-Relational Mapping, and enterprise clean
                      architecture.
                    </p>
                  </div>

                  <span className="self-start md:self-auto px-3.5 py-1.5 rounded-full text-xs font-mono uppercase bg-[#edbb5f] text-[#060605] font-bold tracking-wider shadow-[0_2px_12px_rgba(237,187,95,0.3)]">
                    Core Specialization
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
                  {backendSkills.map((skill, idx) => (
                    <SkillCard key={skill.id} skill={skill} index={idx} />
                  ))}
                </div>
              </div>
            </MotionReveal>
          </section>

          {/* 2. Frontend Development */}
          <section className="space-y-6">
            <MotionReveal delay={0.05} yOffset={20}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#f1eee8]">
                    Frontend & UI Engineering
                  </h2>
                  <p className="text-xs text-[#827a70]">
                    Responsive, interactive, and type-safe user interfaces.
                  </p>
                </div>
              </div>
            </MotionReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {frontendSkills.map((skill, idx) => (
                <SkillCard key={skill.id} skill={skill} index={idx} />
              ))}
            </div>
          </section>

          {/* 3. Database & Storage */}
          <section className="space-y-6">
            <MotionReveal delay={0.05} yOffset={20}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#f1eee8]">
                    Databases & Data Management
                  </h2>
                  <p className="text-xs text-[#827a70]">
                    Relational database modeling, query tuning, and migrations.
                  </p>
                </div>
              </div>
            </MotionReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {databaseSkills.map((skill, idx) => (
                <SkillCard key={skill.id} skill={skill} index={idx} />
              ))}
            </div>
          </section>

          {/* 4. Tools & Developer Workflow */}
          <section className="space-y-6">
            <MotionReveal delay={0.05} yOffset={20}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#f1eee8]">
                    Tools, Testing & Workflow
                  </h2>
                  <p className="text-xs text-[#827a70]">
                    Version control, API documentation, testing, and IDEs.
                  </p>
                </div>
              </div>
            </MotionReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {toolSkills.map((skill, idx) => (
                <SkillCard key={skill.id} skill={skill} index={idx} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
