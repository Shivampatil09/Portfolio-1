"use server";

import {
  authenticateAdmin,
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
  addExperienceItem,
  updateExperienceItem,
  deleteExperienceItem,
  getEducation,
  addEducationItem,
  updateEducationItem,
  deleteEducationItem,
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
  getContactMessages,
  markMessageRead,
  deleteMessage,
  getResume,
  updateResume,
  getSafeAdminUser,
} from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. Auth Actions
export async function loginAdminAction(formData: { username: string; password: string }) {
  const result = await authenticateAdmin(formData.username.trim(), formData.password);
  if (!result.success || !result.session) {
    return { success: false, message: result.message || "Invalid username or password." };
  }

  const token = await createSessionToken(result.session);
  await setSessionCookie(token);

  return { success: true, message: result.message || "Authentication successful." };
}

export async function logoutAdminAction() {
  await clearSessionCookie();
  return { success: true };
}

function maskEmailAddress(email?: string | null): string {
  if (!email || !email.includes("@")) return "Not Configured";
  const [local, domain] = email.split("@");
  if (!local || !domain) return "Not Configured";
  return `${local.charAt(0)}•••@${domain}`;
}

export async function getAdminAccountSecurityAction() {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  const admin = await getSafeAdminUser(session.username);
  if (!admin) {
    return {
      success: true,
      data: {
        id: session.adminId || null,
        username: session.username,
        maskedRecoveryEmail: "Not Configured",
        status: "pending_initialization",
        lastLoginAt: null,
        createdAt: null,
        updatedAt: null,
      },
    };
  }

  return {
    success: true,
    data: {
      id: admin.id,
      username: admin.username,
      maskedRecoveryEmail: maskEmailAddress(admin.recoveryEmail),
      status: admin.status,
      lastLoginAt: admin.lastLoginAt,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    },
  };
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
  email?: string;
  phone?: string | null;
  location?: string;
  availabilityStatus?: string;
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized. Please sign in." };

  await updateHeroProfile(data);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/profile");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Profile information updated successfully!" };
}

export async function updateProfilePhotoAction(profileImageUrl: string | null) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized. Please sign in." };

  await updateHeroProfile({ profileImageUrl });
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/profile");
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
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about");
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

export async function deleteCertificationAction(id: string) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await deleteCertification(id);
  revalidatePath("/skills");
  revalidatePath("/about");
  revalidatePath("/admin/certifications");
  return { success: true, message: "Certification deleted successfully!" };
}

// 9. Experience Actions
export async function addExperienceAction(data: {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string[];
  orderIndex: number;
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  const newExp = await addExperienceItem(data);
  revalidatePath("/about");
  revalidatePath("/resume");
  revalidatePath("/admin/experience");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Experience entry added successfully!", data: newExp };
}

export async function updateExperienceAction(
  id: string,
  data: Partial<{
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    responsibilities: string[];
    orderIndex: number;
  }>
) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  const updated = await updateExperienceItem(id, data);
  revalidatePath("/about");
  revalidatePath("/resume");
  revalidatePath("/admin/experience");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Experience entry updated successfully!", data: updated };
}

export async function deleteExperienceAction(id: string) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await deleteExperienceItem(id);
  revalidatePath("/about");
  revalidatePath("/resume");
  revalidatePath("/admin/experience");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Experience entry deleted successfully!" };
}

export async function reorderExperienceAction(items: { id: string; orderIndex: number }[]) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  for (const item of items) {
    await updateExperienceItem(item.id, { orderIndex: item.orderIndex });
  }
  revalidatePath("/about");
  revalidatePath("/resume");
  revalidatePath("/admin/experience");
  return { success: true, message: "Order updated successfully!" };
}

// 10. Education Actions
export async function addEducationAction(data: {
  degree: string;
  institution: string;
  location?: string;
  startYear: string;
  endYear: string;
  grade?: string;
  description?: string;
  orderIndex: number;
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  const newEdu = await addEducationItem(data);
  revalidatePath("/about");
  revalidatePath("/resume");
  revalidatePath("/admin/education");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Education entry added successfully!", data: newEdu };
}

export async function updateEducationAction(
  id: string,
  data: Partial<{
    degree: string;
    institution: string;
    location?: string;
    startYear: string;
    endYear: string;
    grade?: string;
    description?: string;
    orderIndex: number;
  }>
) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  const updated = await updateEducationItem(id, data);
  revalidatePath("/about");
  revalidatePath("/resume");
  revalidatePath("/admin/education");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Education entry updated successfully!", data: updated };
}

export async function deleteEducationAction(id: string) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  await deleteEducationItem(id);
  revalidatePath("/about");
  revalidatePath("/resume");
  revalidatePath("/admin/education");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Education entry deleted successfully!" };
}

export async function reorderEducationAction(items: { id: string; orderIndex: number }[]) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  for (const item of items) {
    await updateEducationItem(item.id, { orderIndex: item.orderIndex });
  }
  revalidatePath("/about");
  revalidatePath("/resume");
  revalidatePath("/admin/education");
  return { success: true, message: "Order updated successfully!" };
}
