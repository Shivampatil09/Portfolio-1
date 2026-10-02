"use client";

import { useState, useRef } from "react";
import { ResumeDetails } from "@/lib/db/initial-data";
import { 
  FileText, 
  Upload, 
  Trash2, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Edit3, 
  Save, 
  X,
  FileCheck
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface ResumeManagerProps {
  initialResume: ResumeDetails;
}

export function ResumeManager({ initialResume }: ResumeManagerProps) {
  const [resume, setResume] = useState<ResumeDetails>(initialResume);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customName, setCustomName] = useState(initialResume.displayFileName || "Shivam_Patil_Resume.pdf");
  const [pageTitle, setPageTitle] = useState(initialResume.title || "Shivam Patil - .NET Full Stack Developer Resume");
  const [summary, setSummary] = useState(initialResume.summary || "");
  
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }
    setSelectedFile(file);
    if (!customName || customName === "Shivam_Patil_Resume.pdf") {
      setCustomName(file.name);
    }
    toast.success(`Selected file: ${file.name}`);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please choose a PDF file to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("displayFileName", customName.trim());
      formData.append("title", pageTitle.trim());
      formData.append("summary", summary.trim());

      const res = await fetch("/api/admin/resume", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Upload failed");
      }

      setResume(json.data);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Resume uploaded and published successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload resume.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete the active resume? Visitors will see a placeholder until a new one is uploaded.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/resume", {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Deletion failed");
      }

      setResume((prev) => ({
        ...prev,
        pdfUrl: null,
        originalFileName: null,
        fileSize: null,
      }));
      setSelectedFile(null);
      toast.success("Resume deleted successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete resume.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDetails(true);
    try {
      const res = await fetch("/api/admin/resume", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayFileName: customName.trim(),
          title: pageTitle.trim(),
          summary: summary.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update details");
      }

      setResume(json.data);
      setIsEditingDetails(false);
      toast.success("Resume settings updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update resume settings.");
    } finally {
      setIsSavingDetails(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A231C]">
        <div>
          <h1 className="text-2xl font-bold text-[#F5E8D8] flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#E5A93C]" />
            Resume Management
          </h1>
          <p className="text-sm text-[#B39F8A] mt-1">
            Upload your real PDF resume, configure custom download filenames, and manage what visitors download.
          </p>
        </div>
      </div>

      {/* Current Active Resume Status */}
      <div className="rounded-2xl bg-[#1A1410] border border-[#2A231C] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#F5E8D8] flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#E5A93C]" />
            Current Active Resume
          </h2>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              resume.pdfUrl
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {resume.pdfUrl ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active & Available
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                No Resume Uploaded
              </>
            )}
          </span>
        </div>

        {resume.pdfUrl ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#120D0A] p-4 rounded-xl border border-[#2A231C]/60 text-sm">
              <div>
                <span className="text-xs text-[#8A7866] block">Download Filename</span>
                <span className="font-mono text-[#F5E8D8] font-medium break-all">
                  {resume.displayFileName || "Shivam_Patil_Resume.pdf"}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#8A7866] block">Original Uploaded File</span>
                <span className="font-mono text-[#B39F8A] break-all">
                  {resume.originalFileName || "Uploaded PDF"}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#8A7866] block">File Size & Updated</span>
                <span className="text-[#B39F8A]" suppressHydrationWarning>
                  {formatFileSize(resume.fileSize)} • {formatDate(resume.updatedAt)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={resume.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2A2017] hover:bg-[#382B1F] text-[#F5E8D8] text-sm font-medium border border-[#3D3023] transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-[#E5A93C]" />
                Preview in Browser
              </a>

              <a
                href="/api/resume/download"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 text-[#E5A93C] text-sm font-medium border border-[#E5A93C]/30 transition-colors"
              >
                <Download className="w-4 h-4" />
                Test Download
              </a>

              <button
                type="button"
                onClick={() => setIsEditingDetails(!isEditingDetails)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F1813] hover:bg-[#2A2017] text-[#B39F8A] hover:text-[#F5E8D8] text-sm font-medium border border-[#2A231C] transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Download Name / Info
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium border border-red-500/20 transition-colors ml-auto disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Resume
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#120D0A] p-6 rounded-xl border border-dashed border-[#3D3023] text-center">
            <FileText className="w-10 h-10 text-[#8A7866] mx-auto mb-2 opacity-60" />
            <p className="text-[#F5E8D8] font-medium text-sm">No custom resume is currently uploaded</p>
            <p className="text-xs text-[#8A7866] mt-1 max-w-md mx-auto">
              Upload your official resume PDF below. Once uploaded, the download button on your public site will serve your file directly.
            </p>
          </div>
        )}

        {/* Edit Resume Details Modal / Accordion */}
        <AnimatePresence>
          {isEditingDetails && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSaveDetails}
              className="mt-6 pt-6 border-t border-[#2A231C] space-y-4"
            >
              <h3 className="text-sm font-semibold text-[#F5E8D8]">Edit Resume Display & Page Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#B39F8A] mb-1.5">
                    Custom Download File Name (.pdf)
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Shivam_Patil_Resume.pdf"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#120D0A] border border-[#2A231C] text-[#F5E8D8] text-sm focus:outline-none focus:border-[#E5A93C]"
                    required
                  />
                  <p className="text-[11px] text-[#8A7866] mt-1">
                    When visitors click "Download Resume", their browser will save the file with this name.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#B39F8A] mb-1.5">
                    Resume Page Heading
                  </label>
                  <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="Shivam Patil - .NET Full Stack Developer Resume"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#120D0A] border border-[#2A231C] text-[#F5E8D8] text-sm focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#B39F8A] mb-1.5">
                  Resume Summary / Description
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief note or summary displayed on the Resume page..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#120D0A] border border-[#2A231C] text-[#F5E8D8] text-sm focus:outline-none focus:border-[#E5A93C] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingDetails(false)}
                  className="px-4 py-2 rounded-lg bg-[#1A1410] hover:bg-[#2A2017] text-[#B39F8A] text-sm font-medium border border-[#2A231C] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDetails}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#E5A93C] hover:bg-[#D4982B] text-[#120D0A] text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isSavingDetails ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Details
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Upload New / Replace Form */}
      <div className="rounded-2xl bg-[#1A1410] border border-[#2A231C] p-6">
        <h2 className="text-lg font-semibold text-[#F5E8D8] flex items-center gap-2 mb-2">
          <Upload className="w-5 h-5 text-[#E5A93C]" />
          {resume.pdfUrl ? "Replace Resume PDF" : "Upload Resume PDF"}
        </h2>
        <p className="text-sm text-[#8A7866] mb-6">
          Select a PDF file from your computer (max 10MB). Uploading a new file will safely replace any previous resume.
        </p>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-[#E5A93C] bg-[#E5A93C]/5"
                : selectedFile
                ? "border-[#E5A93C]/60 bg-[#120D0A]"
                : "border-[#3D3023] hover:border-[#E5A93C]/40 bg-[#120D0A]/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#E5A93C]/10 text-[#E5A93C] flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-[#F5E8D8] font-mono">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-[#B39F8A]">
                  {formatFileSize(selectedFile.size)} • Ready to upload
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mt-2"
                >
                  <X className="w-3.5 h-3.5" /> Remove selected file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#2A2017] text-[#E5A93C] flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-[#F5E8D8]">
                  Click to browse or drag & drop your PDF resume here
                </p>
                <p className="text-xs text-[#8A7866]">
                  Supports PDF files up to 10MB
                </p>
              </div>
            )}
          </div>

          {/* Custom Name & Details fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#B39F8A] mb-1.5">
                Download Filename for Visitors (.pdf)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Shivam_Patil_Resume.pdf"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#120D0A] border border-[#2A231C] text-[#F5E8D8] text-sm focus:outline-none focus:border-[#E5A93C]"
              />
              <p className="text-[11px] text-[#8A7866] mt-1">
                Customize how the file is named when recruiters click download.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#B39F8A] mb-1.5">
                Resume Title
              </label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="Shivam Patil - .NET Full Stack Developer Resume"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#120D0A] border border-[#2A231C] text-[#F5E8D8] text-sm focus:outline-none focus:border-[#E5A93C]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A231C]">
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#C48924] hover:from-[#D4982B] hover:to-[#B3781A] text-[#120D0A] text-sm font-semibold transition-all shadow-lg shadow-[#E5A93C]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Uploading Resume...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload & Publish Resume
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
