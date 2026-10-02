"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { ExperienceItem } from "@/lib/db/initial-data";

export function ExperienceTimeline({ experiences }: { experiences: ExperienceItem[] }) {
  return (
    <div className="space-y-6">
      {experiences.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: idx * 0.1 }}
          className="glass-card p-6 sm:p-8 rounded-2xl relative overflow-hidden"
        >
          {/* Subtle amber highlight stripe on left */}
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700" />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Briefcase className="w-4 h-4" />
                  </span>
                  <h3 className="text-xl font-bold text-[#faf7f2]">{item.role}</h3>
                </div>
                <p className="text-base font-semibold text-amber-400 mt-1 pl-9">
                  {item.company}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#a39687] pl-9 sm:pl-0">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16120f] border border-[#352923]">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {item.startDate} — {item.endDate}
                </span>
                {item.location && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16120f] border border-[#352923]">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {item.location}
                  </span>
                )}
              </div>
            </div>

            {/* Responsibilities list */}
            <div className="pt-2 pl-2 sm:pl-9 space-y-2.5">
              {item.responsibilities.map((resp, rIdx) => (
                <div key={rIdx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                  <p className="text-sm text-[#b8ada0] leading-relaxed">{resp}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
