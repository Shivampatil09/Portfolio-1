import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getExperience } from "@/lib/db";
import { ExperienceManager } from "./ExperienceManager";
import { Briefcase } from "lucide-react";

export const revalidate = 0;

export default async function AdminExperiencePage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const experiences = await getExperience();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#261c17]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400 mb-2">
            <Briefcase className="w-3.5 h-3.5" /> Career History & Roles
          </div>
          <h1 className="text-3xl font-extrabold text-[#faf7f2] tracking-tight">
            Work Experience Management
          </h1>
          <p className="text-xs font-mono text-[#a39687] mt-1">
            Manage your professional job roles, companies, dates, and achievement bullets
          </p>
        </div>
      </div>

      {/* Experience Manager Component */}
      <ExperienceManager initialExperiences={experiences} />
    </div>
  );
}
