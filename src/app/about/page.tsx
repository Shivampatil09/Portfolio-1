import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  User,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { PublicBackground } from "@/components/layout/PublicBackground";
import { MotionReveal } from "@/components/ui/motion-reveal";
import {
  getAboutDetails,
  getHeroProfile,
  getSkills,
} from "@/lib/db";

export const metadata: Metadata = {
  title: "About | Shivam Patil - .NET Full Stack Developer",
  description:
    "Learn more about Shivam Patil's background as a .NET Full Stack Developer, engineering philosophy, and problem-solving mindset.",
};

export const revalidate = 0;

export default async function AboutPage() {
  const [about, profile, allSkills] = await Promise.all([
    getAboutDetails(),
    getHeroProfile(),
    getSkills(),
  ]);

  const featuredSkills = allSkills.filter((s) => s.isFeatured).slice(0, 6);

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
                <User className="w-3.5 h-3.5" /> Developer Story & Background
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#f1eee8] tracking-tight">
                About{" "}
                <span className="text-gradient-gold">{profile.fullName}</span>
              </h1>
              <p className="text-base sm:text-lg text-[#c0b8ad] leading-relaxed">
                {about.bioHighlight}
              </p>
            </div>
          </MotionReveal>

          {/* Narrative / Developer Story */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-5">
              <MotionReveal delay={0.1} yOffset={20}>
                <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-300">
                  <h2 className="text-2xl font-bold text-[#f1eee8] flex items-center gap-2.5">
                    <Code2 className="w-6 h-6 text-[#edbb5f]" />
                    <span>My Journey in Software Engineering</span>
                  </h2>

                  <div className="space-y-4 text-sm sm:text-base text-[#c0b8ad] leading-relaxed">
                    {about.storyParagraphs.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>

                  {featuredSkills.length > 0 && (
                    <div className="pt-5 border-t border-[#2a2118] space-y-3">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-[#edbb5f] font-semibold">
                        Core Competency Highlights
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {featuredSkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center gap-2.5 text-xs text-[#c0b8ad]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#edbb5f] shrink-0" />
                            <span>{skill.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </MotionReveal>
            </div>

            {/* Quick Metrics Column */}
            <div className="lg:col-span-4 space-y-4">
              <MotionReveal delay={0.15} yOffset={20}>
                <div className="glass-card p-6 rounded-2xl border-[#2a2118] space-y-4 hover:border-[#edbb5f]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-300">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#edbb5f] font-bold">
                    Quick Highlights
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-[#14110f] border border-[#2a2118]">
                      <span className="text-xs text-[#827a70] block">
                        Primary Focus
                      </span>
                      <span className="text-sm font-bold text-[#f1eee8]">
                        {profile.headline}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#14110f] border border-[#2a2118]">
                      <span className="text-xs text-[#827a70] block">
                        Experience & Projects
                      </span>
                      <span className="text-sm font-bold text-[#f1eee8]">
                        {about.yearsOfExperience &&
                        about.yearsOfExperience !== "00" &&
                        about.yearsOfExperience !== "0"
                          ? about.yearsOfExperience
                          : "Fresher"}{" "}
                        • {about.projectsCompleted}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#14110f] border border-[#2a2118]">
                      <span className="text-xs text-[#827a70] block">
                        Location
                      </span>
                      <span className="text-sm font-bold text-[#f1eee8]">
                        {profile.location}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#edbb5f] hover:bg-[#edbb5f]/90 text-xs font-bold text-[#060605] hover:shadow-[0_4px_16px_rgba(237,187,95,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    <span>Let&apos;s Work Together</span>
                    <ArrowRight className="w-4 h-4 text-[#060605]" />
                  </Link>
                </div>
              </MotionReveal>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
