"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Code2, Layers } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ProjectItem } from "@/lib/db/initial-data";

export function ProjectCard({
  project,
  index = 0,
}: {
  project: ProjectItem;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="glass-card group rounded-2xl overflow-hidden flex flex-col h-full border border-[#2a2118] hover:border-[#edbb5f]/40 transition-all duration-300"
    >
      {/* Project Banner / Preview */}
      <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-[#1c140e] via-[#120e0b] to-[#060605] border-b border-[#2a2118] overflow-hidden flex items-center justify-center">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#edbb5f]/15 border border-[#edbb5f]/30 flex items-center justify-center text-[#edbb5f] group-hover:scale-110 group-hover:border-[#edbb5f]/50 transition-all">
              <Code2 className="w-7 h-7 text-[#edbb5f]" />
            </div>
            <div>
              <span className="text-base font-bold text-[#f1eee8] group-hover:text-[#edbb5f] transition-colors">
                {project.title}
              </span>
              <p className="text-[11px] font-mono text-[#edbb5f] uppercase tracking-wider mt-0.5">
                {project.techStack && project.techStack.length > 0
                  ? project.techStack.slice(0, 3).join(" • ")
                  : "Full Stack Project"}
              </p>
            </div>
          </div>
        )}

        {/* Ambient glow in preview corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#edbb5f]/10 rounded-full blur-2xl group-hover:bg-[#edbb5f]/15 transition-all pointer-events-none" />

        {project.isFeatured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#060605e6] border border-[#edbb5f]/30 backdrop-blur-md flex items-center gap-1.5 text-[11px] font-mono text-[#edbb5f]">
            <Layers className="w-3.5 h-3.5" />
            <span>Featured Project</span>
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-[#f1eee8] group-hover:text-[#edbb5f] transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-[#827a70] leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-[#14110f] border border-[#2a2118] text-[#c0b8ad] group-hover:border-[#edbb5f]/30"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3 pt-3 border-t border-[#2a2118]">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#14110f] border border-[#2a2118] text-xs font-semibold text-[#f1eee8] hover:text-[#edbb5f] hover:border-[#edbb5f]/40 hover:bg-[#1c140e] transition-all"
              >
                <GithubIcon className="w-4 h-4 text-[#edbb5f]" />
                <span>Source Code</span>
              </a>
            )}

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#edbb5f]/15 border border-[#edbb5f]/40 text-xs font-semibold text-[#edbb5f] hover:bg-[#edbb5f]/25 hover:border-[#edbb5f]/60 transition-all"
              >
                <ExternalLink className="w-4 h-4 text-[#edbb5f]" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
