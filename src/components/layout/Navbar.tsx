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
  { name: "Experience", href: "/experience" },
  { name: "Education", href: "/education" },
  { name: "Projects", href: "/projects" },
  { name: "Certifications", href: "/certifications" },
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
        scrolled ? "glass-nav py-2.5 shadow-2xl shadow-black/60" : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-foreground focus:outline-none shrink-0"
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#edbb5f]/20 via-[#edbb5f]/10 to-[#1c140e] border border-[#edbb5f]/30 flex items-center justify-center text-[#edbb5f] group-hover:border-[#edbb5f]/70 group-hover:shadow-[0_0_15px_rgba(237,187,95,0.2)] transition-all">
              <Code2 className="w-5 h-5 text-[#edbb5f] transition-transform group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-base sm:text-lg text-[#f1eee8] group-hover:text-[#edbb5f] transition-colors">
                Shivam Patil
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-[#edbb5f] uppercase tracking-widest -mt-0.5">
                .NET Full Stack Dev
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-[#120f0d]/90 border border-[#2a2118] px-2 py-1 rounded-full shadow-lg backdrop-blur-md">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-2.5 xl:px-3 py-1.5 text-xs font-medium transition-all duration-200 whitespace-nowrap",
                    isActive
                      ? "text-[#f1eee8] font-semibold"
                      : "text-[#827a70] hover:text-[#f1eee8]"
                  )}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-underline"
                      className="absolute bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#edbb5f] to-transparent rounded-full shadow-[0_0_8px_rgba(237,187,95,0.5)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Social Links & Primary CTA */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[#14110f] border border-[#2a2118] text-[#827a70] hover:text-[#edbb5f] hover:border-[#edbb5f]/40 hover:bg-[#1c140e] transition-all"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>

            <a
              href={linkedinUrl.startsWith("http") ? linkedinUrl : `https://${linkedinUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[#14110f] border border-[#2a2118] text-[#827a70] hover:text-[#edbb5f] hover:border-[#edbb5f]/40 hover:bg-[#1c140e] transition-all"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#060605] bg-[#edbb5f] hover:bg-[#edbb5f]/90 rounded-xl hover:shadow-[0_0_20px_rgba(237,187,95,0.3)] hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#060605] transition-transform group-hover:rotate-12" />
              <span>Work With Me</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/contact"
              className="px-3 py-1.5 text-xs font-semibold text-[#060605] bg-[#edbb5f] rounded-lg"
            >
              Hire Me
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#14110f] border border-[#2a2118] text-[#f1eee8] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#edbb5f]" /> : <Menu className="w-5 h-5" />}
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
            className="lg:hidden glass-nav border-b border-[#2a2118] px-4 pt-2 pb-6"
          >
            <div className="flex flex-col gap-1 pt-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all",
                      isActive
                        ? "bg-[#edbb5f]/10 text-[#edbb5f] border border-[#edbb5f]/30"
                        : "text-[#827a70] hover:text-[#f1eee8] hover:bg-white/[0.03]"
                    )}
                  >
                    <span>{item.name}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#edbb5f]" />}
                  </Link>
                );
              })}

              <div className="flex items-center gap-3 pt-3 mt-2 border-t border-[#2a2118]">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#14110f] border border-[#2a2118] text-xs text-[#f1eee8]"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-[#edbb5f]" />
                  <span>GitHub</span>
                </a>
                <a
                  href={linkedinUrl.startsWith("http") ? linkedinUrl : `https://${linkedinUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#14110f] border border-[#2a2118] text-xs text-[#f1eee8]"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-[#edbb5f]" />
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
