"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Upload, Trash2, Image as ImageIcon, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { updateProfilePhotoAction } from "@/actions/admin";

export function ProfilePhotoManager({ initialPhotoUrl }: { initialPhotoUrl: string | null }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl);
  const [inputUrl, setInputUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // File upload handler (reads image file as data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large", { description: "Please upload an image smaller than 5MB." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setPhotoUrl(base64String);
      await savePhoto(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setPhotoUrl(inputUrl.trim());
    await savePhoto(inputUrl.trim());
    setInputUrl("");
  };

  const savePhoto = async (url: string | null) => {
    setIsSaving(true);
    try {
      const res = await updateProfilePhotoAction(url);
      if (res.success) {
        toast.success(url ? "Profile photo updated!" : "Profile photo removed.");
      } else {
        toast.error("Update failed", { description: res.message });
      }
    } catch {
      toast.error("An error occurred while saving the photo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete the profile photo?")) {
      setPhotoUrl(null);
      await savePhoto(null);
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/25 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <span>Profile Photo Management</span>
          </h2>
          <p className="text-xs text-[#a39687] mt-0.5">
            Upload, replace, or remove your professional hero photo
          </p>
        </div>

        {photoUrl && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Photo Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Current Photo Preview */}
        <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
          <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-[#14100e] border-2 border-amber-500/30 flex items-center justify-center shadow-lg group">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="Profile Preview"
                fill
                className="object-cover object-center"
              />
            ) : (
              <div className="flex flex-col items-center text-center p-4 text-[#7c7062] space-y-2">
                <ImageIcon className="w-10 h-10 stroke-1" />
                <span className="text-[11px] font-mono">No Photo Set (Using Avatar)</span>
              </div>
            )}

            {isSaving && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-amber-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}
          </div>

          {photoUrl && (
            <button
              onClick={handleDelete}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Photo</span>
            </button>
          )}
        </div>

        {/* Right: Upload Options */}
        <div className="md:col-span-8 space-y-5">
          {/* 1. Direct File Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#cfc5b8] font-semibold">
              Option 1: Upload from Computer
            </label>
            <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-[#3d2e24] hover:border-amber-500/50 bg-[#14100e]/50 cursor-pointer transition-colors group">
              <Upload className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform mb-1.5" />
              <span className="text-xs font-semibold text-[#faf7f2]">
                Click to browse photo file
              </span>
              <span className="text-[11px] text-[#7c7062] font-mono mt-0.5">
                Supports PNG, JPG, WebP (Max 5MB)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isSaving}
                className="hidden"
              />
            </label>
          </div>

          {/* 2. Direct Image URL */}
          <div className="space-y-2 pt-2 border-t border-[#352923]">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#cfc5b8] font-semibold">
              Option 2: Or Paste External Image URL
            </label>
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.com/profile-photo.jpg"
                disabled={isSaving}
                className="flex-1 px-4 py-2 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] placeholder-[#6e6357] focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={isSaving || !inputUrl.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 text-xs font-bold text-[#090807] hover:brightness-110 disabled:opacity-50 cursor-pointer"
              >
                Set URL
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
