import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, User, Briefcase, GraduationCap, Code2, Sparkles, CheckCircle2 } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { EducationTimeline } from "@/components/sections/EducationTimeline";
import { getAboutDetails, getExperience, getEducation, getHeroProfile, getSkills } from "@/lib/db";

export const metadata: Metadata = {
  title: "About & Experience | Shivam Patil - .NET Full Stack Developer",
  description:
    "Learn more about Shivam Patil's background as a .NET Full Stack Developer, professional experience at CJC Pune, and MCA/BCA educational milestones.",
};

export const revalidate = 0;

export default async function AboutPage() {
  const [about, experiences, educations, profile, allSkills] = await Promise.all([
    getAboutDetails(),
    getExperience(),
    getEducation(),
    getHeroProfile(),
    getSkills(),
  ]);

  const featuredSkills = allSkills.filter((s) => s.isFeatured).slice(0, 4);

  return (
    <PageTransition>
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
            <User className="w-3.5 h-3.5" /> Developer Story & Background
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#faf7f2] tracking-tight">
            About <span className="text-gradient-gold">{profile.fullName}</span>
          </h1>
          <p className="text-base sm:text-lg text-[#b8ada0] leading-relaxed">
            {about.bioHighlight}
          </p>
        </div>

        {/* Narrative / Developer Story */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-5 border-amber-500/20">
              <h2 className="text-2xl font-bold text-[#faf7f2] flex items-center gap-2.5">
                <Code2 className="w-6 h-6 text-amber-400" />
                <span>My Journey in Software Engineering</span>
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#b8ada0] leading-relaxed">
                {about.storyParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {featuredSkills.length > 0 && (
                <div className="pt-4 border-t border-[#352923] grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featuredSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2.5 text-xs text-[#cfc5b8]">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card p-6 rounded-2xl border-amber-500/20 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                Quick Highlights
              </h3>
              
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#14100e] border border-[#352923]">
                  <span className="text-xs text-[#a39687] block">Primary Focus</span>
                  <span className="text-sm font-bold text-[#faf7f2]">{profile.headline}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#14100e] border border-[#352923]">
                  <span className="text-xs text-[#a39687] block">Experience & Projects</span>
                  <span className="text-sm font-bold text-[#faf7f2]">
                    {about.yearsOfExperience &&
                    about.yearsOfExperience !== "00" &&
                    about.yearsOfExperience !== "0"
                      ? about.yearsOfExperience
                      : "Fresher"}{" "}
                    • {about.projectsCompleted}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#14100e] border border-[#352923]">
                  <span className="text-xs text-[#a39687] block">Location</span>
                  <span className="text-sm font-bold text-[#faf7f2]">{profile.location}</span>
                </div>
              </div>

              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-xs font-bold text-[#090807] hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
              >
                <span>Let&apos;s Work Together</span>
                <ArrowRight className="w-4 h-4 text-[#090807]" />
              </Link>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="space-y-8 pt-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
              <Briefcase className="w-3.5 h-3.5" /> Professional History
            </div>
            <h2 className="text-3xl font-extrabold text-[#faf7f2]">
              Professional <span className="text-gradient-gold">Experience</span>
            </h2>
            <p className="text-sm text-[#a39687]">
              Hands-on administration, mentoring, and software training leadership.
            </p>
          </div>

          <ExperienceTimeline experiences={experiences} />
        </section>

        {/* Education Section */}
        <section className="space-y-8 pt-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
              <GraduationCap className="w-3.5 h-3.5" /> Academic Background
            </div>
            <h2 className="text-3xl font-extrabold text-[#faf7f2]">
              Academic <span className="text-gradient-gold">Timeline</span>
            </h2>
            <p className="text-sm text-[#a39687]">
              Post-graduate and undergraduate foundation in Computer Applications and Software Engineering.
            </p>
          </div>

          <EducationTimeline educations={educations} />
        </section>

      </div>
    </PageTransition>
  );
}
