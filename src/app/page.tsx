import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Terminal,
  Database,
  Layers,
  FileText,
  Send,
} from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { HeroBackground } from "@/components/sections/HeroBackground";
import { SkillCard } from "@/components/sections/SkillCard";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { PageTransition } from "@/components/layout/PageTransition";
import { MotionReveal } from "@/components/ui/motion-reveal";
import {
  getHeroProfile,
  getSkills,
  getProjects,
  getAboutDetails,
} from "@/lib/db";

export const revalidate = 0; // Dynamic server-rendered

export default async function HomePage() {
  const [profile, allSkills, allProjects, about] = await Promise.all([
    getHeroProfile(),
    getSkills(),
    getProjects(),
    getAboutDetails(),
  ]);

  const featuredSkills = allSkills.filter((s) => s.isFeatured).slice(0, 8);
  const featuredProjects = allProjects.slice(0, 3);

  return (
    <PageTransition>
      <div className="relative min-h-screen">
        {/* Full-Viewport Motion Background (Falling Code + Mouse Spotlight) */}
        <HeroBackground />

        {/* Main Hero Section */}
        <HeroSection profile={profile} />

        {/* Core Value & Expertise Grid */}
        <section className="py-16 md:py-24 border-t border-[#2a2118]/70 bg-[#060605]/50 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionReveal delay={0.05} yOffset={20}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-3 border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/40 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#edbb5f]/15 border border-[#edbb5f]/30 flex items-center justify-center text-[#edbb5f]">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#f1eee8]">
                    Enterprise .NET Backends
                  </h3>
                  <p className="text-sm text-[#827a70] leading-relaxed">
                    High-throughput REST APIs built with ASP.NET Core Web API,
                    Entity Framework Core, SQL Server, and Clean Architecture
                    principles.
                  </p>
                </div>

                <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-3 border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/40 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#edbb5f]/15 border border-[#edbb5f]/30 flex items-center justify-center text-[#edbb5f]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#f1eee8]">
                    Modern React Frontends
                  </h3>
                  <p className="text-sm text-[#827a70] leading-relaxed">
                    Responsive, performant, and type-safe user interfaces built
                    with React, Next.js, TypeScript, Tailwind CSS, and state
                    management.
                  </p>
                </div>

                <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-3 border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/40 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#edbb5f]/15 border border-[#edbb5f]/30 flex items-center justify-center text-[#edbb5f]">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#f1eee8]">
                    Data & Scalable Storage
                  </h3>
                  <p className="text-sm text-[#827a70] leading-relaxed">
                    Optimized relational database design, query optimization,
                    indexing, and migrations with SQL Server and PostgreSQL.
                  </p>
                </div>
              </div>
            </MotionReveal>
          </div>
        </section>

        {/* Featured Projects Highlight */}
        <section className="py-20 md:py-28 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <MotionReveal delay={0.05} yOffset={20}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#edbb5f]/15 border border-[#edbb5f]/30 text-xs font-mono text-[#edbb5f]">
                    <Layers className="w-3.5 h-3.5" /> Featured Engineering Work
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1eee8] tracking-tight">
                    Selected <span className="text-gradient-gold">Projects</span>
                  </h2>
                  <p className="text-sm sm:text-base text-[#827a70] max-w-xl">
                    Enterprise-grade applications showcasing full-stack
                    capabilities, from database schemas to interactive
                    frontends.
                  </p>
                </div>

                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#edbb5f] hover:text-[#f1eee8] group transition-colors"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </MotionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Skills Highlight */}
        <section className="py-20 bg-[#060605]/60 border-t border-[#2a2118]/70 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <MotionReveal delay={0.05} yOffset={20}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#edbb5f]/15 border border-[#edbb5f]/30 text-xs font-mono text-[#edbb5f]">
                    <Terminal className="w-3.5 h-3.5" /> Technical Arsenal
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1eee8] tracking-tight">
                    Core <span className="text-gradient-gold">Technologies</span>
                  </h2>
                  <p className="text-sm sm:text-base text-[#827a70] max-w-xl">
                    Focusing on production-ready .NET backend ecosystems,
                    type-safe React, and scalable relational data storage.
                  </p>
                </div>

                <Link
                  href="/skills"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#edbb5f] hover:text-[#f1eee8] group transition-colors"
                >
                  <span>Explore Full Tech Stack</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </MotionReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {featuredSkills.map((skill, idx) => (
                <SkillCard key={skill.id} skill={skill} index={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* Work With Me / CTA Banner */}
        <section className="py-24 relative overflow-hidden z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionReveal delay={0.05} yOffset={20}>
              <div className="relative rounded-3xl bg-gradient-to-r from-[#14110f]/95 via-[#100d0b]/95 to-[#060605] border border-[#2a2118] p-8 sm:p-14 overflow-hidden shadow-2xl">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#edbb5f]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#edbb5f]/15 border border-[#edbb5f]/30 text-xs font-mono text-[#edbb5f]">
                    <Sparkles className="w-3.5 h-3.5" /> Ready for New
                    Opportunities
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1eee8] tracking-tight leading-tight">
                    Looking for a{" "}
                    <span className="text-gradient-gold">
                      .NET Full Stack Developer
                    </span>{" "}
                    for your team or project?
                  </h2>

                  <p className="text-sm sm:text-base text-[#c0b8ad] leading-relaxed">
                    Whether you need a dedicated software engineer for full-time
                    roles, internships, or high-impact freelance development,
                    let&apos;s connect.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-[#060605] bg-[#edbb5f] hover:bg-[#edbb5f]/90 shadow-[0_4px_20px_rgba(237,187,95,0.22)] hover:shadow-[0_6px_25px_rgba(237,187,95,0.35)] hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
                    >
                      <Send className="w-4 h-4 text-[#060605]" />
                      <span>Start a Conversation</span>
                    </Link>
                    <Link
                      href="/resume"
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-[#f1eee8] bg-[#14110f] border border-[#2a2118] hover:border-[#edbb5f]/40 hover:text-[#edbb5f] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
                    >
                      <FileText className="w-4 h-4 text-[#edbb5f]" />
                      <span>View Resume</span>
                    </Link>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
