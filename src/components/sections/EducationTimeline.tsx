"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { EducationItem } from "@/lib/db/initial-data";

export function EducationTimeline({
  educations,
}: {
  educations: EducationItem[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {educations.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-4 border border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 will-change-transform"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="p-2.5 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full bg-[#14110f] border border-[#2a2118] text-[#edbb5f]">
                <Calendar className="w-3.5 h-3.5" />
                {item.startYear} — {item.endYear}
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#f1eee8] leading-snug">
              {item.degree}
            </h3>
            <p className="text-sm font-medium text-[#edbb5f]">
              {item.institution}
            </p>
            {item.description && (
              <p className="text-xs text-[#827a70] leading-relaxed pt-1">
                {item.description}
              </p>
            )}
          </div>

          {item.grade && (
            <div className="pt-3 border-t border-[#2a2118] flex items-center gap-2 text-xs font-mono text-[#827a70]">
              <Award className="w-4 h-4 text-[#edbb5f]" />
              <span>
                Result: <strong className="text-[#f1eee8]">{item.grade}</strong>
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
