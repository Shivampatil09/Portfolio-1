import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { InteractiveResume } from "@/components/sections/InteractiveResume";
import { getHeroProfile, getExperience, getEducation, getSkills, getResume } from "@/lib/db";

export const metadata: Metadata = {
  title: "Resume | Shivam Patil - .NET Full Stack Developer",
  description:
    "Official resume of Shivam Patil — .NET Full Stack Developer with 2+ years experience in C#, ASP.NET Core Web API, React, and SQL Server.",
};

export const revalidate = 0;

export default async function ResumePage() {
  const [profile, experiences, educations, skills, resumeData] = await Promise.all([
    getHeroProfile(),
    getExperience(),
    getEducation(),
    getSkills(),
    getResume(),
  ]);

  return (
    <PageTransition>
      <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
            <FileText className="w-3.5 h-3.5" /> Professional Curriculum Vitae
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#faf7f2] tracking-tight">
            Interactive <span className="text-gradient-gold">Resume</span>
          </h1>
          <p className="text-sm sm:text-base text-[#b8ada0]">
            Review technical competencies, career history, education, and project contributions.
          </p>
        </div>

        {/* Interactive Resume View */}
        <InteractiveResume
          profile={profile}
          experiences={experiences}
          educations={educations}
          skills={skills}
          resumeData={resumeData}
        />

      </div>
    </PageTransition>
  );
}
