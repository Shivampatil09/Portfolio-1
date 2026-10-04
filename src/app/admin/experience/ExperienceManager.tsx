"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  CheckCircle2,
  MapPin,
  Calendar,
  X,
  ListPlus,
  Building,
} from "lucide-react";
import { ExperienceItem } from "@/lib/db/initial-data";
import {
  addExperienceAction,
  updateExperienceAction,
  deleteExperienceAction,
  reorderExperienceAction,
} from "@/actions/admin";

export function ExperienceManager({ initialExperiences }: { initialExperiences: ExperienceItem[] }) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [responsibilities, setResponsibilities] = useState<string[]>([""]);

  const openAddModal = () => {
    setEditingItem(null);
    setRole("");
    setCompany("");
    setLocation("Pune, Maharashtra, India");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    setResponsibilities([""]);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ExperienceItem) => {
    setEditingItem(item);
    setRole(item.role);
    setCompany(item.company);
    setLocation(item.location);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setIsCurrent(item.isCurrent);
    setResponsibilities(
      item.responsibilities && item.responsibilities.length > 0
        ? [...item.responsibilities]
        : [""]
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Responsibility bullets helper
  const handleBulletChange = (index: number, val: string) => {
    const updated = [...responsibilities];
    updated[index] = val;
    setResponsibilities(updated);
  };

  const handleAddBullet = () => {
    setResponsibilities([...responsibilities, ""]);
  };

  const handleDeleteBullet = (index: number) => {
    if (responsibilities.length <= 1) {
      toast.error("At least one responsibility bullet is required.");
      return;
    }
    setResponsibilities(responsibilities.filter((_, idx) => idx !== index));
  };

  const handleMoveBulletUp = (index: number) => {
    if (index === 0) return;
    const updated = [...responsibilities];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setResponsibilities(updated);
  };

  const handleMoveBulletDown = (index: number) => {
    if (index === responsibilities.length - 1) return;
    const updated = [...responsibilities];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setResponsibilities(updated);
  };

  // Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedBullets = responsibilities.map((b) => b.trim()).filter((b) => b.length > 0);
    if (cleanedBullets.length === 0) {
      toast.error("Please add at least one responsibility bullet.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        // Update existing
        const res = await updateExperienceAction(editingItem.id, {
          role: role.trim(),
          company: company.trim(),
          location: location.trim(),
          startDate: startDate.trim(),
          endDate: isCurrent ? "Present" : endDate.trim(),
          isCurrent,
          responsibilities: cleanedBullets,
        });

        if (res.success) {
          toast.success("Experience updated successfully!");
          setExperiences((prev) =>
            prev.map((exp) =>
              exp.id === editingItem.id
                ? {
                    ...exp,
                    role: role.trim(),
                    company: company.trim(),
                    location: location.trim(),
                    startDate: startDate.trim(),
                    endDate: isCurrent ? "Present" : endDate.trim(),
                    isCurrent,
                    responsibilities: cleanedBullets,
                  }
                : exp
            )
          );
          closeModal();
        } else {
          toast.error("Update failed", { description: res.message });
        }
      } else {
        // Add new
        const newOrder = experiences.length + 1;
        const res = await addExperienceAction({
          role: role.trim(),
          company: company.trim(),
          location: location.trim(),
          startDate: startDate.trim(),
          endDate: isCurrent ? "Present" : endDate.trim(),
          isCurrent,
          responsibilities: cleanedBullets,
          orderIndex: newOrder,
        });

        if (res.success && res.data) {
          toast.success("New experience added successfully!");
          setExperiences((prev) => [...prev, res.data!]);
          closeModal();
        } else {
          toast.error("Failed to add experience", { description: res.message });
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
    if (!confirm("Are you sure you want to delete this experience record?")) return;

    try {
      const res = await deleteExperienceAction(id);
      if (res.success) {
        toast.success("Experience deleted.");
        setExperiences((prev) => prev.filter((e) => e.id !== id));
      } else {
        toast.error("Failed to delete experience", { description: res.message });
      }
    } catch {
      toast.error("An error occurred while deleting.");
    }
  };

  // Reorder Items
  const handleReorder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === experiences.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...experiences];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Update orderIndex
    const payload = reordered.map((item, idx) => ({
      id: item.id,
      orderIndex: idx + 1,
    }));

    setExperiences(
      reordered.map((item, idx) => ({
        ...item,
        orderIndex: idx + 1,
      }))
    );

    await reorderExperienceAction(payload);
    toast.success("Order updated successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <span>Work Experience Timeline ({experiences.length})</span>
          </h2>
          <p className="text-xs text-[#a39687] mt-0.5">
            Manage your professional career milestones, roles, and bullet points
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-xs font-bold text-[#090807] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)]"
        >
          <Plus className="w-4 h-4 text-[#090807]" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Experience List */}
      {experiences.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-amber-500/20 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#faf7f2]">No Experience Listed</h3>
            <p className="text-xs text-[#a39687] mt-1 max-w-sm mx-auto">
              Click &quot;Add Experience&quot; to add your career history or professional roles.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="glass-card p-6 rounded-2xl border border-[#2d221c] hover:border-amber-500/30 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-lg font-bold text-[#faf7f2]">{exp.role}</h3>
                    {exp.isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold">
                        Current Position
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-[#a39687] flex-wrap">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <Building className="w-3.5 h-3.5" />
                      {exp.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                    <span className="flex items-center gap-1 text-[#cfc5b8]">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.startDate} - {exp.endDate}
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
                    disabled={index === experiences.length - 1}
                    className="p-1.5 rounded-lg bg-[#140f0d] border border-[#2d221c] text-[#a39687] hover:text-amber-300 hover:border-amber-500/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(exp)}
                    className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
                    title="Edit entry"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(exp.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Responsibilities Bullets */}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div className="pt-2 border-t border-[#261c17] space-y-1.5">
                  <span className="text-[10px] font-mono text-[#736557] uppercase tracking-wider block">
                    Responsibilities ({exp.responsibilities.length})
                  </span>
                  <ul className="space-y-1 text-xs text-[#cfc5b8] list-disc list-inside">
                    {exp.responsibilities.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
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
                <Briefcase className="w-5 h-5 text-amber-400" />
                <span>{editingItem ? "Edit Experience" : "Add Experience"}</span>
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[#a39687] hover:text-[#faf7f2] hover:bg-[#1f1713] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                    Job Role / Title <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl bg-[#140f0d] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-semibold"
                    placeholder="Admin & Career Consultant"
                  />
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                    Company / Organization <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl bg-[#140f0d] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all"
                    placeholder="CJC (Complete Java Classes)"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                    Location <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl bg-[#140f0d] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all"
                    placeholder="Pune, Maharashtra, India"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                    Start Date <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl bg-[#140f0d] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-mono"
                    placeholder="2023 or Jan 2023"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={isCurrent ? "Present" : endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isCurrent}
                    required={!isCurrent}
                    className="w-full px-4 py-2 rounded-xl bg-[#140f0d] border border-[#352923] text-sm text-[#faf7f2] focus:outline-none focus:border-amber-500 transition-all font-mono disabled:opacity-50"
                    placeholder="2024 or Present"
                  />
                </div>

                {/* Current Position Toggle */}
                <div className="flex items-center gap-2.5 pt-6">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    checked={isCurrent}
                    onChange={(e) => {
                      setIsCurrent(e.target.checked);
                      if (e.target.checked) setEndDate("Present");
                    }}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-[#140f0d] border-[#352923] cursor-pointer"
                  />
                  <label
                    htmlFor="isCurrent"
                    className="text-xs font-mono text-[#faf7f2] cursor-pointer select-none"
                  >
                    I currently work here (Present)
                  </label>
                </div>
              </div>

              {/* Responsibilities Dynamic Bullets */}
              <div className="space-y-3 pt-3 border-t border-[#261c17]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase text-[#cfc5b8] flex items-center gap-1.5">
                    <ListPlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Responsibilities & Achievements</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddBullet}
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    + Add Bullet
                  </button>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  {responsibilities.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-xs font-mono text-amber-400 pt-2 shrink-0">
                        #{bIdx + 1}
                      </span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                        required
                        className="flex-1 px-3 py-1.5 rounded-xl bg-[#140f0d] border border-[#352923] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500 leading-relaxed"
                        placeholder={`Responsibility bullet #${bIdx + 1}...`}
                      />
                      <div className="flex flex-col gap-1 shrink-0 pt-1">
                        <button
                          type="button"
                          onClick={() => handleMoveBulletUp(bIdx)}
                          disabled={bIdx === 0}
                          className="p-1 rounded bg-[#1e1713] text-[#a39687] hover:text-amber-300 disabled:opacity-20 cursor-pointer"
                          title="Move bullet up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveBulletDown(bIdx)}
                          disabled={bIdx === responsibilities.length - 1}
                          className="p-1 rounded bg-[#1e1713] text-[#a39687] hover:text-amber-300 disabled:opacity-20 cursor-pointer"
                          title="Move bullet down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBullet(bIdx)}
                          className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                          title="Delete bullet"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                      <span>{editingItem ? "Update Entry" : "Add Entry"}</span>
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
