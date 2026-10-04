import type { Metadata } from "next";
import { Mail, MessageSquare, MapPin, CheckCircle2, Clock } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { PageTransition } from "@/components/layout/PageTransition";
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
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
            <MessageSquare className="w-3.5 h-3.5" /> Start a Conversation
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#faf7f2] tracking-tight">
            Work <span className="text-gradient-gold">With Me</span>
          </h1>
          <p className="text-base sm:text-lg text-[#b8ada0] leading-relaxed">
            I am currently open to full-time .NET Full Stack Developer roles, software engineering internships, technical collaborations, and high-impact freelance projects.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Socials (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border-amber-500/20">
              <h2 className="text-xl font-bold text-[#faf7f2]">Contact Information</h2>

              <div className="space-y-4">
                {profile.email && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[#a39687] block font-mono">Email</span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-sm font-semibold text-[#faf7f2] hover:text-amber-300 transition-colors break-all"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {profile.phone && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[#a39687] block font-mono">Phone / WhatsApp</span>
                      <a
                        href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                        className="text-sm font-semibold text-[#faf7f2] hover:text-amber-300 transition-colors"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[#a39687] block font-mono">Location</span>
                      <span className="text-sm font-semibold text-[#faf7f2]">
                        {profile.location}
                      </span>
                    </div>
                  </div>
                )}

                {profile.availabilityStatus && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[#a39687] block font-mono">Availability</span>
                      <span className="text-sm font-semibold text-[#faf7f2]">
                        {profile.availabilityStatus}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Social Links */}
              <div className="pt-4 border-t border-[#352923] space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Connect Directly
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#14100e] border border-[#352923] text-xs font-semibold text-[#f6f2ec] hover:border-amber-500/40 hover:text-amber-300 transition-all"
                    >
                      <GithubIcon className="w-4 h-4 text-amber-400" />
                      <span>GitHub Profile</span>
                    </a>
                  )}

                  {profile.linkedinUrl && (
                    <a
                      href={linkedinTarget}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#14100e] border border-[#352923] text-xs font-semibold text-[#f6f2ec] hover:border-amber-500/40 hover:text-amber-300 transition-all"
                    >
                      <LinkedinIcon className="w-4 h-4 text-amber-400" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Open to Work Highlights */}
              <div className="pt-4 border-t border-[#352923] space-y-2 text-xs text-[#b8ada0]">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Available for Opportunities
                </div>
                <p>
                  {profile.headline} — {profile.subHeadline || profile.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

      </div>
    </PageTransition>
  );
}
