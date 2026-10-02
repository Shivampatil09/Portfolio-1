import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getProjects } from "@/lib/db";
import { ProjectsManager } from "./ProjectsManager";

export const revalidate = 0;

export default async function AdminProjectsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const projects = await getProjects();

  return <ProjectsManager initialProjects={projects} />;
}
