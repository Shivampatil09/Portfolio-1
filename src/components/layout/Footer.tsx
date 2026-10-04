"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Mail, Heart } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";

export function Footer({
  githubUrl = "https://github.com/Shivampatil09",
  linkedinUrl = "https://www.linkedin.com/in/shivampatil9",
}: {
  githubUrl?: string;
  linkedinUrl?: string;
}) {
  const pathname = usePathname();

  // Don't render public footer on any admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-[#2a2118] bg-[#060605] relative overflow-hidden mt-24">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#edbb5f]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Identity */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#edbb5f]/15 border border-[#edbb5f]/30 flex items-center justify-center text-[#edbb5f]">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-[#f1eee8] tracking-tight">Shivam Patil</span>
            </div>
            <p className="text-sm text-[#827a70] max-w-sm leading-relaxed">
              .NET Full Stack Developer building robust enterprise architectures, high-performance ASP.NET Core Web APIs, and intuitive, dynamic React web applications.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#14110f] border border-[#2a2118] text-[#827a70] hover:text-[#edbb5f] hover:border-[#edbb5f]/40 hover:bg-[#1c140e] transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={linkedinUrl.startsWith("http") ? linkedinUrl : `https://${linkedinUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#14110f] border border-[#2a2118] text-[#827a70] hover:text-[#edbb5f] hover:border-[#edbb5f]/40 hover:bg-[#1c140e] transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <Link
                href="/contact"
                className="p-2.5 rounded-xl bg-[#14110f] border border-[#2a2118] text-[#827a70] hover:text-[#edbb5f] hover:border-[#edbb5f]/40 hover:bg-[#1c140e] transition-colors"
                aria-label="Contact"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#edbb5f] font-semibold">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#827a70]">
              <li>
                <Link href="/" className="hover:text-[#edbb5f] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#edbb5f] transition-colors">About Me</Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-[#edbb5f] transition-colors">Experience</Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-[#edbb5f] transition-colors">Education</Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-[#edbb5f] transition-colors">Skills & Stack</Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-[#edbb5f] transition-colors">Certifications</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#edbb5f] transition-colors">Projects</Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-[#edbb5f] transition-colors">Resume</Link>
              </li>
              <li className="col-span-2">
                <Link href="/contact" className="hover:text-[#edbb5f] transition-colors">Work With Me</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Competencies */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#edbb5f] font-semibold">
              Specialization
            </h4>
            <ul className="space-y-2 text-sm text-[#827a70]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#edbb5f]" />
                C# & .NET 8 / Core
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#edbb5f]" />
                ASP.NET Core Web API
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#edbb5f]" />
                Entity Framework Core
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#edbb5f]" />
                React & TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#edbb5f]" />
                Microsoft SQL Server
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#1c140e] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#827a70]">
          <p>© {new Date().getFullYear()} Shivam Patil. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-[#edbb5f] fill-[#edbb5f] inline" /> for modern web
            </span>
            <Link href="/admin/login" className="text-[#827a70] hover:text-[#edbb5f] transition-colors">
              Admin CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
