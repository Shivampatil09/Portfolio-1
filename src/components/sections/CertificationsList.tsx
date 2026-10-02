"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Eye, ExternalLink, ShieldCheck } from "lucide-react";
import { CertificationItem } from "@/lib/db/initial-data";
import { ProtectedCertificateModal } from "./ProtectedCertificateModal";

export function CertificationsList({ certifications }: { certifications: CertificationItem[] }) {
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  if (!certifications || certifications.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-[#14100e] border border-[#2d221c] text-center space-y-2">
        <Award className="w-8 h-8 text-[#7c7062] mx-auto opacity-70" />
        <p className="text-sm font-semibold text-[#faf7f2]">No certifications published yet</p>
        <p className="text-xs text-[#7c7062] max-w-md mx-auto">
          Verified certificates added in the Admin Panel will appear here with view-only protection.
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
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-amber-400/90 px-2.5 py-0.5 rounded-full bg-[#14100e] border border-[#352923]">
                  {cert.issueDate}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#faf7f2] leading-snug group-hover:text-amber-300 transition-colors">
                  {cert.title}
                </h4>
                <p className="text-xs text-[#a39687] mt-0.5">{cert.issuer}</p>
              </div>

              {cert.credentialId && (
                <p className="text-[11px] font-mono text-[#7c7062]">
                  ID: <span className="text-[#a39687]">{cert.credentialId}</span>
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#352923] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 font-mono text-[11px] font-semibold border border-amber-500/20 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Certificate</span>
                </button>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-[#17120e] hover:bg-[#261d17] text-[#a39687] hover:text-amber-300 border border-[#352923] transition-colors"
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
