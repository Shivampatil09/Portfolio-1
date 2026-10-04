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

const transitionEase = [0.16, 1, 0.3, 1] as const;

export function HeroSection({ profile }: { profile: HeroProfile }) {
  const linkedinTarget = profile.linkedinUrl.startsWith("http")
    ? profile.linkedinUrl
    : `https://${profile.linkedinUrl}`;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Choreographed Headline & Action Triggers (7 cols) */}
          <div className="lg:col-span-7 space-y-7 text-left z-10">
            
            {/* 1. Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: transitionEase }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#14110f]/90 border border-[#edbb5f]/30 shadow-inner backdrop-blur-md transition-all hover:border-[#edbb5f]/50"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#edbb5f] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#edbb5f]" />
              </span>
              <span className="text-xs font-mono font-medium text-[#edbb5f] tracking-wide">
                {profile.availabilityStatus || "Available for .NET Full Stack & Software Roles"}
              </span>
            </motion.div>

            {/* 2. Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease: transitionEase }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-[#f1eee8] leading-[1.08]">
                Hi, I&apos;m <span className="text-gradient-gold">{profile.fullName}</span>
              </h1>
              <div className="flex items-center gap-3 pt-1">
                <div className="h-1 w-10 bg-[#edbb5f] rounded-full" />
                <h2 className="text-2xl sm:text-3xl font-bold text-[#edbb5f] font-mono tracking-tight">
                  {profile.headline}
                </h2>
              </div>
            </motion.div>

            {/* 3. Sub-headline & Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25, ease: transitionEase }}
              className="text-base sm:text-lg text-[#c0b8ad] max-w-2xl leading-relaxed"
            >
              {profile.summary}
            </motion.p>

            {/* 4. Key Tech Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35, ease: transitionEase }}
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-[#14110f] border border-[#2a2118] text-[#c0b8ad] rounded-lg hover:border-[#edbb5f]/40 hover:text-[#edbb5f] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#edbb5f]" />
                    {pill.name}
                  </span>
                );
              })}
            </motion.div>

            {/* 5. Action Buttons: Tactile Physics for CTAs & Socials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45, ease: transitionEase }}
              className="flex flex-wrap items-center gap-4 pt-3"
            >
              <Link
                href={profile.ctaLink || "/contact"}
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 text-base font-bold text-[#060605] bg-[#edbb5f] hover:bg-[#edbb5f]/90 rounded-xl shadow-[0_4px_20px_rgba(237,187,95,0.22)] hover:shadow-[0_6px_25px_rgba(237,187,95,0.35)] hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
              >
                <span>{profile.primaryCtaText || "Work With Me"}</span>
                <ArrowRight className="w-5 h-5 text-[#060605] group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#f1eee8] bg-[#14110f] border border-[#2a2118] rounded-xl hover:border-[#edbb5f]/40 hover:bg-[#1c140e] hover:text-[#edbb5f] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
              >
                <FileText className="w-4 h-4 text-[#edbb5f]" />
                <span>View Resume</span>
              </Link>

              <div className="flex items-center gap-2 pl-1">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#14110f] border border-[#2a2118] text-[#827a70] hover:text-[#edbb5f] hover:border-[#edbb5f]/40 hover:bg-[#1c140e] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>

                <a
                  href={linkedinTarget}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#14110f] border border-[#2a2118] text-[#827a70] hover:text-[#edbb5f] hover:border-[#edbb5f]/40 hover:bg-[#1c140e] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Arched Profile Frame + Overlapping Code Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.2, ease: transitionEase }}
            className="lg:col-span-5 flex justify-center z-10"
          >
            <div className="relative w-full max-w-[360px] sm:max-w-[400px] group">
              
              {/* Outer decorative ambient glow halo */}
              <div className="absolute -inset-4 rounded-t-full bg-gradient-to-b from-[#edbb5f]/20 via-[#38240a]/15 to-transparent blur-3xl -z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Arched Profile Container matching reference */}
              <div className="relative aspect-[4/5] w-full rounded-t-[160px] sm:rounded-t-[180px] rounded-b-[28px] overflow-hidden border-2 border-[#edbb5f]/30 bg-gradient-to-b from-[#1c140e] via-[#120e0b] to-[#060605] shadow-2xl transition-all duration-300 group-hover:border-[#edbb5f]/60">
                {profile.profileImageUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={profile.profileImageUrl}
                      alt={profile.fullName}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    {/* Bottom subtle gradient shadow for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060605] via-transparent to-transparent opacity-60" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
                    {/* Monogram / Avatar Container */}
                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#edbb5f]/20 via-[#edbb5f]/15 to-[#edbb5f]/20 border-2 border-[#edbb5f]/40 flex items-center justify-center shadow-[0_0_30px_rgba(237,187,95,0.2)]">
                      <span className="text-4xl font-extrabold text-[#edbb5f] font-mono">
                        SP
                      </span>
                      <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#060605] flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-[#060605]" />
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-xl text-[#f1eee8]">{profile.fullName}</p>
                      <p className="text-xs font-mono text-[#edbb5f]">{profile.headline}</p>
                    </div>
                    <div className="text-[11px] text-[#827a70] font-mono px-3.5 py-1.5 bg-[#14110f] border border-[#2a2118] rounded-lg">
                      Photo customizable via Admin Panel
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Top-Right Badge: Enterprise Ready */}
              <motion.div
                initial={{ opacity: 0, y: -15, x: 10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: transitionEase }}
                className="absolute -top-3 -right-3 sm:-right-5 px-3.5 py-2 rounded-xl bg-[#14110f]/95 border border-[#edbb5f]/30 shadow-xl backdrop-blur-md flex items-center gap-2 z-20"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-medium text-[#f1eee8]">Enterprise Ready</span>
              </motion.div>

              {/* Overlapping Floating C# Technical Code Snippet Card matching reference */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: -10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: transitionEase }}
                className="absolute -bottom-6 -left-4 sm:-left-8 p-3.5 sm:p-4 rounded-2xl bg-[#14110f]/95 border border-[#2a2118] shadow-2xl backdrop-blur-md text-xs font-mono z-20 max-w-[270px] sm:max-w-[310px] hover:border-[#edbb5f]/40 transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-[#2a2118]/80 text-[10px] text-[#827a70]">
                  <span className="w-2 h-2 rounded-full bg-red-500/80" />
                  <span className="w-2 h-2 rounded-full bg-[#edbb5f]/80" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[#edbb5f]">ShivamController.cs</span>
                </div>
                <div className="text-[#827a70] text-[11px]">[ApiController]</div>
                <div className="text-[#f1eee8] text-xs">
                  <span className="text-[#edbb5f]">class</span> Shivam : ControllerBase {"{"}
                </div>
                <div className="pl-3 text-[#c0b8ad] text-[11px]">
                  <span className="text-[#827a70]">string</span> stack = <span className="text-[#edbb5f]">&quot;.NET 8 + ASP.NET&quot;</span>;
                </div>
                <div className="pl-3 text-[#c0b8ad] text-[11px]">
                  <span className="text-[#827a70]">string</span> ui = <span className="text-[#edbb5f]">&quot;React + TypeScript&quot;</span>;
                </div>
                <div className="pl-3 text-[#c0b8ad] text-[11px]">
                  <span className="text-[#827a70]">string</span> db = <span className="text-[#edbb5f]">&quot;SQL Server + Postgres&quot;</span>;
                </div>
                <div className="text-[#f1eee8] text-xs">{"}"}</div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
