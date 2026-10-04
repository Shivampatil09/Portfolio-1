import type { Metadata } from "next";
import {
  Mail,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { PageTransition } from "@/components/layout/PageTransition";
import { PublicBackground } from "@/components/layout/PublicBackground";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { getHeroProfile } from "@/lib/db";

export const metadata: Metadata = {
  title: "Work With Me & Contact | Shivam Patil - .NET Full Stack Developer",
  description:
    "Get in touch with Shivam Patil for .NET Full Stack roles, freelance development, enterprise software consulting, or internship opportunities.",
};

export const revalidate = 0;

export default async function ContactPage() {
  const profile = await getHeroProfile();
  const linkedinTarget = profile.linkedinUrl.startsWith("http")
    ? profile.linkedinUrl
    : `https://${profile.linkedinUrl}`;

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
                <MessageSquare className="w-3.5 h-3.5" /> Start a Conversation
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#f1eee8] tracking-tight">
                Work <span className="text-gradient-gold">With Me</span>
              </h1>
              <p className="text-base sm:text-lg text-[#c0b8ad] leading-relaxed">
                I am currently open to full-time .NET Full Stack Developer
                roles, software engineering internships, technical
                collaborations, and high-impact freelance projects.
              </p>
            </div>
          </MotionReveal>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Direct Info & Socials (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <MotionReveal delay={0.1} yOffset={20}>
                <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-300">
                  <h2 className="text-xl font-bold text-[#f1eee8]">
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    {profile.email && (
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30 shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs text-[#827a70] block font-mono">
                            Email
                          </span>
                          <a
                            href={`mailto:${profile.email}`}
                            className="text-sm font-semibold text-[#f1eee8] hover:text-[#edbb5f] transition-colors break-all"
                          >
                            {profile.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {profile.phone && (
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30 shrink-0">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs text-[#827a70] block font-mono">
                            Phone / WhatsApp
                          </span>
                          <a
                            href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                            className="text-sm font-semibold text-[#f1eee8] hover:text-[#edbb5f] transition-colors"
                          >
                            {profile.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {profile.location && (
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30 shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs text-[#827a70] block font-mono">
                            Location
                          </span>
                          <span className="text-sm font-semibold text-[#f1eee8]">
                            {profile.location}
                          </span>
                        </div>
                      </div>
                    )}

                    {profile.availabilityStatus && (
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30 shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs text-[#827a70] block font-mono">
                            Availability
                          </span>
                          <span className="text-sm font-semibold text-[#f1eee8]">
                            {profile.availabilityStatus}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Direct Social Links */}
                  <div className="pt-4 border-t border-[#2a2118] space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#edbb5f] font-bold">
                      Connect Directly
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {profile.githubUrl && (
                        <a
                          href={profile.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-[#14110f] border border-[#2a2118] text-xs font-semibold text-[#f1eee8] hover:border-[#edbb5f]/40 hover:text-[#edbb5f] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                        >
                          <GithubIcon className="w-4 h-4 text-[#edbb5f]" />
                          <span>GitHub Profile</span>
                        </a>
                      )}

                      {profile.linkedinUrl && (
                        <a
                          href={linkedinTarget}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-[#14110f] border border-[#2a2118] text-xs font-semibold text-[#f1eee8] hover:border-[#edbb5f]/40 hover:text-[#edbb5f] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                        >
                          <LinkedinIcon className="w-4 h-4 text-[#edbb5f]" />
                          <span>LinkedIn Profile</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Open to Work Highlights */}
                  <div className="pt-4 border-t border-[#2a2118] space-y-2 text-xs text-[#c0b8ad]">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
                      <CheckCircle2 className="w-4 h-4" /> Available for
                      Opportunities
                    </div>
                    <p>
                      {profile.headline} —{" "}
                      {profile.subHeadline || profile.summary}
                    </p>
                  </div>
                </div>
              </MotionReveal>
            </div>

            {/* Right Column: Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <MotionReveal delay={0.15} yOffset={20}>
                <ContactForm />
              </MotionReveal>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
