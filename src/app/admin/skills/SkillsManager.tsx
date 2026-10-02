"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Terminal, Loader2 } from "lucide-react";
import { SkillItem } from "@/lib/db/initial-data";
import { addSkillAction, updateSkillAction, deleteSkillAction } from "@/actions/admin";

export function SkillsManager({ initialSkills }: { initialSkills: SkillItem[] }) {
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState<{
    category: SkillItem["category"];
    name: string;
    icon: string;
    proficiencyLabel: string;
    isFeatured: boolean;
  }>({
    category: "backend",
    name: "",
    icon: "code",
    proficiencyLabel: "Advanced",
    isFeatured: false,
  });

  const resetForm = () => {
    setFormData({
      category: "backend",
      name: "",
      icon: "code",
      proficiencyLabel: "Advanced",
      isFeatured: false,
    });
    setIsEditing(null);
    setShowModal(false);
  };

  const handleOpenEdit = (skill: SkillItem) => {
    setIsEditing(skill.id);
    setFormData({
      category: skill.category,
      name: skill.name,
      icon: skill.icon,
      proficiencyLabel: skill.proficiencyLabel,
      isFeatured: skill.isFeatured,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Skill name is required.");
      return;
    }

    setIsProcessing(true);
    try {
      if (isEditing) {
        const res = await updateSkillAction(isEditing, formData);
        if (res.success) {
          toast.success("Skill updated!");
          setSkills(
            skills.map((s) => (s.id === isEditing ? { ...s, ...formData } : s))
          );
          resetForm();
        }
      } else {
        const res = await addSkillAction({
          ...formData,
          orderIndex: skills.length + 1,
        });
        if (res.success) {
          toast.success("Skill added!");
          setSkills([
            ...skills,
            {
              id: `sk-${Date.now()}`,
              ...formData,
              orderIndex: skills.length + 1,
            },
          ]);
          resetForm();
        }
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      const res = await deleteSkillAction(id);
      if (res.success) {
        toast.success("Skill removed.");
        setSkills(skills.filter((s) => s.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <span>Manage Skills & Technologies ({skills.length})</span>
          </h2>
          <p className="text-xs text-[#a39687]">
            Maintain your .NET, React, Database, and Tooling taxonomy
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-xs font-bold text-[#090807] hover:brightness-110 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        >
          <Plus className="w-4 h-4 text-[#090807]" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Categorized Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="glass-card p-4 rounded-xl flex items-center justify-between border-amber-500/20"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#faf7f2]">{skill.name}</span>
                {skill.isFeatured && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </div>
              <span className="text-[10px] font-mono text-amber-500/80 uppercase">
                {skill.category} • {skill.proficiencyLabel}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleOpenEdit(skill)}
                className="p-1.5 rounded-lg text-[#a39687] hover:text-amber-300 hover:bg-[#201813]"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-amber-500/40 space-y-4">
            <h3 className="text-base font-bold text-[#faf7f2]">
              {isEditing ? "Edit Skill" : "Add New Skill"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#cfc5b8]">Skill Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ASP.NET Core Web API"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#cfc5b8]">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as SkillItem["category"],
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
                >
                  <option value="backend">Backend (.NET / C#)</option>
                  <option value="frontend">Frontend (React / TypeScript)</option>
                  <option value="database">Database (SQL Server / PostgreSQL)</option>
                  <option value="tools">Tools & Workflow</option>
                  <option value="architecture">Architecture & Patterns</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#cfc5b8]">Proficiency Label</label>
                <input
                  type="text"
                  value={formData.proficiencyLabel}
                  onChange={(e) => setFormData({ ...formData, proficiencyLabel: e.target.value })}
                  placeholder="e.g. Advanced, Framework, Core"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredSkill"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-[#3b2d24] bg-[#14100e] text-amber-500"
                />
                <label htmlFor="featuredSkill" className="text-xs text-[#cfc5b8]">
                  Highlight as Core Skill on Home page
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#352923]">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#a39687]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-xs font-bold text-[#090807] hover:brightness-110 disabled:opacity-50"
                >
                  {isProcessing ? "Saving..." : isEditing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
