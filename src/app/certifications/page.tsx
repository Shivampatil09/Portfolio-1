import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  Terminal,
  Briefcase,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { PublicBackground } from "@/components/layout/PublicBackground";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { CertificationsList } from "@/components/sections/CertificationsList";
import { getCertifications } from "@/lib/db";

export const metadata: Metadata = {
  title: "Certifications & Credentials | Shivam Patil - .NET Full Stack Developer",
  description:
    "Verified technical certifications and credentials earned by Shivam Patil across Full Stack Development, Java, SQL, and modern software engineering.",
};

export const revalidate = 0;

export default async function CertificationsPage() {
  const certifications = await getCertifications();

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
                <Award className="w-3.5 h-3.5" /> Verified Credentials
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#f1eee8] tracking-tight">
                Certifications &{" "}
                <span className="text-gradient-gold">Credentials</span>
              </h1>
              <p className="text-base sm:text-lg text-[#c0b8ad] leading-relaxed">
                Verified credentials, specialized software engineering certificates,
                and professional development milestones with view-only protection.
              </p>
            </div>
          </MotionReveal>

          {/* Security Notice Banner */}
          <MotionReveal delay={0.1} yOffset={20}>
            <div className="glass-card p-4 rounded-2xl border border-[#2a2118] flex items-center gap-3 text-xs text-[#827a70]">
              <div className="p-1.5 rounded-lg bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>
                All documents are cryptographically protected and watermarked for view-only verification.
              </span>
            </div>
          </MotionReveal>

          {/* Certifications Grid Section */}
          <section className="space-y-6">
            <CertificationsList certifications={certifications} />
          </section>

          {/* Cross-Navigation Next Steps */}
          <MotionReveal delay={0.2} yOffset={20}>
            <div className="pt-8 border-t border-[#2a2118]/70">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#edbb5f] font-semibold mb-6">
                Explore More Background
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/skills"
                  className="glass-card p-5 rounded-2xl border border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group block"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#827a70] group-hover:text-[#edbb5f] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="font-bold text-sm text-[#f1eee8] group-hover:text-[#edbb5f] transition-colors">
                    Technical Skills
                  </h4>
                  <p className="text-xs text-[#827a70] mt-1">
                    .NET 8, ASP.NET Core, React & SQL
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
                    Software training & mentorship history
                  </p>
                </Link>

                <Link
                  href="/education"
                  className="glass-card p-5 rounded-2xl border border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group block"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#827a70] group-hover:text-[#edbb5f] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="font-bold text-sm text-[#f1eee8] group-hover:text-[#edbb5f] transition-colors">
                    Academic Timeline
                  </h4>
                  <p className="text-xs text-[#827a70] mt-1">
                    MCA & BCA degree milestones at SPPU
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
