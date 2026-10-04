"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  User,
  Upload,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Save,
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { HeroProfile } from "@/lib/db/initial-data";
import { updateHeroProfileAction, updateProfilePhotoAction } from "@/actions/admin";

export function ProfileManager({ initialProfile }: { initialProfile: HeroProfile }) {
  const [profile, setProfile] = useState<HeroProfile>(initialProfile);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialProfile.profileImageUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isPhotoSaving, setIsPhotoSaving] = useState(false);

  // Photo file upload (Base64 conversion)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large", {
        description: "Please upload an image smaller than 5MB.",
      });
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

  const savePhoto = async (url: string | null) => {
    setIsPhotoSaving(true);
    try {
      const res = await updateProfilePhotoAction(url);
      if (res.success) {
        toast.success(url ? "Profile photo updated!" : "Profile photo removed.");
        setProfile((prev) => ({ ...prev, profileImageUrl: url }));
      } else {
        toast.error("Photo update failed", { description: res.message });
      }
    } catch {
      toast.error("An error occurred while updating the photo.");
    } finally {
      setIsPhotoSaving(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (confirm("Are you sure you want to remove the profile photo?")) {
      setPhotoUrl(null);
      await savePhoto(null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateHeroProfileAction({
        fullName: profile.fullName,
        headline: profile.headline,
        subHeadline: profile.subHeadline,
        summary: profile.summary,
        primaryCtaText: profile.primaryCtaText,
        ctaLink: profile.ctaLink,
        githubUrl: profile.githubUrl,
        linkedinUrl: profile.linkedinUrl,
        email: profile.email,
        phone: profile.phone ?? "",
        location: profile.location,
        availabilityStatus: profile.availabilityStatus,
        profileImageUrl: photoUrl,
      });

      if (res.success) {
        toast.success("Profile saved successfully!", {
          description: "All changes are live on the public portfolio.",
        });
      } else {
        toast.error("Failed to save profile", { description: res.message });
      }
    } catch {
      toast.error("An unexpected error occurred while saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Profile Photo Manager Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/25 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span>Profile Photo</span>
            </h2>
            <p className="text-xs text-[#a39687] mt-0.5">
              Upload a professional portrait image (PNG, JPG, WebP)
            </p>
          </div>

          {photoUrl && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Photo Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-[#14100e] border-2 border-amber-500/30 flex items-center justify-center shadow-lg">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt="Profile Preview"
                  fill
                  className="object-cover object-center"
                />
              ) : (
                <div className="flex flex-col items-center text-center p-3 text-[#7c7062] space-y-1.5">
                  <ImageIcon className="w-8 h-8 stroke-1" />
                  <span className="text-[11px] font-mono">No Photo Set</span>
                </div>
              )}
            </div>
          </div>

          <div className="sm:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-xs font-bold text-[#090807] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                {isPhotoSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#090807]" />
                ) : (
                  <Upload className="w-4 h-4 text-[#090807]" />
                )}
                <span>{photoUrl ? "Replace Photo" : "Upload New Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isPhotoSaving}
                  className="hidden"
                />
              </label>

              {photoUrl && (
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  disabled={isPhotoSaving}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#241a14] border border-[#3d2e24] text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>

            <p className="text-[11px] font-mono text-[#7c7062]">
              Recommended: Square aspect ratio (min 500x500px). Stored securely as Base64 in Neon database.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Profile Information Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Core Identity Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/25 space-y-5">
          <div className="border-b border-[#2d221c] pb-4">
            <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              <span>Core Identity & Headline</span>
            </h2>
            <p className="text-xs text-[#a39687] mt-0.5">
              Personal branding displayed across the Home and About pages
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-semibold"
                placeholder="Shivam Patil"
              />
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                Primary Professional Headline <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-mono"
                placeholder=".NET Full Stack Developer"
              />
            </div>
          </div>

          {/* Subheadline */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
              Subheadline / Specialization Summary
            </label>
            <input
              type="text"
              value={profile.subHeadline}
              onChange={(e) => setProfile({ ...profile, subHeadline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all"
              placeholder="Specializing in C#, .NET 8, ASP.NET Core Web API, React, TypeScript & SQL Server"
            />
          </div>

          {/* Bio Summary */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
              Hero Executive Summary <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={4}
              value={profile.summary}
              onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all leading-relaxed"
              placeholder="Architecting robust enterprise backends, scalable RESTful APIs..."
            />
          </div>
        </div>

        {/* Contact Coordinates & Availability */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/25 space-y-5">
          <div className="border-b border-[#2d221c] pb-4">
            <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-400" />
              <span>Contact Coordinates & Availability</span>
            </h2>
            <p className="text-xs text-[#a39687] mt-0.5">
              Contact info displayed in headers, footers, and the Contact page
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Email</span>
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-mono"
                placeholder="patilshivam1280@gmail.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Phone / WhatsApp</span>
              </label>
              <input
                type="text"
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-mono"
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Current Location</span>
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all"
                placeholder="Pune, Maharashtra, India"
              />
            </div>

            {/* Availability Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Availability Status Badge</span>
              </label>
              <input
                type="text"
                value={profile.availabilityStatus}
                onChange={(e) => setProfile({ ...profile, availabilityStatus: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all"
                placeholder="Open for Full-time Roles & Projects"
              />
            </div>
          </div>
        </div>

        {/* CTA Button & Social Links */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/25 space-y-5">
          <div className="border-b border-[#2d221c] pb-4">
            <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-amber-400" />
              <span>Call-To-Action & Social Links</span>
            </h2>
            <p className="text-xs text-[#a39687] mt-0.5">
              Primary hero action button and social profile URLs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Primary CTA Text */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                Primary CTA Button Text
              </label>
              <input
                type="text"
                value={profile.primaryCtaText}
                onChange={(e) => setProfile({ ...profile, primaryCtaText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all"
                placeholder="Work With Me"
              />
            </div>

            {/* Primary CTA Link */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                Primary CTA Target Route / URL
              </label>
              <input
                type="text"
                value={profile.ctaLink}
                onChange={(e) => setProfile({ ...profile, ctaLink: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-mono"
                placeholder="/contact"
              />
            </div>

            {/* GitHub URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8] flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>GitHub Profile URL</span>
              </label>
              <input
                type="text"
                value={profile.githubUrl}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-mono"
                placeholder="https://github.com/Shivampatil09"
              />
            </div>

            {/* LinkedIn URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8] flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>LinkedIn Profile URL</span>
              </label>
              <input
                type="text"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-mono"
                placeholder="https://www.linkedin.com/in/shivampatil9"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-sm font-bold text-[#090807] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#090807]" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#090807]" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
