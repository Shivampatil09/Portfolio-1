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
      ctx.fillStyle = "rgba(229, 169, 60, 0.9)";
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
          className="relative w-full max-w-4xl bg-[#14100E] border border-amber-500/25 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#352923] bg-[#1a1411]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#faf7f2] leading-tight">
                  {certification.title}
                </h3>
                <p className="text-xs font-mono text-amber-400 mt-0.5">
                  Issued by {certification.issuer} • {certification.issueDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300">
                <Lock className="w-3 h-3 text-amber-400" /> View-Only Protected
              </span>

              {certification.credentialUrl && (
                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#261d17] hover:bg-[#352923] border border-[#3d2e24] text-xs font-semibold text-amber-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Verify Credential</span>
                </a>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[#261d17] hover:bg-[#352923] text-[#a39687] hover:text-[#faf7f2] border border-[#3d2e24] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Certificate Content Viewer */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#0a0807] flex items-center justify-center relative select-none">
            {certification.certificateFileUrl ? (
              certification.fileType === "pdf" ? (
                <div className="w-full h-[65vh] relative rounded-2xl overflow-hidden border border-[#2d221c]">
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
                      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-mono text-[#a39687]">Rendering secure certificate canvas...</p>
                    </div>
                  )}

                  {loadError && (
                    <div className="py-16 text-center text-[#a39687] space-y-2">
                      <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                      <p className="text-sm font-semibold text-[#faf7f2]">Failed to load certificate preview</p>
                    </div>
                  )}

                  <canvas
                    ref={canvasRef}
                    className={`max-h-[68vh] w-auto max-w-full rounded-xl shadow-2xl border border-amber-500/20 pointer-events-none transition-opacity duration-300 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              )
            ) : (
              <div className="py-20 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-[#faf7f2]">Verified Credential</h4>
                <p className="text-xs text-[#a39687] max-w-md mx-auto">
                  {certification.description || "Completed official technical assessment and earned certified credential."}
                </p>
                {certification.credentialId && (
                  <p className="inline-block px-3 py-1 rounded-full bg-[#1c1511] border border-[#3d2e24] text-xs font-mono text-amber-400">
                    Credential ID: {certification.credentialId}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer Metadata */}
          <div className="px-6 py-3 border-t border-[#352923] bg-[#14100E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono text-[#a39687]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shivam Patil • .NET Full Stack Developer</span>
            </div>
            {certification.credentialId && (
              <span className="text-[#8A7866]">ID: {certification.credentialId}</span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
