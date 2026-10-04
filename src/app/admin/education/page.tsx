import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getEducation } from "@/lib/db";
import { EducationManager } from "./EducationManager";
import { GraduationCap } from "lucide-react";

export const revalidate = 0;

export default async function AdminEducationPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const educations = await getEducation();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#261c17]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400 mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> Academic History & Degrees
          </div>
          <h1 className="text-3xl font-extrabold text-[#faf7f2] tracking-tight">
            Education Management
          </h1>
          <p className="text-xs font-mono text-[#a39687] mt-1">
            Manage your university degrees, colleges, graduation years, distinctions, and coursework
          </p>
        </div>
      </div>

      {/* Education Manager Component */}
      <EducationManager initialEducations={educations} />
    </div>
  );
}
