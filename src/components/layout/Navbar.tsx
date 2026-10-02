"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Skills", href: "/skills" },
  { name: "Projects", href: "/projects" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
];

export function Navbar({
  githubUrl = "https://github.com/Shivampatil09",
  linkedinUrl = "https://www.linkedin.com/in/shivampatil9",
}: {
  githubUrl?: string;
  linkedinUrl?: string;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Don't render public navbar on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass-nav py-3.5 shadow-2xl shadow-black/40" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-foreground focus:outline-none"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-900/40 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400/60 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">
              <Code2 className="w-5 h-5 text-amber-400 transition-transform group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-lg text-warm-white group-hover:text-amber-300 transition-colors">
                Shivam Patil
              </span>
              <span className="text-[11px] font-mono text-amber-500/80 uppercase tracking-widest -mt-0.5">
                .NET Full Stack Dev
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#16120f]/80 border border-[#352923] p-1.5 rounded-full shadow-inner backdrop-blur-md">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    isActive
                      ? "text-amber-300 font-semibold"
                      : "text-[#a39687] hover:text-[#f6f2ec] hover:bg-white/[0.04]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-700/20 border border-amber-500/40 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Social Links & Primary CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#1a1410] border border-[#352923] text-[#a39687] hover:text-amber-400 hover:border-amber-500/40 hover:bg-[#241c18] transition-all"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <a
              href={linkedinUrl.startsWith("http") ? linkedinUrl : `https://${linkedinUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#1a1410] border border-[#352923] text-[#a39687] hover:text-amber-400 hover:border-amber-500/40 hover:bg-[#241c18] transition-all"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#090807] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#090807] transition-transform group-hover:rotate-12" />
              <span>Work With Me</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/contact"
              className="px-3.5 py-1.5 text-xs font-semibold text-[#090807] bg-amber-400 rounded-lg"
            >
              Hire Me
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#1a1410] border border-[#352923] text-[#f6f2ec] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav border-b border-amber-500/20 px-4 pt-2 pb-6"
          >
            <div className="flex flex-col gap-1.5 pt-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between transition-all",
                      isActive
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "text-[#a39687] hover:text-[#f6f2ec] hover:bg-white/[0.04]"
                    )}
                  >
                    <span>{item.name}</span>
                    {isActive && <span className="h-2 w-2 rounded-full bg-amber-400" />}
                  </Link>
                );
              })}

              <div className="flex items-center gap-3 pt-4 mt-2 border-t border-[#352923]">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a1410] border border-[#352923] text-sm text-[#f6f2ec]"
                >
                  <GithubIcon className="w-4 h-4 text-amber-400" />
                  <span>GitHub</span>
                </a>
                <a
                  href={linkedinUrl.startsWith("http") ? linkedinUrl : `https://${linkedinUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a1410] border border-[#352923] text-sm text-[#f6f2ec]"
                >
                  <LinkedinIcon className="w-4 h-4 text-amber-400" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
