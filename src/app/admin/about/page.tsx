import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAboutDetails } from "@/lib/db";
import { AboutManager } from "./AboutManager";
import { BookOpen } from "lucide-react";

export const revalidate = 0;

export default async function AdminAboutPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const about = await getAboutDetails();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#261c17]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400 mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Story & Bio Narrative
          </div>
          <h1 className="text-3xl font-extrabold text-[#faf7f2] tracking-tight">
            About Section Management
          </h1>
          <p className="text-xs font-mono text-[#a39687] mt-1">
            Manage your developer story paragraphs, bio highlight statement, and experience metrics
          </p>
        </div>
      </div>

      {/* Main About Manager */}
      <AboutManager initialAbout={about} />
    </div>
  );
}
