"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Loader2, Edit3, UserCheck } from "lucide-react";
import { HeroProfile, AboutDetails } from "@/lib/db/initial-data";
import { updateHeroProfileAction, updateAboutDetailsAction } from "@/actions/admin";

export function ProfileContentEditor({
  initialProfile,
  initialAbout,
}: {
  initialProfile: HeroProfile;
  initialAbout: AboutDetails;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [about, setAbout] = useState(initialAbout);
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateHeroProfileAction(profile);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateAboutDetailsAction(about);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to save about details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Hero & Branding Form */}
      <form onSubmit={handleProfileSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/25 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#352923]">
          <div>
            <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>Hero & Personal Branding</span>
            </h2>
            <p className="text-xs text-[#a39687]">Edit full name, headline, summary, and primary call to action</p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-xs font-bold text-[#090807] hover:brightness-110 disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-[#cfc5b8]">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-[#cfc5b8]">Headline</label>
            <input
              type="text"
              value={profile.headline}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-[#cfc5b8]">Primary CTA Text</label>
            <input
              type="text"
              value={profile.primaryCtaText}
              onChange={(e) => setProfile({ ...profile, primaryCtaText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-[#cfc5b8]">CTA Link</label>
            <input
              type="text"
              value={profile.ctaLink}
              onChange={(e) => setProfile({ ...profile, ctaLink: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-mono uppercase text-[#cfc5b8]">Hero Summary & Tagline</label>
            <textarea
              rows={3}
              value={profile.summary}
              onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        </div>

        {/* Contact & Social Sub-section */}
        <div className="pt-6 border-t border-[#352923] space-y-4">
          <h3 className="text-sm font-semibold text-amber-400 font-mono uppercase tracking-wider">
            Direct Contact Information & Social Profiles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">Contact Email</label>
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="patilshivam1280@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">Phone / WhatsApp (Optional)</label>
              <input
                type="text"
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">Location</label>
              <input
                type="text"
                value={profile.location || ""}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="Pune, Maharashtra, India"
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">Availability / Response Status</label>
              <input
                type="text"
                value={profile.availabilityStatus || ""}
                onChange={(e) => setProfile({ ...profile, availabilityStatus: e.target.value })}
                placeholder="Typically within 24 hours"
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">GitHub Profile URL</label>
              <input
                type="text"
                value={profile.githubUrl}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">LinkedIn Profile URL</label>
              <input
                type="text"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </form>

      {/* 2. About Details Form */}
      <form onSubmit={handleAboutSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/25 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#352923]">
          <div>
            <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-400" />
              <span>About Me & Story Content</span>
            </h2>
            <p className="text-xs text-[#a39687]">Edit bio highlight and developer story paragraphs</p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-xs font-bold text-[#090807] hover:brightness-110 disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save About</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-[#cfc5b8]">Bio Highlight</label>
            <input
              type="text"
              value={about.bioHighlight}
              onChange={(e) => setAbout({ ...about, bioHighlight: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">Experience Metric</label>
              <input
                type="text"
                value={about.yearsOfExperience}
                onChange={(e) => setAbout({ ...about, yearsOfExperience: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">Projects Metric</label>
              <input
                type="text"
                value={about.projectsCompleted}
                onChange={(e) => setAbout({ ...about, projectsCompleted: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
