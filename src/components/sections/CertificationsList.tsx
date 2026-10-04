"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Eye, ExternalLink } from "lucide-react";
import { CertificationItem } from "@/lib/db/initial-data";
import { ProtectedCertificateModal } from "./ProtectedCertificateModal";

export function CertificationsList({
  certifications,
}: {
  certifications: CertificationItem[];
}) {
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(
    null
  );

  if (!certifications || certifications.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-[#14110f] border border-[#2a2118] text-center space-y-2">
        <Award className="w-8 h-8 text-[#827a70] mx-auto opacity-70" />
        <p className="text-sm font-semibold text-[#f1eee8]">
          No certifications published yet
        </p>
        <p className="text-xs text-[#827a70] max-w-md mx-auto">
          Verified certificates added in the Admin Panel will appear here with
          view-only protection.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {certifications.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.45,
              delay: idx * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-[#2a2118] hover:border-[#edbb5f]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 group will-change-transform"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-[#edbb5f]/15 border border-[#edbb5f]/30 flex items-center justify-center text-[#edbb5f] group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-[#edbb5f] px-2.5 py-0.5 rounded-full bg-[#14110f] border border-[#2a2118]">
                  {cert.issueDate}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#f1eee8] leading-snug group-hover:text-[#edbb5f] transition-colors">
                  {cert.title}
                </h4>
                <p className="text-xs text-[#827a70] mt-0.5">{cert.issuer}</p>
              </div>

              {cert.credentialId && (
                <p className="text-[11px] font-mono text-[#827a70]/80">
                  ID: <span className="text-[#827a70]">{cert.credentialId}</span>
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#2a2118] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#edbb5f]/15 hover:bg-[#edbb5f]/25 text-[#edbb5f] hover:text-[#f1eee8] font-mono text-[11px] font-semibold border border-[#edbb5f]/30 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Certificate</span>
                </button>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-[#14110f] hover:bg-[#1c140e] text-[#827a70] hover:text-[#edbb5f] border border-[#2a2118] active:scale-[0.98] transition-all"
                    title="External Verification Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View-Only Protected Modal */}
      <ProtectedCertificateModal
        certification={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </>
  );
}
