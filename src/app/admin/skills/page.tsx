import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSkills } from "@/lib/db";
import { SkillsManager } from "./SkillsManager";

export const revalidate = 0;

export default async function AdminSkillsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const skills = await getSkills();

  return <SkillsManager initialSkills={skills} />;
}
