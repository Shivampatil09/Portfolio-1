"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { ExperienceItem } from "@/lib/db/initial-data";

export function ExperienceTimeline({
  experiences,
}: {
  experiences: ExperienceItem[];
}) {
  return (
    <div className="space-y-6">
      {experiences.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-6 sm:p-8 rounded-2xl relative overflow-hidden border border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 will-change-transform"
        >
          {/* Subtle gold highlight stripe on left */}
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#edbb5f]" />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
                    <Briefcase className="w-4 h-4" />
                  </span>
                  <h3 className="text-xl font-bold text-[#f1eee8]">
                    {item.role}
                  </h3>
                </div>
                <p className="text-base font-semibold text-[#edbb5f] mt-1 pl-9">
                  {item.company}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#827a70] pl-9 sm:pl-0">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14110f] border border-[#2a2118]">
                  <Calendar className="w-3.5 h-3.5 text-[#edbb5f]" />
                  {item.startDate} — {item.endDate}
                </span>
                {item.location && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14110f] border border-[#2a2118]">
                    <MapPin className="w-3.5 h-3.5 text-[#edbb5f]" />
                    {item.location}
                  </span>
                )}
              </div>
            </div>

            {/* Responsibilities list */}
            <div className="pt-2 pl-2 sm:pl-9 space-y-2.5">
              {item.responsibilities.map((resp, rIdx) => (
                <div key={rIdx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#edbb5f] mt-1 shrink-0" />
                  <p className="text-sm text-[#c0b8ad] leading-relaxed">
                    {resp}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
