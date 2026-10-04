"use client";

import { motion } from "framer-motion";
import {
  Code,
  Terminal,
  Database,
  Layers,
  Sparkles,
  Cpu,
  Globe,
  Server,
  FileCode,
  Lock,
  GitBranch,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SkillItem } from "@/lib/db/initial-data";

const ICON_MAP: Record<string, typeof Code> = {
  csharp: Cpu,
  dotnet: Server,
  aspnet: Terminal,
  efcore: Database,
  rest: Globe,
  jwt: Lock,
  layers: Layers,
  react: Sparkles,
  typescript: FileCode,
  nextjs: Zap,
  javascript: Code,
  tailwind: Sparkles,
  palette: Sparkles,
  html5: Globe,
  state: Zap,
  sqlserver: Database,
  postgres: Database,
  database: Database,
  vs: Code,
  github: GitBranch,
  postman: Terminal,
  swagger: ShieldCheck,
};

export function SkillCard({ skill, index = 0 }: { skill: SkillItem; index?: number }) {
  const IconComponent = ICON_MAP[skill.icon] || Code;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="glass-card group p-4 rounded-2xl relative overflow-hidden border border-[#2a2118] hover:border-[#edbb5f]/40 transition-all duration-300"
    >
      {/* Background Accent glow on hover */}
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-[#edbb5f]/10 rounded-full blur-xl group-hover:bg-[#edbb5f]/15 transition-all duration-300" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#14110f] border border-[#2a2118] flex items-center justify-center text-[#edbb5f] group-hover:border-[#edbb5f]/40 group-hover:bg-[#edbb5f]/10 transition-all duration-300">
            <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#f1eee8] group-hover:text-[#edbb5f] transition-colors">
              {skill.name}
            </h4>
            <p className="text-[11px] font-mono text-[#827a70]">{skill.proficiencyLabel}</p>
          </div>
        </div>

        {skill.isFeatured && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
            Core
          </span>
        )}
      </div>
    </motion.div>
  );
}
