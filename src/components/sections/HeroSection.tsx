"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Terminal,
  Database,
  Layers,
  Sparkles,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { HeroProfile } from "@/lib/db/initial-data";

export function HeroSection({ profile }: { profile: HeroProfile }) {
  const linkedinTarget = profile.linkedinUrl.startsWith("http")
    ? profile.linkedinUrl
    : `https://${profile.linkedinUrl}`;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action Triggers (7 cols) */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1e1713]/90 border border-amber-500/30 shadow-inner backdrop-blur-md"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="text-xs font-mono font-medium text-amber-300 tracking-wide">
                {profile.availabilityStatus || "Available for .NET Full Stack & Software Roles"}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-[#faf7f2] leading-[1.08]">
                Hi, I&apos;m <span className="text-gradient-gold">{profile.fullName}</span>
              </h1>
              <div className="flex items-center gap-3 pt-1">
                <div className="h-1 w-10 bg-amber-500 rounded-full" />
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono tracking-tight">
                  {profile.headline}
                </h2>
              </div>
            </motion.div>

            {/* Sub-headline & Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-base sm:text-lg text-[#b8ada0] max-w-2xl leading-relaxed"
            >
              {profile.summary}
            </motion.p>

            {/* Key Tech Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="flex flex-wrap gap-2.5 pt-1"
            >
              {[
                { name: "C# .NET 8", icon: Cpu },
                { name: "ASP.NET Core Web API", icon: Terminal },
                { name: "React & TypeScript", icon: Sparkles },
                { name: "SQL Server & PostgreSQL", icon: Database },
                { name: "Clean Architecture", icon: Layers },
              ].map((pill, i) => {
                const Icon = pill.icon;
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono bg-[#191410] border border-[#3b2d24] text-[#cfc5b8] rounded-lg hover:border-amber-500/40 hover:text-amber-300 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                    {pill.name}
                  </span>
                );
              })}
            </motion.div>

            {/* Action Buttons: Work With Me, Resume, GitHub, LinkedIn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link
                href={profile.ctaLink || "/contact"}
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 text-base font-bold text-[#090807] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <span>{profile.primaryCtaText || "Work With Me"}</span>
                <ArrowRight className="w-5 h-5 text-[#090807] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#f6f2ec] bg-[#1a1410] border border-[#3d2e24] rounded-xl hover:border-amber-500/50 hover:bg-[#251c16] hover:text-amber-300 transition-all"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>View Resume</span>
              </Link>

              <div className="flex items-center gap-2">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#1a1410] border border-[#3d2e24] text-[#a39687] hover:text-amber-400 hover:border-amber-500/50 hover:bg-[#251c16] transition-all"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>

                <a
                  href={linkedinTarget}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#1a1410] border border-[#3d2e24] text-[#a39687] hover:text-amber-400 hover:border-amber-500/50 hover:bg-[#251c16] transition-all"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Prominent Profile Frame + Live Developer Visual (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-[400px]">
              {/* Outer decorative ambient glow ring */}
              <div className="absolute -inset-2 rounded-[28px] bg-gradient-to-tr from-amber-500/30 via-amber-700/20 to-amber-900/10 blur-xl opacity-75" />

              {/* Main Card Frame */}
              <div className="relative rounded-[24px] bg-gradient-to-b from-[#1f1814] to-[#120e0c] border border-amber-500/25 p-4 shadow-2xl overflow-hidden">
                
                {/* Top Terminal Bar */}
                <div className="flex items-center justify-between pb-3 px-2 border-b border-[#352923]/60 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-amber-400/70">
                    shivam.patil.dev
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    .NET 8
                  </span>
                </div>

                {/* Profile Photo or Developer Illustration */}
                <div className="relative aspect-[4/4.5] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a201a] to-[#140f0d] border border-amber-500/20 flex flex-col items-center justify-center group">
                  {profile.profileImageUrl ? (
                    <Image
                      src={profile.profileImageUrl}
                      alt={profile.fullName}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  ) : (
                    <div className="flex flex-col items-center text-center p-6 space-y-4">
                      {/* Avatar Placeholder */}
                      <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500/20 via-amber-600/30 to-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.25)]">
                        <span className="text-4xl font-extrabold text-amber-300 font-mono">
                          SP
                        </span>
                        <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#1a1410] flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-[#1a1410]" />
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-lg text-[#faf7f2]">Shivam Patil</p>
                        <p className="text-xs font-mono text-amber-400">Full Stack Engineer</p>
                      </div>
                      <div className="text-[11px] text-[#a39687] font-mono px-3 py-1.5 bg-[#14100e] border border-[#352923] rounded-lg">
                        Photo customizable via Admin Panel
                      </div>
                    </div>
                  )}

                  {/* Corner Accent Badge */}
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-[#0f0c0ad9] backdrop-blur-md border border-amber-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="font-medium text-[#f6f2ec]">C# • ASP.NET Core • React</span>
                    </div>
                    <span className="font-mono text-[10px] text-amber-400 font-semibold">
                      Enterprise Ready
                    </span>
                  </div>
                </div>

                {/* Bottom Quick Feature: SmartStationary highlight */}
                <div className="mt-4 p-3 rounded-xl bg-[#17120e] border border-[#352923] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#faf7f2]">SmartStationary</p>
                      <p className="text-[11px] text-[#8c7e70]">Featured Full-Stack Project</p>
                    </div>
                  </div>
                  <Link
                    href="/projects"
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
                  >
                    Explore <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
