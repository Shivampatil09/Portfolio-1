import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { PublicBackground } from "@/components/layout/PublicBackground";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { getProjects } from "@/lib/db";

export const metadata: Metadata = {
  title: "Projects | Shivam Patil - .NET Full Stack Developer",
  description:
    "Explore enterprise web applications and .NET full-stack projects built by Shivam Patil, including SmartStationary, Clinic Hub, and FinTrack.",
};

export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <PageTransition>
      <div className="relative min-h-screen">
        {/* Full-Viewport Ambient Background */}
        <PublicBackground />

        <div className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Page Header */}
          <MotionReveal delay={0.05} yOffset={20}>
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#edbb5f]/15 border border-[#edbb5f]/30 text-xs font-mono text-[#edbb5f]">
                <Layers className="w-3.5 h-3.5" /> Selected Works
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#f1eee8] tracking-tight">
                Featured{" "}
                <span className="text-gradient-gold">Projects</span>
              </h1>
              <p className="text-base sm:text-lg text-[#c0b8ad] leading-relaxed">
                Real-world full-stack systems engineered with ASP.NET Core Web
                API, modern React, SQL Server, and Clean Architecture. Each
                project demonstrates end-to-end technical execution from
                database schema design to responsive UI.
              </p>
            </div>
          </MotionReveal>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
