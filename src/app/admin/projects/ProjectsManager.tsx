"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Layers, ExternalLink, Loader2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ProjectItem } from "@/lib/db/initial-data";
import { addProjectAction, updateProjectAction, deleteProjectAction } from "@/actions/admin";

export function ProjectsManager({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    techStackInput: "",
    githubUrl: "",
    liveDemoUrl: "",
    imageUrl: "",
    isFeatured: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      techStackInput: "",
      githubUrl: "",
      liveDemoUrl: "",
      imageUrl: "",
      isFeatured: true,
    });
    setIsEditing(null);
    setShowAddModal(false);
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setIsEditing(project.id);
    setFormData({
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription || "",
      techStackInput: project.techStack.join(", "),
      githubUrl: project.githubUrl || "",
      liveDemoUrl: project.liveDemoUrl || "",
      imageUrl: project.imageUrl || "",
      isFeatured: project.isFeatured,
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.shortDescription.trim()) {
      toast.error("Please fill in the project title and short description.");
      return;
    }

    setIsProcessing(true);
    const techStack = formData.techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (isEditing) {
        const res = await updateProjectAction(isEditing, {
          title: formData.title,
          slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
          shortDescription: formData.shortDescription,
          fullDescription: formData.fullDescription || undefined,
          imageUrl: formData.imageUrl || null,
          techStack: techStack.length > 0 ? techStack : [".NET 8", "React"],
          githubUrl: formData.githubUrl || undefined,
          liveDemoUrl: formData.liveDemoUrl || undefined,
          isFeatured: formData.isFeatured,
        });

        if (res.success) {
          toast.success("Project updated successfully!");
          setProjects(
            projects.map((p) =>
              p.id === isEditing
                ? {
                    ...p,
                    title: formData.title,
                    slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
                    shortDescription: formData.shortDescription,
                    fullDescription: formData.fullDescription,
                    imageUrl: formData.imageUrl || null,
                    techStack: techStack.length > 0 ? techStack : [".NET 8", "React"],
                    githubUrl: formData.githubUrl,
                    liveDemoUrl: formData.liveDemoUrl,
                    isFeatured: formData.isFeatured,
                  }
                : p
            )
          );
          resetForm();
        }
      } else {
        const res = await addProjectAction({
          title: formData.title,
          slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
          shortDescription: formData.shortDescription,
          fullDescription: formData.fullDescription || undefined,
          imageUrl: formData.imageUrl || null,
          techStack: techStack.length > 0 ? techStack : [".NET 8", "React"],
          githubUrl: formData.githubUrl || undefined,
          liveDemoUrl: formData.liveDemoUrl || undefined,
          isFeatured: formData.isFeatured,
          orderIndex: projects.length + 1,
        });

        if (res.success) {
          toast.success("Project created successfully!");
          setProjects([
            ...projects,
            {
              id: `proj-${Date.now()}`,
              title: formData.title,
              slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
              shortDescription: formData.shortDescription,
              fullDescription: formData.fullDescription,
              imageUrl: formData.imageUrl || null,
              techStack: techStack.length > 0 ? techStack : [".NET 8", "React"],
              githubUrl: formData.githubUrl,
              liveDemoUrl: formData.liveDemoUrl,
              isFeatured: formData.isFeatured,
              orderIndex: projects.length + 1,
            },
          ]);
          resetForm();
        }
      }
    } catch {
      toast.error("An error occurred while saving the project.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const res = await deleteProjectAction(id);
      if (res.success) {
        toast.success("Project deleted.");
        setProjects(projects.filter((p) => p.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Manage Projects ({projects.length})</span>
          </h2>
          <p className="text-xs text-[#a39687]">Add, edit, or delete showcased engineering projects</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-xs font-bold text-[#090807] hover:brightness-110 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        >
          <Plus className="w-4 h-4 text-[#090807]" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Table / List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-amber-500/20"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#faf7f2]">{project.title}</h3>
                {project.isFeatured && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-[#a39687] line-clamp-2">{project.shortDescription}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14100e] border border-[#352923] text-[#cfc5b8]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => handleOpenEdit(project)}
                className="p-2 rounded-lg bg-[#1a1410] border border-[#352923] text-[#cfc5b8] hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer"
                title="Edit Project"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 rounded-lg bg-[#1a1410] border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Slide-over Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-amber-500/40 space-y-5 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#faf7f2]">
              {isEditing ? "Edit Project" : "Add New Project"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#cfc5b8]">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. SmartStationary"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#cfc5b8]">Slug (URL Identifier)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. smart-stationary"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#cfc5b8]">Short Description *</label>
                <textarea
                  rows={3}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Summary of what the project does..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#cfc5b8]">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.techStackInput}
                  onChange={(e) => setFormData({ ...formData, techStackInput: e.target.value })}
                  placeholder=".NET 8, ASP.NET Core, React, SQL Server"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#cfc5b8]">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#cfc5b8]">Live Demo URL</label>
                  <input
                    type="url"
                    value={formData.liveDemoUrl}
                    onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#faf7f2] focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-[#3b2d24] bg-[#14100e] text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="isFeatured" className="text-xs text-[#cfc5b8]">
                  Feature this project on Home page
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#352923]">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl bg-[#14100e] border border-[#3b2d24] text-xs text-[#a39687] hover:text-[#faf7f2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-xs font-bold text-[#090807] hover:brightness-110 disabled:opacity-50"
                >
                  {isProcessing ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
