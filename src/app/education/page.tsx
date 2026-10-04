import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  ArrowRight,
} from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { PublicBackground } from "@/components/layout/PublicBackground";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { EducationTimeline } from "@/components/sections/EducationTimeline";
import { getEducation } from "@/lib/db";

export const metadata: Metadata = {
  title: "Academic Timeline | Shivam Patil - .NET Full Stack Developer",
  description:
    "Academic timeline and educational milestones of Shivam Patil: Master of Computer Applications (MCA) and Bachelor of Computer Applications (BCA) at Savitribai Phule Pune University.",
};

export const revalidate = 0;

export default async function EducationPage() {
  const educations = await getEducation();

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
                <GraduationCap className="w-3.5 h-3.5" /> Academic Background
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#f1eee8] tracking-tight">
                Academic{" "}
                <span className="text-gradient-gold">Timeline</span>
              </h1>
              <p className="text-base sm:text-lg text-[#c0b8ad] leading-relaxed">
                Formal academic foundations in Computer Applications, software engineering
                principles, distributed systems, and core computer science theory.
              </p>
            </div>
          </MotionReveal>

          {/* Academic Timeline Section */}
          <section className="space-y-6">
            <EducationTimeline educations={educations} />
          </section>

          {/* Cross-Navigation Next Steps */}
          <MotionReveal delay={0.2} yOffset={20}>
            <div className="pt-8 border-t border-[#2a2118]/70">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#edbb5f] font-semibold mb-6">
                Explore More Background
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/certifications"
                  className="glass-card p-5 rounded-2xl border border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group block"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
                      <Award className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#827a70] group-hover:text-[#edbb5f] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="font-bold text-sm text-[#f1eee8] group-hover:text-[#edbb5f] transition-colors">
                    Certifications & Credentials
                  </h4>
                  <p className="text-xs text-[#827a70] mt-1">
                    Verified certificates & course achievements
                  </p>
                </Link>

                <Link
                  href="/experience"
                  className="glass-card p-5 rounded-2xl border border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group block"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#827a70] group-hover:text-[#edbb5f] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="font-bold text-sm text-[#f1eee8] group-hover:text-[#edbb5f] transition-colors">
                    Professional Experience
                  </h4>
                  <p className="text-xs text-[#827a70] mt-1">
                    Software training & technical leadership
                  </p>
                </Link>

                <Link
                  href="/resume"
                  className="glass-card p-5 rounded-2xl border border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group block"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
                      <FileText className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#827a70] group-hover:text-[#edbb5f] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="font-bold text-sm text-[#f1eee8] group-hover:text-[#edbb5f] transition-colors">
                    Interactive Resume
                  </h4>
                  <p className="text-xs text-[#827a70] mt-1">
                    Complete CV view & PDF download
                  </p>
                </Link>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </PageTransition>
  );
}
