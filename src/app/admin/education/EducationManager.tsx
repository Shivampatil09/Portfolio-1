"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  MapPin,
  Calendar,
  X,
  Award,
  School,
} from "lucide-react";
import { EducationItem } from "@/lib/db/initial-data";
import {
  addEducationAction,
  updateEducationAction,
  deleteEducationAction,
  reorderEducationAction,
} from "@/actions/admin";

export function EducationManager({ initialEducations }: { initialEducations: EducationItem[] }) {
  const [educations, setEducations] = useState<EducationItem[]>(initialEducations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [location, setLocation] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");

  const openAddModal = () => {
    setEditingItem(null);
    setDegree("");
    setInstitution("");
    setLocation("Pune, Maharashtra");
    setStartYear("");
    setEndYear("");
    setGrade("");
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: EducationItem) => {
    setEditingItem(item);
    setDegree(item.degree);
    setInstitution(item.institution);
    setLocation(item.location || "");
    setStartYear(item.startYear);
    setEndYear(item.endYear);
    setGrade(item.grade || "");
    setDescription(item.description || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingItem) {
        // Update existing
        const res = await updateEducationAction(editingItem.id, {
          degree: degree.trim(),
          institution: institution.trim(),
          location: location.trim(),
          startYear: startYear.trim(),
          endYear: endYear.trim(),
          grade: grade.trim(),
          description: description.trim(),
        });

        if (res.success) {
          toast.success("Education updated successfully!");
          setEducations((prev) =>
            prev.map((edu) =>
              edu.id === editingItem.id
                ? {
                    ...edu,
                    degree: degree.trim(),
                    institution: institution.trim(),
                    location: location.trim(),
                    startYear: startYear.trim(),
                    endYear: endYear.trim(),
                    grade: grade.trim(),
                    description: description.trim(),
                  }
                : edu
            )
          );
          closeModal();
        } else {
          toast.error("Update failed", { description: res.message });
        }
      } else {
        // Add new
        const newOrder = educations.length + 1;
        const res = await addEducationAction({
          degree: degree.trim(),
          institution: institution.trim(),
          location: location.trim(),
          startYear: startYear.trim(),
          endYear: endYear.trim(),
          grade: grade.trim(),
          description: description.trim(),
          orderIndex: newOrder,
        });

        if (res.success && res.data) {
          toast.success("New education entry added!");
          setEducations((prev) => [...prev, res.data!]);
          closeModal();
        } else {
          toast.error("Failed to add education", { description: res.message });
        }
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Item
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education record?")) return;

    try {
      const res = await deleteEducationAction(id);
      if (res.success) {
        toast.success("Education deleted.");
        setEducations((prev) => prev.filter((e) => e.id !== id));
      } else {
        toast.error("Failed to delete", { description: res.message });
      }
    } catch {
      toast.error("An error occurred while deleting.");
    }
  };

  // Reorder Items
  const handleReorder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === educations.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...educations];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Update orderIndex
    const payload = reordered.map((item, idx) => ({
      id: item.id,
      orderIndex: idx + 1,
    }));

    setEducations(
      reordered.map((item, idx) => ({
        ...item,
        orderIndex: idx + 1,
      }))
    );

    await reorderEducationAction(payload);
    toast.success("Order updated successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>Academic Qualifications ({educations.length})</span>
          </h2>
          <p className="text-xs text-[#a39687] mt-0.5">
            Manage your degrees, institutions, graduation dates, and distinctions
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-xs font-bold text-[#090807] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)]"
        >
          <Plus className="w-4 h-4 text-[#090807]" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Education List */}
      {educations.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-amber-500/20 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#faf7f2]">No Education Records</h3>
            <p className="text-xs text-[#a39687] mt-1 max-w-sm mx-auto">
              Click &quot;Add Education&quot; to list your MCA, BCA, or other academic milestones.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu, index) => (
            <div
              key={edu.id}
              className="glass-card p-6 rounded-2xl border border-[#2d221c] hover:border-amber-500/30 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-lg font-bold text-[#faf7f2]">{edu.degree}</h3>
                    {edu.grade && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono text-amber-300 font-semibold flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-400" />
                        {edu.grade}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-[#a39687] flex-wrap">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <School className="w-3.5 h-3.5" />
                      {edu.institution}
                    </span>
                    {edu.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {edu.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[#cfc5b8]">
                      <Calendar className="w-3.5 h-3.5" />
                      {edu.startYear} - {edu.endYear}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleReorder(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-[#140f0d] border border-[#2d221c] text-[#a39687] hover:text-amber-300 hover:border-amber-500/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(index, "down")}
                    disabled={index === educations.length - 1}
                    className="p-1.5 rounded-lg bg-[#140f0d] border border-[#2d221c] text-[#a39687] hover:text-amber-300 hover:border-amber-500/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(edu)}
                    className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
                    title="Edit entry"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(edu.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              {edu.description && (
                <div className="pt-2 border-t border-[#261c17]">
                  <p className="text-xs text-[#cfc5b8] leading-relaxed">
                    {edu.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#110d0b] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#261c17] pb-4">
              <h3 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <span>{editingItem ? "Edit Education" : "Add Education"}</span>
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[#a39687] hover:text-[#faf7f2] hover:bg-[#1f1713] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Degree */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                    Degree / Course <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl bg-[#140f0d] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-semibold"
                    placeholder="Master of Computer Applications (MCA)"
                  />
                </div>

                {/* Institution */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                    College / University <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl bg-[#140f0d] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all"
                    placeholder="Pune University / Affiliated Institute"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#140f0d] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all"
                    placeholder="Pune, Maharashtra"
                  />
                </div>

                {/* Grade / Distinction */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                    Grade / Distinction
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#140f0d] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all"
                    placeholder="First Class with Distinction"
                  />
                </div>

                {/* Start Year */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                    Start Year <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl bg-[#140f0d] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-mono"
                    placeholder="2022"
                  />
                </div>

                {/* End Year */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                    End Year <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl bg-[#140f0d] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-mono"
                    placeholder="2024"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                  Specialization / Key Coursework Summary
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#140f0d] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all leading-relaxed"
                  placeholder="Specialized in Advanced Software Engineering, Distributed Systems, Database Management Systems..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#261c17]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-[#1c1512] border border-[#352923] text-xs font-semibold text-[#a39687] hover:text-[#faf7f2] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-xs font-bold text-[#090807] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#090807]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-[#090807]" />
                      <span>{editingItem ? "Update Education" : "Add Education"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
