"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  Sparkles,
  Briefcase,
  Layers,
  FileText,
} from "lucide-react";
import { AboutDetails } from "@/lib/db/initial-data";
import { updateAboutDetailsAction } from "@/actions/admin";

export function AboutManager({ initialAbout }: { initialAbout: AboutDetails }) {
  const [storyParagraphs, setStoryParagraphs] = useState<string[]>(
    initialAbout.storyParagraphs && initialAbout.storyParagraphs.length > 0
      ? initialAbout.storyParagraphs
      : [""]
  );
  const [bioHighlight, setBioHighlight] = useState(initialAbout.bioHighlight || "");
  const [yearsOfExperience, setYearsOfExperience] = useState(
    initialAbout.yearsOfExperience &&
      initialAbout.yearsOfExperience !== "00" &&
      initialAbout.yearsOfExperience !== "0"
      ? initialAbout.yearsOfExperience
      : "Fresher"
  );
  const [projectsCompleted, setProjectsCompleted] = useState(
    initialAbout.projectsCompleted || "10+ Projects"
  );
  const [isSaving, setIsSaving] = useState(false);

  // Paragraph management helpers
  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...storyParagraphs];
    updated[index] = value;
    setStoryParagraphs(updated);
  };

  const handleAddParagraph = () => {
    setStoryParagraphs([...storyParagraphs, ""]);
  };

  const handleDeleteParagraph = (index: number) => {
    if (storyParagraphs.length <= 1) {
      toast.error("You must have at least one story paragraph.");
      return;
    }
    const updated = storyParagraphs.filter((_, idx) => idx !== index);
    setStoryParagraphs(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...storyParagraphs];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setStoryParagraphs(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === storyParagraphs.length - 1) return;
    const updated = [...storyParagraphs];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setStoryParagraphs(updated);
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty paragraphs
    const cleanedParagraphs = storyParagraphs.map((p) => p.trim()).filter((p) => p.length > 0);
    if (cleanedParagraphs.length === 0) {
      toast.error("Please provide at least one non-empty story paragraph.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateAboutDetailsAction({
        storyParagraphs: cleanedParagraphs,
        bioHighlight: bioHighlight.trim(),
        yearsOfExperience: yearsOfExperience.trim(),
        projectsCompleted: projectsCompleted.trim(),
      });

      if (res.success) {
        toast.success("About section saved successfully!", {
          description: "All changes are live on the public About page.",
        });
        setStoryParagraphs(cleanedParagraphs);
      } else {
        toast.error("Failed to save About section", { description: res.message });
      }
    } catch {
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveAbout} className="space-y-8">
      {/* 1. Bio Highlight & Metrics Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/25 space-y-6">
        <div className="border-b border-[#2d221c] pb-4">
          <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Bio Highlight & Key Metrics</span>
          </h2>
          <p className="text-xs text-[#a39687] mt-0.5">
            Summary statement and numerical metrics featured in page headers & badges
          </p>
        </div>

        {/* Bio Highlight */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
            Bio Highlight / Mission Statement <span className="text-amber-400">*</span>
          </label>
          <textarea
            rows={3}
            value={bioHighlight}
            onChange={(e) => setBioHighlight(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all leading-relaxed"
            placeholder="Passionate about building scalable distributed systems, writing clean maintainable code, and solving real-world business challenges."
          />
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-[#cfc5b8] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Years of Experience Label</span>
            </label>
            <input
              type="text"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-mono"
              placeholder="Fresher (or 1+ Years)"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-[#cfc5b8] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Projects Completed Label</span>
            </label>
            <input
              type="text"
              value={projectsCompleted}
              onChange={(e) => setProjectsCompleted(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-mono"
              placeholder="10+ Projects"
            />
          </div>
        </div>
      </div>

      {/* 2. Story Paragraphs Dynamic List Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/25 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#2d221c] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Story Narrative Paragraphs</span>
            </h2>
            <p className="text-xs text-[#a39687] mt-0.5">
              Detailed journey paragraphs displayed on the public About page
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddParagraph}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Paragraph</span>
          </button>
        </div>

        <div className="space-y-4">
          {storyParagraphs.map((para, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-[#140f0d] border border-[#2d221c] space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[#a39687]">
                <span className="flex items-center gap-1.5 font-bold text-amber-400">
                  <FileText className="w-3.5 h-3.5" /> Paragraph #{index + 1}
                </span>

                <div className="flex items-center gap-1">
                  {/* Move Up */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-[#1e1713] border border-[#352923] text-[#cfc5b8] hover:text-amber-300 hover:border-amber-500/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                    title="Move paragraph up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === storyParagraphs.length - 1}
                    className="p-1.5 rounded-lg bg-[#1e1713] border border-[#352923] text-[#cfc5b8] hover:text-amber-300 hover:border-amber-500/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                    title="Move paragraph down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeleteParagraph(index)}
                    className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 cursor-pointer transition-all ml-1"
                    title="Delete paragraph"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <textarea
                rows={3}
                value={para}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#0e0a09] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all leading-relaxed"
                placeholder={`Enter content for paragraph #${index + 1}...`}
              />
            </div>
          ))}
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
              <span>Saving About Details...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#090807]" />
              <span>Save About Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
