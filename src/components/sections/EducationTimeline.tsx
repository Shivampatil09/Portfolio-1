"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { EducationItem } from "@/lib/db/initial-data";

export function EducationTimeline({ educations }: { educations: EducationItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {educations.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: idx * 0.1 }}
          className="glass-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full bg-[#16120f] border border-[#352923] text-amber-400">
                <Calendar className="w-3.5 h-3.5" />
                {item.startYear} — {item.endYear}
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#faf7f2] leading-snug">{item.degree}</h3>
            <p className="text-sm font-medium text-amber-300/90">{item.institution}</p>
            {item.description && (
              <p className="text-xs text-[#a39687] leading-relaxed pt-1">
                {item.description}
              </p>
            )}
          </div>

          {item.grade && (
            <div className="pt-3 border-t border-[#352923] flex items-center gap-2 text-xs font-mono text-[#b8ada0]">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Result: <strong className="text-[#faf7f2]">{item.grade}</strong></span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
