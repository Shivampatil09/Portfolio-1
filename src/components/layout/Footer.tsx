import Link from "next/link";
import { Code2, Mail, Heart } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";

export function Footer({
  githubUrl = "https://github.com/Shivampatil09",
  linkedinUrl = "https://www.linkedin.com/in/shivampatil9",
}: {
  githubUrl?: string;
  linkedinUrl?: string;
}) {
  return (
    <footer className="border-t border-[#352923] bg-[#0c0908] relative overflow-hidden mt-24">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Identity */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-[#faf7f2] tracking-tight">Shivam Patil</span>
            </div>
            <p className="text-sm text-[#a39687] max-w-sm leading-relaxed">
              .NET Full Stack Developer building robust enterprise architectures, high-performance ASP.NET Core Web APIs, and intuitive, dynamic React web applications.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#17120e] border border-[#352923] text-[#a39687] hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={linkedinUrl.startsWith("http") ? linkedinUrl : `https://${linkedinUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#17120e] border border-[#352923] text-[#a39687] hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <Link
                href="/contact"
                className="p-2.5 rounded-xl bg-[#17120e] border border-[#352923] text-[#a39687] hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                aria-label="Contact"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400/90 font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#a39687]">
              <li>
                <Link href="/" className="hover:text-amber-300 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-300 transition-colors">About & Experience</Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-amber-300 transition-colors">Skills & Tech Stack</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-amber-300 transition-colors">Featured Projects</Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-amber-300 transition-colors">Interactive Resume</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-300 transition-colors">Work With Me</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Competencies */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400/90 font-semibold">
              Specialization
            </h4>
            <ul className="space-y-2 text-sm text-[#a39687]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                C# & .NET 8 / Core
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                ASP.NET Core Web API
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Entity Framework Core
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                React & TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Microsoft SQL Server
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#261d18] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7c7062]">
          <p>© {new Date().getFullYear()} Shivam Patil. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" /> for modern web
            </span>
            <Link href="/admin/login" className="text-[#a39687] hover:text-amber-400 transition-colors">
              Admin CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
