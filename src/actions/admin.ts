"use server";

import {
  validateAdminCredentials,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSession,
} from "@/lib/auth";
import {
  getHeroProfile,
  updateHeroProfile,
  getAboutDetails,
  updateAboutDetails,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getExperience,
  updateExperienceItem,
  getEducation,
  updateEducationItem,
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
  getContactMessages,
  markMessageRead,
  deleteMessage,
  getResume,
  updateResume,
} from "@/lib/db";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";

// 1. Auth Actions
export async function loginAdminAction(formData: { username: string; password: string }) {
  const isValid = validateAdminCredentials(formData.username.trim(), formData.password);
  if (!isValid) {
    return { success: false, message: "Invalid username or password." };
  }

  const token = await createSessionToken({ username: formData.username, role: "admin" });
  await setSessionCookie(token);

  return { success: true, message: "Authentication successful." };
}

export async function logoutAdminAction() {
  await clearSessionCookie();
  return { success: true };
}

// 2. Profile & Photo Actions
export async function updateHeroProfileAction(data: {
  fullName: string;
  headline: string;
  subHeadline: string;
  summary: string;
  primaryCtaText: string;
  ctaLink: string;
  githubUrl: string;
  linkedinUrl: string;
  profileImageUrl?: string | null;
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized. Please sign in." };

  await updateHeroProfile(data);
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Profile information updated successfully!" };
}

export async function updateProfilePhotoAction(profileImageUrl: string | null) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized. Please sign in." };

  await updateHeroProfile({ profileImageUrl });
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/dashboard");
  return {
    success: true,
    message: profileImageUrl ? "Profile photo updated successfully!" : "Profile photo removed.",
  };
}

// 3. About Section Actions
export async function updateAboutDetailsAction(data: {
  storyParagraphs: string[];
  bioHighlight: string;
  yearsOfExperience: string;
  projectsCompleted: string;
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await updateAboutDetails(data);
  revalidatePath("/about");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "About details updated successfully!" };
}

// 4. Skills Actions
export async function addSkillAction(data: {
  category: "backend" | "frontend" | "database" | "tools" | "architecture";
  name: string;
  icon: string;
  proficiencyLabel: string;
  isFeatured: boolean;
  orderIndex: number;
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await addSkill(data);
  revalidatePath("/skills");
  revalidatePath("/admin/skills");
  return { success: true, message: "Skill added successfully!" };
}

export async function updateSkillAction(
  id: string,
  data: Partial<{
    category: "backend" | "frontend" | "database" | "tools" | "architecture";
    name: string;
    icon: string;
    proficiencyLabel: string;
    isFeatured: boolean;
    orderIndex: number;
  }>
) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await updateSkill(id, data);
  revalidatePath("/skills");
  revalidatePath("/admin/skills");
  return { success: true, message: "Skill updated successfully!" };
}

export async function deleteSkillAction(id: string) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await deleteSkill(id);
  revalidatePath("/skills");
  revalidatePath("/admin/skills");
  return { success: true, message: "Skill deleted successfully!" };
}

// 5. Projects Actions
export async function addProjectAction(data: {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  imageUrl: string | null;
  techStack: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  isFeatured: boolean;
  orderIndex: number;
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await addProject(data);
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true, message: "Project added successfully!" };
}

export async function updateProjectAction(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription?: string;
    imageUrl: string | null;
    techStack: string[];
    githubUrl?: string;
    liveDemoUrl?: string;
    isFeatured: boolean;
    orderIndex: number;
  }>
) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await updateProject(id, data);
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true, message: "Project updated successfully!" };
}

export async function deleteProjectAction(id: string) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await deleteProject(id);
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true, message: "Project deleted successfully!" };
}

// 6. Messages Actions
export async function markMessageReadAction(id: string, isRead: boolean) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await markMessageRead(id, isRead);
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await deleteMessage(id);
  revalidatePath("/admin/messages");
  return { success: true, message: "Message deleted successfully." };
}

// 7. Resume Action
export async function updateResumeAction(data: {
  pdfUrl?: string;
  title?: string;
  summary?: string;
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await updateResume(data);
  revalidatePath("/resume");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Resume updated successfully!" };
}

// 8. Certification Actions
export async function addCertificationAction(data: {
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  credentialId?: string;
  certificateFileUrl?: string | null;
  fileType?: "image" | "pdf" | null;
  description?: string;
  badgeIcon?: string;
  orderIndex: number;
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  const newCert = await addCertification(data);
  revalidatePath("/skills");
  revalidatePath("/about");
  revalidatePath("/admin/certifications");
  return { success: true, message: "Certification added successfully!", data: newCert };
}

export async function updateCertificationAction(
  id: string,
  data: Partial<{
    title: string;
    issuer: string;
    issueDate: string;
    credentialUrl?: string;
    credentialId?: string;
    certificateFileUrl?: string | null;
    fileType?: "image" | "pdf" | null;
    description?: string;
    badgeIcon?: string;
    orderIndex: number;
  }>
) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  const updated = await updateCertification(id, data);
  revalidatePath("/skills");
  revalidatePath("/about");
  revalidatePath("/admin/certifications");
  return { success: true, message: "Certification updated successfully!", data: updated };
}

export async function deleteCertificationAction(id: string, certificateFileUrl?: string | null) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  if (certificateFileUrl && certificateFileUrl.startsWith("/certificates/")) {
    const certsDir = path.join(process.cwd(), "public", "certificates");
    const fileName = path.basename(certificateFileUrl);
    const filePath = path.join(certsDir, fileName);
    try {
      await fs.unlink(filePath);
    } catch {
      // ignore if file doesn't exist
    }
  }

  await deleteCertification(id);
  revalidatePath("/skills");
  revalidatePath("/about");
  revalidatePath("/admin/certifications");
  return { success: true, message: "Certification deleted successfully!" };
}
