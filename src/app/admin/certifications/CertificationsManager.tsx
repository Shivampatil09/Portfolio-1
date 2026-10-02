"use client";

import { useState, useRef } from "react";
import { CertificationItem } from "@/lib/db/initial-data";
import {
  Award,
  Plus,
  Trash2,
  Edit3,
  Upload,
  ExternalLink,
  ShieldCheck,
  Code,
  FileCheck,
  RefreshCw,
  X,
  Eye,
  FileText,
  CheckCircle2,
  AlertCircle,
  Save,
  FileImage,
} from "lucide-react";
import { toast } from "sonner";
import {
  addCertificationAction,
  updateCertificationAction,
  deleteCertificationAction,
} from "@/actions/admin";

interface CertificationsManagerProps {
  initialCertifications: CertificationItem[];
}

export function CertificationsManager({ initialCertifications }: CertificationsManagerProps) {
  const [certifications, setCertifications] = useState<CertificationItem[]>(initialCertifications);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCert, setEditingCert] = useState<Partial<CertificationItem> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [previewCert, setPreviewCert] = useState<CertificationItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open add form
  const handleAddNew = () => {
    setEditingCert({
      title: "",
      issuer: "",
      issueDate: new Date().getFullYear().toString(),
      credentialId: "",
      credentialUrl: "",
      certificateFileUrl: null,
      fileType: "image",
      description: "",
      badgeIcon: "award",
      orderIndex: certifications.length + 1,
    });
    setIsEditing(true);
  };

  // Open edit form
  const handleEdit = (cert: CertificationItem) => {
    setEditingCert({ ...cert });
    setIsEditing(true);
  };

  // Handle certificate file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setIsUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (editingCert?.certificateFileUrl) {
        formData.append("oldFileUrl", editingCert.certificateFileUrl);
      }

      const res = await fetch("/api/admin/certifications/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to upload file");
      }

      setEditingCert((prev) => ({
        ...prev,
        certificateFileUrl: json.fileUrl,
        fileType: json.fileType,
      }));

      toast.success(`Uploaded: ${file.name}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file");
    } finally {
      setIsUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Remove uploaded file from editing state
  const handleRemoveFile = () => {
    setEditingCert((prev) => ({
      ...prev,
      certificateFileUrl: null,
      fileType: null,
    }));
  };

  // Submit Add or Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert?.title?.trim() || !editingCert?.issuer?.trim() || !editingCert?.issueDate?.trim()) {
      toast.error("Please fill in Title, Issuer, and Issue Date.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCert.id) {
        // Update
        const res = await updateCertificationAction(editingCert.id, {
          title: editingCert.title.trim(),
          issuer: editingCert.issuer.trim(),
          issueDate: editingCert.issueDate.trim(),
          credentialId: editingCert.credentialId?.trim() || undefined,
          credentialUrl: editingCert.credentialUrl?.trim() || undefined,
          certificateFileUrl: editingCert.certificateFileUrl || null,
          fileType: editingCert.fileType || "image",
          description: editingCert.description?.trim() || undefined,
          badgeIcon: editingCert.badgeIcon || "award",
          orderIndex: Number(editingCert.orderIndex) || 0,
        });

        if (!res.success || !res.data) throw new Error(res.message);

        setCertifications((prev) =>
          prev.map((c) => (c.id === editingCert.id ? res.data! : c)).sort((a, b) => a.orderIndex - b.orderIndex)
        );
        toast.success("Certification updated successfully!");
      } else {
        // Add
        const res = await addCertificationAction({
          title: editingCert.title.trim(),
          issuer: editingCert.issuer.trim(),
          issueDate: editingCert.issueDate.trim(),
          credentialId: editingCert.credentialId?.trim() || undefined,
          credentialUrl: editingCert.credentialUrl?.trim() || undefined,
          certificateFileUrl: editingCert.certificateFileUrl || null,
          fileType: editingCert.fileType || "image",
          description: editingCert.description?.trim() || undefined,
          badgeIcon: editingCert.badgeIcon || "award",
          orderIndex: Number(editingCert.orderIndex) || certifications.length + 1,
        });

        if (!res.success || !res.data) throw new Error(res.message);

        setCertifications((prev) => [...prev, res.data!].sort((a, b) => a.orderIndex - b.orderIndex));
        toast.success("Certification added successfully!");
      }

      setIsEditing(false);
      setEditingCert(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save certification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (cert: CertificationItem) => {
    if (!confirm(`Are you sure you want to delete "${cert.title}"?`)) return;

    try {
      const res = await deleteCertificationAction(cert.id, cert.certificateFileUrl);
      if (!res.success) throw new Error(res.message);

      setCertifications((prev) => prev.filter((c) => c.id !== cert.id));
      toast.success("Certification deleted successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete certification.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A231C]">
        <div>
          <h1 className="text-2xl font-bold text-[#F5E8D8] flex items-center gap-2.5">
            <Award className="w-6 h-6 text-[#E5A93C]" />
            Certifications & Credentials CMS
          </h1>
          <p className="text-sm text-[#B39F8A] mt-1">
            Upload your verified certificates, customize credential IDs, and manage view-only protected previews.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#C48924] hover:from-[#D4982B] hover:to-[#B3781A] text-[#120D0A] text-sm font-semibold transition-all shadow-lg shadow-[#E5A93C]/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      {/* Certifications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="rounded-2xl bg-[#1A1410] border border-[#2A231C] p-5 flex flex-col justify-between space-y-4 hover:border-[#E5A93C]/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="p-2.5 rounded-xl bg-[#E5A93C]/10 text-[#E5A93C] border border-[#E5A93C]/20">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#120D0A] text-[#8A7866] border border-[#2A231C]">
                    #{cert.orderIndex}
                  </span>
                  {cert.certificateFileUrl ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <FileCheck className="w-3 h-3" /> File Attached
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400/80 border border-amber-500/20">
                      Badge Only
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#F5E8D8] leading-snug">{cert.title}</h3>
                <p className="text-xs text-[#E5A93C] font-mono mt-0.5">{cert.issuer}</p>
              </div>

              <div className="space-y-1 text-xs text-[#B39F8A]">
                <p>
                  <span className="text-[#8A7866]">Issued:</span> {cert.issueDate}
                </p>
                {cert.credentialId && (
                  <p className="font-mono text-[11px]">
                    <span className="text-[#8A7866]">ID:</span> {cert.credentialId}
                  </p>
                )}
                {cert.description && (
                  <p className="text-[#8A7866] text-xs line-clamp-2 pt-1">{cert.description}</p>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-[#2A231C] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {cert.certificateFileUrl && (
                  <button
                    onClick={() => setPreviewCert(cert)}
                    className="p-2 rounded-lg bg-[#120D0A] text-[#B39F8A] hover:text-[#E5A93C] border border-[#2A231C] transition-colors"
                    title="Preview Certificate"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#120D0A] text-[#B39F8A] hover:text-[#E5A93C] border border-[#2A231C] transition-colors"
                    title="External Verification Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(cert)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A2017] hover:bg-[#382B1F] text-xs font-semibold text-[#F5E8D8] border border-[#3D3023] transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cert)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isEditing && editingCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#1A1410] border border-[#3D3023] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A231C]">
              <h2 className="text-xl font-bold text-[#F5E8D8] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#E5A93C]" />
                {editingCert.id ? "Edit Certification" : "Add New Certification"}
              </h2>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingCert(null);
                }}
                className="p-2 rounded-lg bg-[#120D0A] text-[#8A7866] hover:text-[#F5E8D8] border border-[#2A231C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-[#B39F8A]">
                    Certification Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.title || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    placeholder=".NET Full Stack Developer Certification"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120D0A] border border-[#2A231C] text-[#F5E8D8] text-sm focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#B39F8A]">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuer || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    placeholder="Complete Java Classes (CJC) / Microsoft"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120D0A] border border-[#2A231C] text-[#F5E8D8] text-sm focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#B39F8A]">
                    Issue Date / Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.issueDate || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                    placeholder="2024 or Nov 2023"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120D0A] border border-[#2A231C] text-[#F5E8D8] text-sm focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#B39F8A]">
                    Credential ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingCert.credentialId || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                    placeholder="e.g. CJC-FS-2024-098"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120D0A] border border-[#2A231C] text-[#F5E8D8] text-sm focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#B39F8A]">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    value={editingCert.orderIndex ?? 1}
                    onChange={(e) => setEditingCert({ ...editingCert, orderIndex: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120D0A] border border-[#2A231C] text-[#F5E8D8] text-sm focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-[#B39F8A]">
                    External Verification Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={editingCert.credentialUrl || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                    placeholder="https://verify.example.com/cert/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120D0A] border border-[#2A231C] text-[#F5E8D8] text-sm focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-[#B39F8A]">
                    Brief Description / Key Competencies
                  </label>
                  <textarea
                    rows={2}
                    value={editingCert.description || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                    placeholder="Focus areas covered (e.g. ASP.NET Core, React, SQL Server, Clean Architecture)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120D0A] border border-[#2A231C] text-[#F5E8D8] text-sm focus:outline-none focus:border-[#E5A93C] resize-none"
                  />
                </div>
              </div>

              {/* Certificate File Upload Section */}
              <div className="pt-4 border-t border-[#2A231C] space-y-3">
                <label className="block text-xs font-medium text-amber-400 font-mono uppercase tracking-wider">
                  Certificate Document / Image (View-Only Protected)
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {editingCert.certificateFileUrl ? (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#120D0A] border border-[#2A231C]">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 rounded-lg bg-[#E5A93C]/10 text-[#E5A93C]">
                        {editingCert.fileType === "pdf" ? <FileText className="w-5 h-5" /> : <FileImage className="w-5 h-5" />}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-mono text-[#F5E8D8] block truncate">
                          {editingCert.certificateFileUrl.split("/").pop()}
                        </span>
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> File ready for view-only modal
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingFile}
                        className="px-3 py-1.5 rounded-lg bg-[#2A2017] hover:bg-[#382B1F] text-xs font-medium text-[#F5E8D8] border border-[#3D3023] transition-colors"
                      >
                        {isUploadingFile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Replace"}
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#3D3023] hover:border-[#E5A93C]/50 rounded-2xl p-6 text-center cursor-pointer bg-[#120D0A]/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#2A2017] text-[#E5A93C] flex items-center justify-center mx-auto mb-2">
                      {isUploadingFile ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                    </div>
                    <p className="text-xs font-semibold text-[#F5E8D8]">
                      Click to upload Certificate File (PNG, JPG, WebP, or PDF)
                    </p>
                    <p className="text-[11px] text-[#8A7866] mt-0.5">
                      Max 10MB • Will be displayed in view-only protected mode
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A231C]">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingCert(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#120D0A] hover:bg-[#2A2017] text-[#B39F8A] text-sm font-medium border border-[#2A231C] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingFile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#D4982B] text-[#120D0A] text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingCert.id ? "Save Changes" : "Create Certification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin View-Only Preview Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#17120E] border border-[#3D3023] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-[#2A231C] bg-[#120D0A]">
              <div>
                <h3 className="text-sm font-bold text-[#F5E8D8]">{previewCert.title}</h3>
                <p className="text-xs text-[#E5A93C] font-mono">{previewCert.issuer}</p>
              </div>
              <button
                onClick={() => setPreviewCert(null)}
                className="p-2 rounded-lg bg-[#1A1410] text-[#8A7866] hover:text-[#F5E8D8] border border-[#2A231C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#090706] relative select-none">
              {previewCert.certificateFileUrl ? (
                previewCert.fileType === "pdf" ? (
                  <iframe
                    src={`${previewCert.certificateFileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-[70vh] rounded-xl border border-[#2A231C]"
                    title="Certificate Preview"
                  />
                ) : (
                  <div className="relative group select-none">
                    <img
                      src={previewCert.certificateFileUrl}
                      alt={previewCert.title}
                      className="max-h-[70vh] w-auto rounded-xl shadow-2xl object-contain pointer-events-none select-none"
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                    />
                    {/* Security watermark badge */}
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30 text-[10px] font-mono text-amber-400 pointer-events-none">
                      Verified Credential • Shivam Patil
                    </div>
                  </div>
                )
              ) : (
                <div className="p-8 text-center text-[#8A7866]">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[#E5A93C]" />
                  <p className="text-sm font-medium">No document uploaded for this certification</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
