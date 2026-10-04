"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, ExternalLink, ShieldCheck, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { CertificationItem } from "@/lib/db/initial-data";

interface ProtectedCertificateModalProps {
  certification: CertificationItem | null;
  onClose: () => void;
}

export function ProtectedCertificateModal({
  certification,
  onClose,
}: ProtectedCertificateModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Security listeners: block Ctrl+S, Ctrl+P, right click, Esc to close
  useEffect(() => {
    if (!certification) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Block Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
      }
      // Block Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
      document.body.style.overflow = "auto";
    };
  }, [certification, onClose]);

  // Draw image on HTML5 Canvas with protective watermark
  useEffect(() => {
    if (!certification || !certification.certificateFileUrl || certification.fileType === "pdf") {
      return;
    }

    setImageLoaded(false);
    setLoadError(false);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = certification.certificateFileUrl;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas dimension based on image size
      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 850;

      // Draw original certificate
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw subtle security watermark banner across the bottom
      const barHeight = Math.max(36, Math.floor(canvas.height * 0.05));
      ctx.fillStyle = "rgba(10, 8, 7, 0.85)";
      ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);

      // Watermark Text
      ctx.fillStyle = "rgba(237, 187, 95, 0.85)";
      ctx.font = `bold ${Math.max(14, Math.floor(barHeight * 0.45))}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        `VERIFIED CREDENTIAL • SHIVAM PATIL • ${certification.issuer.toUpperCase()}`,
        canvas.width / 2,
        canvas.height - barHeight / 2
      );

      setImageLoaded(true);
    };

    img.onerror = () => {
      setLoadError(true);
    };
  }, [certification]);

  if (!certification) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.35 }}
          className="relative w-full max-w-4xl bg-[#120f0d] border border-[#edbb5f]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2118] bg-[#14110f]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#f1eee8] leading-tight">
                  {certification.title}
                </h3>
                <p className="text-xs font-mono text-[#edbb5f] mt-0.5">
                  Issued by {certification.issuer} • {certification.issueDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edbb5f]/15 border border-[#edbb5f]/30 text-[11px] font-mono text-[#edbb5f]">
                <Lock className="w-3 h-3 text-[#edbb5f]" /> View-Only Protected
              </span>

              {certification.credentialUrl && (
                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c140e] hover:bg-[#2a2118] border border-[#2a2118] text-xs font-semibold text-[#edbb5f] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Verify Credential</span>
                </a>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[#1c140e] hover:bg-[#2a2118] text-[#827a70] hover:text-[#f1eee8] border border-[#2a2118] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Certificate Content Viewer */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#060605] flex items-center justify-center relative select-none">
            {certification.certificateFileUrl ? (
              certification.fileType === "pdf" ? (
                <div className="w-full h-[65vh] relative rounded-2xl overflow-hidden border border-[#2a2118]">
                  {/* Top transparent protective shield over browser PDF toolbar */}
                  <div className="absolute top-0 inset-x-0 h-12 z-20 pointer-events-auto bg-transparent" />
                  <iframe
                    src={`${certification.certificateFileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full"
                    title={certification.title}
                  />
                </div>
              ) : (
                <div className="relative max-w-full flex items-center justify-center">
                  {!imageLoaded && !loadError && (
                    <div className="py-24 text-center space-y-2">
                      <div className="w-8 h-8 border-2 border-[#edbb5f] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-mono text-[#827a70]">Rendering secure certificate canvas...</p>
                    </div>
                  )}

                  {loadError && (
                    <div className="py-16 text-center text-[#827a70] space-y-2">
                      <AlertCircle className="w-8 h-8 text-[#edbb5f] mx-auto" />
                      <p className="text-sm font-semibold text-[#f1eee8]">Failed to load certificate preview</p>
                    </div>
                  )}

                  <canvas
                    ref={canvasRef}
                    className={`max-h-[68vh] w-auto max-w-full rounded-xl shadow-2xl border border-[#edbb5f]/30 pointer-events-none transition-opacity duration-300 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              )
            ) : (
              <div className="py-20 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-[#f1eee8]">Verified Credential</h4>
                <p className="text-xs text-[#827a70] max-w-md mx-auto">
                  {certification.description || "Completed official technical assessment and earned certified credential."}
                </p>
                {certification.credentialId && (
                  <p className="inline-block px-3 py-1 rounded-full bg-[#14110f] border border-[#2a2118] text-xs font-mono text-[#edbb5f]">
                    Credential ID: {certification.credentialId}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer Metadata */}
          <div className="px-6 py-3 border-t border-[#2a2118] bg-[#120f0d] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono text-[#827a70]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shivam Patil • .NET Full Stack Developer</span>
            </div>
            {certification.credentialId && (
              <span className="text-[#827a70]/80">ID: {certification.credentialId}</span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
