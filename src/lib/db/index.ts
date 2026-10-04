import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import {
  INITIAL_HERO,
  INITIAL_ABOUT,
  INITIAL_SKILLS,
  INITIAL_PROJECTS,
  INITIAL_EXPERIENCE,
  INITIAL_EDUCATION,
  INITIAL_CERTIFICATIONS,
  INITIAL_RESUME,
  HeroProfile,
  AboutDetails,
  SkillItem,
  ProjectItem,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  ContactMessage,
  ResumeDetails,
  AdminUser,
  SafeAdminUser,
  PasswordResetRecord,
  EmailVerificationRecord,
} from "./initial-data";
import { eq, sql, and, desc } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────
// Fallback in-memory state ONLY used when DATABASE_URL is not configured
// ─────────────────────────────────────────────────────────────────
let inMemoryHero: HeroProfile = { ...INITIAL_HERO };
let inMemoryAbout: AboutDetails = { ...INITIAL_ABOUT };
let inMemorySkills: SkillItem[] = [...INITIAL_SKILLS];
let inMemoryProjects: ProjectItem[] = [...INITIAL_PROJECTS];
let inMemoryExperience: ExperienceItem[] = [...INITIAL_EXPERIENCE];
let inMemoryEducation: EducationItem[] = [...INITIAL_EDUCATION];
let inMemoryCertifications: CertificationItem[] = [...INITIAL_CERTIFICATIONS];
let inMemoryMessages: ContactMessage[] = [];
let inMemoryResume: ResumeDetails = { ...INITIAL_RESUME };

// ─────────────────────────────────────────────────────────────────
// DB instance factory
// ─────────────────────────────────────────────────────────────────
export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && url.trim().length > 0 && url.startsWith("postgresql"));
}

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!isDatabaseConfigured()) return null;
  if (_db) return _db;
  try {
    const sql = neon(process.env.DATABASE_URL!);
    _db = drizzle(sql, { schema });
    return _db;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────
// 1. Hero Profile (Single Record)
// ─────────────────────────────────────────────────────────────────
export async function getHeroProfile(): Promise<HeroProfile> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(schema.heroProfileTable).limit(1);
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          fullName: r.fullName,
          headline: r.headline,
          subHeadline: r.subHeadline,
          summary: r.summary,
          profileImageUrl: r.profileImageUrl,
          email: r.email ?? INITIAL_HERO.email,
          phone: r.phone ?? INITIAL_HERO.phone,
          location: r.location ?? INITIAL_HERO.location,
          availabilityStatus: r.availabilityStatus ?? INITIAL_HERO.availabilityStatus,
          primaryCtaText: r.primaryCtaText,
          ctaLink: r.ctaLink,
          githubUrl: r.githubUrl,
          linkedinUrl: r.linkedinUrl,
          updatedAt: r.updatedAt.toISOString(),
        };
      }
      // Insert single row once if completely empty table
      await db.insert(schema.heroProfileTable).values({
        fullName: INITIAL_HERO.fullName,
        headline: INITIAL_HERO.headline,
        subHeadline: INITIAL_HERO.subHeadline,
        summary: INITIAL_HERO.summary,
        profileImageUrl: INITIAL_HERO.profileImageUrl,
        email: INITIAL_HERO.email,
        phone: INITIAL_HERO.phone,
        location: INITIAL_HERO.location,
        availabilityStatus: INITIAL_HERO.availabilityStatus,
        primaryCtaText: INITIAL_HERO.primaryCtaText,
        ctaLink: INITIAL_HERO.ctaLink,
        githubUrl: INITIAL_HERO.githubUrl,
        linkedinUrl: INITIAL_HERO.linkedinUrl,
      });
      const seeded = await db.select().from(schema.heroProfileTable).limit(1);
      if (seeded.length > 0) {
        const r = seeded[0];
        return { ...INITIAL_HERO, id: r.id, updatedAt: r.updatedAt.toISOString() };
      }
    } catch {
      // fallthrough to in-memory if DB query failed
    }
  }
  return inMemoryHero;
}

export async function updateHeroProfile(data: Partial<HeroProfile>): Promise<HeroProfile> {
  const db = getDb();
  if (db) {
    try {
      const current = await getHeroProfile();
      await db.update(schema.heroProfileTable).set({
        fullName: data.fullName ?? current.fullName,
        headline: data.headline ?? current.headline,
        subHeadline: data.subHeadline ?? current.subHeadline,
        summary: data.summary ?? current.summary,
        profileImageUrl: data.profileImageUrl !== undefined ? data.profileImageUrl : current.profileImageUrl,
        email: data.email ?? current.email,
        phone: data.phone !== undefined ? data.phone : current.phone,
        location: data.location ?? current.location,
        availabilityStatus: data.availabilityStatus ?? current.availabilityStatus,
        primaryCtaText: data.primaryCtaText ?? current.primaryCtaText,
        ctaLink: data.ctaLink ?? current.ctaLink,
        githubUrl: data.githubUrl ?? current.githubUrl,
        linkedinUrl: data.linkedinUrl ?? current.linkedinUrl,
        updatedAt: new Date(),
      });
      return { ...current, ...data, updatedAt: new Date().toISOString() };
    } catch {
      // fallthrough
    }
  }
  inMemoryHero = { ...inMemoryHero, ...data, updatedAt: new Date().toISOString() };
  return inMemoryHero;
}

// ─────────────────────────────────────────────────────────────────
// 2. About Details (Single Record)
// ─────────────────────────────────────────────────────────────────
export async function getAboutDetails(): Promise<AboutDetails> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(schema.aboutDetailsTable).limit(1);
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          storyParagraphs: r.storyParagraphs as string[],
          bioHighlight: r.bioHighlight,
          yearsOfExperience:
            r.yearsOfExperience && r.yearsOfExperience !== "00" && r.yearsOfExperience !== "0"
              ? r.yearsOfExperience
              : "Fresher",
          projectsCompleted: r.projectsCompleted ?? "10+ Projects",
          updatedAt: r.updatedAt.toISOString(),
        };
      }
      // Insert single row once if table empty
      await db.insert(schema.aboutDetailsTable).values({
        storyParagraphs: INITIAL_ABOUT.storyParagraphs,
        bioHighlight: INITIAL_ABOUT.bioHighlight,
        yearsOfExperience: INITIAL_ABOUT.yearsOfExperience,
        projectsCompleted: INITIAL_ABOUT.projectsCompleted,
      });
      return INITIAL_ABOUT;
    } catch {
      // fallthrough
    }
  }
  return inMemoryAbout;
}

export async function updateAboutDetails(data: Partial<AboutDetails>): Promise<AboutDetails> {
  const db = getDb();
  if (db) {
    try {
      const current = await getAboutDetails();
      await db.update(schema.aboutDetailsTable).set({
        storyParagraphs: data.storyParagraphs ?? current.storyParagraphs,
        bioHighlight: data.bioHighlight ?? current.bioHighlight,
        yearsOfExperience: data.yearsOfExperience ?? current.yearsOfExperience,
        projectsCompleted: data.projectsCompleted ?? current.projectsCompleted,
        updatedAt: new Date(),
      });
      return { ...current, ...data, updatedAt: new Date().toISOString() };
    } catch {
      // fallthrough
    }
  }
  inMemoryAbout = { ...inMemoryAbout, ...data, updatedAt: new Date().toISOString() };
  return inMemoryAbout;
}

// ─────────────────────────────────────────────────────────────────
// 3. Skills (Collection Table - Returns exact DB rows, no auto-reseed)
// ─────────────────────────────────────────────────────────────────
export async function getSkills(): Promise<SkillItem[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(schema.skillsTable).orderBy(schema.skillsTable.orderIndex);
      return rows.map((r) => ({
        id: r.id,
        category: r.category as SkillItem["category"],
        name: r.name,
        icon: r.icon ?? "code",
        proficiencyLabel: r.proficiencyLabel ?? "Advanced",
        isFeatured: r.isFeatured,
        orderIndex: r.orderIndex,
      }));
    } catch {
      return [];
    }
  }
  return [...inMemorySkills].sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function addSkill(skill: Omit<SkillItem, "id">): Promise<SkillItem> {
  const db = getDb();
  if (db) {
    try {
      const inserted = await db.insert(schema.skillsTable).values({
        category: skill.category,
        name: skill.name,
        icon: skill.icon,
        proficiencyLabel: skill.proficiencyLabel,
        isFeatured: skill.isFeatured,
        orderIndex: skill.orderIndex,
      }).returning();
      if (inserted.length > 0) {
        const r = inserted[0];
        return {
          id: r.id,
          category: r.category as SkillItem["category"],
          name: r.name,
          icon: r.icon ?? "code",
          proficiencyLabel: r.proficiencyLabel ?? "Advanced",
          isFeatured: r.isFeatured,
          orderIndex: r.orderIndex,
        };
      }
    } catch {
      // fallthrough
    }
  }
  const newSkill: SkillItem = { ...skill, id: `sk-${Date.now()}` };
  inMemorySkills.push(newSkill);
  return newSkill;
}

export async function updateSkill(id: string, skill: Partial<SkillItem>): Promise<SkillItem | null> {
  const db = getDb();
  if (db) {
    try {
      await db.update(schema.skillsTable).set({
        ...(skill.category && { category: skill.category }),
        ...(skill.name && { name: skill.name }),
        ...(skill.icon !== undefined && { icon: skill.icon }),
        ...(skill.proficiencyLabel !== undefined && { proficiencyLabel: skill.proficiencyLabel }),
        ...(skill.isFeatured !== undefined && { isFeatured: skill.isFeatured }),
        ...(skill.orderIndex !== undefined && { orderIndex: skill.orderIndex }),
      }).where(eq(schema.skillsTable.id, id));
    } catch {
      // fallthrough
    }
  }
  const idx = inMemorySkills.findIndex((s) => s.id === id);
  if (idx !== -1) {
    inMemorySkills[idx] = { ...inMemorySkills[idx], ...skill };
    return inMemorySkills[idx];
  }
  return null;
}

export async function deleteSkill(id: string): Promise<boolean> {
  const db = getDb();
  if (db) {
    try {
      await db.delete(schema.skillsTable).where(eq(schema.skillsTable.id, id));
      return true;
    } catch {
      return false;
    }
  }
  inMemorySkills = inMemorySkills.filter((s) => s.id !== id);
  return true;
}

// ─────────────────────────────────────────────────────────────────
// 4. Projects (Collection Table - Returns exact DB rows, no auto-reseed)
// ─────────────────────────────────────────────────────────────────
export async function getProjects(): Promise<ProjectItem[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(schema.projectsTable).orderBy(schema.projectsTable.orderIndex);
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        shortDescription: r.shortDescription,
        fullDescription: r.fullDescription ?? undefined,
        imageUrl: r.imageUrl,
        techStack: (r.techStack as string[]) ?? [],
        githubUrl: r.githubUrl ?? undefined,
        liveDemoUrl: r.liveDemoUrl ?? undefined,
        isFeatured: r.isFeatured,
        orderIndex: r.orderIndex,
      }));
    } catch {
      return [];
    }
  }
  return [...inMemoryProjects].sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function addProject(project: Omit<ProjectItem, "id">): Promise<ProjectItem> {
  const db = getDb();
  if (db) {
    try {
      const inserted = await db.insert(schema.projectsTable).values({
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        fullDescription: project.fullDescription,
        imageUrl: project.imageUrl,
        techStack: project.techStack,
        githubUrl: project.githubUrl,
        liveDemoUrl: project.liveDemoUrl,
        isFeatured: project.isFeatured,
        orderIndex: project.orderIndex,
      }).returning();
      if (inserted.length > 0) {
        const r = inserted[0];
        return {
          id: r.id,
          title: r.title,
          slug: r.slug,
          shortDescription: r.shortDescription,
          fullDescription: r.fullDescription ?? undefined,
          imageUrl: r.imageUrl,
          techStack: r.techStack as string[],
          githubUrl: r.githubUrl ?? undefined,
          liveDemoUrl: r.liveDemoUrl ?? undefined,
          isFeatured: r.isFeatured,
          orderIndex: r.orderIndex,
        };
      }
    } catch {
      // fallthrough
    }
  }
  const newProject: ProjectItem = { ...project, id: `proj-${Date.now()}` };
  inMemoryProjects.push(newProject);
  return newProject;
}

export async function updateProject(id: string, project: Partial<ProjectItem>): Promise<ProjectItem | null> {
  const db = getDb();
  if (db) {
    try {
      await db.update(schema.projectsTable).set({
        ...(project.title && { title: project.title }),
        ...(project.slug && { slug: project.slug }),
        ...(project.shortDescription && { shortDescription: project.shortDescription }),
        ...(project.fullDescription !== undefined && { fullDescription: project.fullDescription }),
        ...(project.imageUrl !== undefined && { imageUrl: project.imageUrl }),
        ...(project.techStack && { techStack: project.techStack }),
        ...(project.githubUrl !== undefined && { githubUrl: project.githubUrl }),
        ...(project.liveDemoUrl !== undefined && { liveDemoUrl: project.liveDemoUrl }),
        ...(project.isFeatured !== undefined && { isFeatured: project.isFeatured }),
        ...(project.orderIndex !== undefined && { orderIndex: project.orderIndex }),
      }).where(eq(schema.projectsTable.id, id));
    } catch {
      // fallthrough
    }
  }
  const idx = inMemoryProjects.findIndex((p) => p.id === id);
  if (idx !== -1) {
    inMemoryProjects[idx] = { ...inMemoryProjects[idx], ...project };
    return inMemoryProjects[idx];
  }
  return null;
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = getDb();
  if (db) {
    try {
      await db.delete(schema.projectsTable).where(eq(schema.projectsTable.id, id));
      return true;
    } catch {
      return false;
    }
  }
  inMemoryProjects = inMemoryProjects.filter((p) => p.id !== id);
  return true;
}

// ─────────────────────────────────────────────────────────────────
// 5. Experience (Collection Table - Returns exact DB rows, no auto-reseed)
// ─────────────────────────────────────────────────────────────────
export async function getExperience(): Promise<ExperienceItem[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(schema.experienceTable).orderBy(schema.experienceTable.orderIndex);
      return rows.map((r) => ({
        id: r.id,
        role: r.role,
        company: r.company,
        location: r.location,
        startDate: r.startDate,
        endDate: r.endDate,
        isCurrent: r.isCurrent,
        responsibilities: (r.responsibilities as string[]) ?? [],
        orderIndex: r.orderIndex,
      }));
    } catch {
      return [];
    }
  }
  return [...inMemoryExperience].sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function addExperienceItem(item: Omit<ExperienceItem, "id">): Promise<ExperienceItem> {
  const db = getDb();
  if (db) {
    try {
      const inserted = await db.insert(schema.experienceTable).values({
        role: item.role,
        company: item.company,
        location: item.location,
        startDate: item.startDate,
        endDate: item.endDate,
        isCurrent: item.isCurrent,
        responsibilities: item.responsibilities,
        orderIndex: item.orderIndex,
      }).returning();
      if (inserted.length > 0) {
        const r = inserted[0];
        return {
          id: r.id,
          role: r.role,
          company: r.company,
          location: r.location,
          startDate: r.startDate,
          endDate: r.endDate,
          isCurrent: r.isCurrent,
          responsibilities: (r.responsibilities as string[]) ?? [],
          orderIndex: r.orderIndex,
        };
      }
    } catch {
      // fallthrough
    }
  }
  const newExp: ExperienceItem = { ...item, id: `exp-${Date.now()}` };
  inMemoryExperience.push(newExp);
  return newExp;
}

export async function updateExperienceItem(id: string, item: Partial<ExperienceItem>): Promise<ExperienceItem | null> {
  const db = getDb();
  if (db) {
    try {
      await db.update(schema.experienceTable).set({
        ...(item.role !== undefined && { role: item.role }),
        ...(item.company !== undefined && { company: item.company }),
        ...(item.location !== undefined && { location: item.location }),
        ...(item.startDate !== undefined && { startDate: item.startDate }),
        ...(item.endDate !== undefined && { endDate: item.endDate }),
        ...(item.isCurrent !== undefined && { isCurrent: item.isCurrent }),
        ...(item.responsibilities !== undefined && { responsibilities: item.responsibilities }),
        ...(item.orderIndex !== undefined && { orderIndex: item.orderIndex }),
      }).where(eq(schema.experienceTable.id, id));
    } catch {
      // fallthrough
    }
  }
  const idx = inMemoryExperience.findIndex((e) => e.id === id);
  if (idx !== -1) {
    inMemoryExperience[idx] = { ...inMemoryExperience[idx], ...item };
    return inMemoryExperience[idx];
  }
  return null;
}

export async function deleteExperienceItem(id: string): Promise<boolean> {
  const db = getDb();
  if (db) {
    try {
      await db.delete(schema.experienceTable).where(eq(schema.experienceTable.id, id));
      return true;
    } catch {
      return false;
    }
  }
  inMemoryExperience = inMemoryExperience.filter((e) => e.id !== id);
  return true;
}

// ─────────────────────────────────────────────────────────────────
// 6. Education (Collection Table - Returns exact DB rows, no auto-reseed)
// ─────────────────────────────────────────────────────────────────
export async function getEducation(): Promise<EducationItem[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(schema.educationTable).orderBy(schema.educationTable.orderIndex);
      return rows.map((r) => ({
        id: r.id,
        degree: r.degree,
        institution: r.institution,
        location: r.location ?? undefined,
        startYear: r.startYear,
        endYear: r.endYear,
        grade: r.grade ?? undefined,
        description: r.description ?? undefined,
        orderIndex: r.orderIndex,
      }));
    } catch {
      return [];
    }
  }
  return [...inMemoryEducation].sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function addEducationItem(item: Omit<EducationItem, "id">): Promise<EducationItem> {
  const db = getDb();
  if (db) {
    try {
      const inserted = await db.insert(schema.educationTable).values({
        degree: item.degree,
        institution: item.institution,
        location: item.location,
        startYear: item.startYear,
        endYear: item.endYear,
        grade: item.grade,
        description: item.description,
        orderIndex: item.orderIndex,
      }).returning();
      if (inserted.length > 0) {
        const r = inserted[0];
        return {
          id: r.id,
          degree: r.degree,
          institution: r.institution,
          location: r.location ?? undefined,
          startYear: r.startYear,
          endYear: r.endYear,
          grade: r.grade ?? undefined,
          description: r.description ?? undefined,
          orderIndex: r.orderIndex,
        };
      }
    } catch {
      // fallthrough
    }
  }
  const newEdu: EducationItem = { ...item, id: `edu-${Date.now()}` };
  inMemoryEducation.push(newEdu);
  return newEdu;
}

export async function updateEducationItem(id: string, item: Partial<EducationItem>): Promise<EducationItem | null> {
  const db = getDb();
  if (db) {
    try {
      await db.update(schema.educationTable).set({
        ...(item.degree !== undefined && { degree: item.degree }),
        ...(item.institution !== undefined && { institution: item.institution }),
        ...(item.location !== undefined && { location: item.location }),
        ...(item.startYear !== undefined && { startYear: item.startYear }),
        ...(item.endYear !== undefined && { endYear: item.endYear }),
        ...(item.grade !== undefined && { grade: item.grade }),
        ...(item.description !== undefined && { description: item.description }),
        ...(item.orderIndex !== undefined && { orderIndex: item.orderIndex }),
      }).where(eq(schema.educationTable.id, id));
    } catch {
      // fallthrough
    }
  }
  const idx = inMemoryEducation.findIndex((e) => e.id === id);
  if (idx !== -1) {
    inMemoryEducation[idx] = { ...inMemoryEducation[idx], ...item };
    return inMemoryEducation[idx];
  }
  return null;
}

export async function deleteEducationItem(id: string): Promise<boolean> {
  const db = getDb();
  if (db) {
    try {
      await db.delete(schema.educationTable).where(eq(schema.educationTable.id, id));
      return true;
    } catch {
      return false;
    }
  }
  inMemoryEducation = inMemoryEducation.filter((e) => e.id !== id);
  return true;
}

// ─────────────────────────────────────────────────────────────────
// 7. Certifications (Collection Table - Returns exact DB rows, no auto-reseed)
// ─────────────────────────────────────────────────────────────────
export async function getCertifications(): Promise<CertificationItem[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(schema.certificationsTable).orderBy(schema.certificationsTable.orderIndex);
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        issuer: r.issuer,
        issueDate: r.issueDate,
        credentialUrl: r.credentialUrl ?? undefined,
        credentialId: r.credentialId ?? undefined,
        certificateFileUrl: r.certificateFileUrl,
        fileType: (r.fileType as "image" | "pdf") ?? "image",
        description: r.description ?? undefined,
        badgeIcon: r.badgeIcon ?? undefined,
        orderIndex: r.orderIndex,
      }));
    } catch {
      return [];
    }
  }
  return [...inMemoryCertifications].sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function addCertification(cert: Omit<CertificationItem, "id">): Promise<CertificationItem> {
  const db = getDb();
  if (db) {
    try {
      const inserted = await db.insert(schema.certificationsTable).values({
        title: cert.title,
        issuer: cert.issuer,
        issueDate: cert.issueDate,
        credentialUrl: cert.credentialUrl,
        credentialId: cert.credentialId,
        certificateFileUrl: cert.certificateFileUrl,
        fileType: cert.fileType ?? "image",
        description: cert.description,
        badgeIcon: cert.badgeIcon,
        orderIndex: cert.orderIndex,
      }).returning();
      if (inserted.length > 0) {
        const r = inserted[0];
        return {
          id: r.id,
          title: r.title,
          issuer: r.issuer,
          issueDate: r.issueDate,
          credentialUrl: r.credentialUrl ?? undefined,
          credentialId: r.credentialId ?? undefined,
          certificateFileUrl: r.certificateFileUrl,
          fileType: (r.fileType as "image" | "pdf") ?? "image",
          description: r.description ?? undefined,
          badgeIcon: r.badgeIcon ?? undefined,
          orderIndex: r.orderIndex,
        };
      }
    } catch {
      // fallthrough
    }
  }
  const newCert: CertificationItem = { ...cert, id: `cert-${Date.now()}` };
  inMemoryCertifications.push(newCert);
  return newCert;
}

export async function updateCertification(id: string, cert: Partial<CertificationItem>): Promise<CertificationItem | null> {
  const db = getDb();
  if (db) {
    try {
      await db.update(schema.certificationsTable).set({
        ...(cert.title && { title: cert.title }),
        ...(cert.issuer && { issuer: cert.issuer }),
        ...(cert.issueDate && { issueDate: cert.issueDate }),
        ...(cert.credentialUrl !== undefined && { credentialUrl: cert.credentialUrl }),
        ...(cert.credentialId !== undefined && { credentialId: cert.credentialId }),
        ...(cert.certificateFileUrl !== undefined && { certificateFileUrl: cert.certificateFileUrl }),
        ...(cert.fileType !== undefined && { fileType: cert.fileType }),
        ...(cert.description !== undefined && { description: cert.description }),
        ...(cert.badgeIcon !== undefined && { badgeIcon: cert.badgeIcon }),
        ...(cert.orderIndex !== undefined && { orderIndex: cert.orderIndex }),
      }).where(eq(schema.certificationsTable.id, id));
    } catch {
      // fallthrough
    }
  }
  const idx = inMemoryCertifications.findIndex((c) => c.id === id);
  if (idx !== -1) {
    inMemoryCertifications[idx] = { ...inMemoryCertifications[idx], ...cert };
    return inMemoryCertifications[idx];
  }
  return null;
}

export async function deleteCertification(id: string): Promise<boolean> {
  const db = getDb();
  if (db) {
    try {
      await db.delete(schema.certificationsTable).where(eq(schema.certificationsTable.id, id));
      return true;
    } catch {
      return false;
    }
  }
  inMemoryCertifications = inMemoryCertifications.filter((c) => c.id !== id);
  return true;
}

// ─────────────────────────────────────────────────────────────────
// 8. Resume (Single Record)
// ─────────────────────────────────────────────────────────────────
export async function getResume(): Promise<ResumeDetails> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(schema.resumeTable).limit(1);
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          pdfUrl: r.pdfUrl,
          title: r.title,
          summary: r.summary ?? "",
          originalFileName: r.originalFileName,
          displayFileName: r.displayFileName ?? "Shivam_Patil_Resume.pdf",
          fileSize: r.fileSize,
          updatedAt: r.updatedAt.toISOString(),
        };
      }
      await db.insert(schema.resumeTable).values({
        pdfUrl: INITIAL_RESUME.pdfUrl,
        title: INITIAL_RESUME.title,
        summary: INITIAL_RESUME.summary,
        displayFileName: INITIAL_RESUME.displayFileName,
      });
      return INITIAL_RESUME;
    } catch {
      // fallthrough
    }
  }
  return inMemoryResume;
}

export async function updateResume(data: Partial<ResumeDetails>): Promise<ResumeDetails> {
  const db = getDb();
  if (db) {
    try {
      const current = await getResume();
      const updatedFields: any = {
        updatedAt: new Date(),
      };
      if (data.pdfUrl !== undefined) updatedFields.pdfUrl = data.pdfUrl;
      if (data.title !== undefined) updatedFields.title = data.title;
      if (data.summary !== undefined) updatedFields.summary = data.summary;
      if (data.originalFileName !== undefined) updatedFields.originalFileName = data.originalFileName;
      if (data.displayFileName !== undefined) updatedFields.displayFileName = data.displayFileName;
      if (data.fileSize !== undefined) updatedFields.fileSize = data.fileSize;

      await db.update(schema.resumeTable).set(updatedFields);
      return { ...current, ...data, updatedAt: new Date().toISOString() };
    } catch {
      // fallthrough
    }
  }
  inMemoryResume = { ...inMemoryResume, ...data, updatedAt: new Date().toISOString() };
  return inMemoryResume;
}

export async function deleteResume(): Promise<boolean> {
  const db = getDb();
  if (db) {
    try {
      await db.update(schema.resumeTable).set({
        pdfUrl: null,
        originalFileName: null,
        fileSize: null,
        updatedAt: new Date(),
      });
      return true;
    } catch {
      return false;
    }
  }
  inMemoryResume = {
    ...inMemoryResume,
    pdfUrl: null,
    originalFileName: null,
    fileSize: null,
    updatedAt: new Date().toISOString(),
  };
  return true;
}

// ─────────────────────────────────────────────────────────────────
// 9. Contact Messages (Collection Table - Returns exact DB rows)
// ─────────────────────────────────────────────────────────────────
export async function getContactMessages(): Promise<ContactMessage[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(schema.contactMessagesTable).orderBy(schema.contactMessagesTable.createdAt);
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        message: r.message,
        ipAddress: r.ipAddress,
        isRead: r.isRead,
        isArchived: r.isArchived,
        createdAt: r.createdAt.toISOString(),
      })).reverse(); // newest first
    } catch {
      return [];
    }
  }
  return [...inMemoryMessages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createContactMessage(data: { name: string; email: string; message: string; ipAddress?: string }): Promise<ContactMessage> {
  const db = getDb();
  if (db) {
    try {
      const inserted = await db.insert(schema.contactMessagesTable).values({
        name: data.name,
        email: data.email,
        message: data.message,
        ipAddress: data.ipAddress,
      }).returning();
      if (inserted.length > 0) {
        const r = inserted[0];
        return {
          id: r.id,
          name: r.name,
          email: r.email,
          message: r.message,
          ipAddress: r.ipAddress,
          isRead: r.isRead,
          isArchived: r.isArchived,
          createdAt: r.createdAt.toISOString(),
        };
      }
    } catch {
      // fallthrough
    }
  }
  const msg: ContactMessage = {
    id: `msg-${Date.now()}`,
    name: data.name,
    email: data.email,
    message: data.message,
    ipAddress: data.ipAddress ?? null,
    isRead: false,
    isArchived: false,
    createdAt: new Date().toISOString(),
  };
  inMemoryMessages.unshift(msg);
  return msg;
}

export async function markMessageRead(id: string, isRead: boolean = true): Promise<boolean> {
  const db = getDb();
  if (db) {
    try {
      await db.update(schema.contactMessagesTable).set({ isRead }).where(eq(schema.contactMessagesTable.id, id));
      return true;
    } catch {
      return false;
    }
  }
  const msg = inMemoryMessages.find((m) => m.id === id);
  if (!msg) return false;
  msg.isRead = isRead;
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const db = getDb();
  if (db) {
    try {
      await db.delete(schema.contactMessagesTable).where(eq(schema.contactMessagesTable.id, id));
      return true;
    } catch {
      return false;
    }
  }
  inMemoryMessages = inMemoryMessages.filter((m) => m.id !== id);
  return true;
}

// ─────────────────────────────────────────────────────────────────
// 10. Admin Accounts (Security & Authentication)
// ─────────────────────────────────────────────────────────────────
export class DatabaseQueryError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "DatabaseQueryError";
  }
}

let inMemoryAdmin: AdminUser | null = null;

export async function getAdminUserCount(): Promise<number> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (!db) {
      throw new DatabaseQueryError("Database is configured but client could not be initialized");
    }
    try {
      const rows = await db.select({ count: sql<number>`count(*)` }).from(schema.adminUsersTable);
      return Number(rows[0]?.count ?? 0);
    } catch (err) {
      throw new DatabaseQueryError("Failed to query admin users count from database", err);
    }
  }

  if (process.env.NODE_ENV === "production") {
    throw new DatabaseQueryError("Database is not configured in production environment");
  }

  return inMemoryAdmin ? 1 : 0;
}

export async function getAdminUserByUsername(username: string): Promise<AdminUser | null> {
  const cleanUsername = username.trim();
  if (!cleanUsername) return null;

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (!db) {
      throw new DatabaseQueryError("Database is configured but client could not be initialized");
    }
    try {
      const rows = await db
        .select()
        .from(schema.adminUsersTable)
        .where(eq(schema.adminUsersTable.username, cleanUsername))
        .limit(1);
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          username: r.username,
          passwordHash: r.passwordHash,
          recoveryEmail: r.recoveryEmail,
          status: (r.status as "active" | "locked" | "inactive") || "active",
          tokenVersion: r.tokenVersion ?? 1,
          lastLoginAt: r.lastLoginAt ? r.lastLoginAt.toISOString() : null,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        };
      }
      return null; // Genuinely no record found
    } catch (err) {
      throw new DatabaseQueryError("Failed to query admin user by username", err);
    }
  }

  if (process.env.NODE_ENV === "production") {
    throw new DatabaseQueryError("Database is not configured in production environment");
  }

  if (inMemoryAdmin && inMemoryAdmin.username.toLowerCase() === cleanUsername.toLowerCase()) {
    return inMemoryAdmin;
  }
  return null;
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  const cleanId = id.trim();
  if (!cleanId) return null;

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (!db) {
      throw new DatabaseQueryError("Database is configured but client could not be initialized");
    }
    try {
      const rows = await db
        .select()
        .from(schema.adminUsersTable)
        .where(eq(schema.adminUsersTable.id, cleanId))
        .limit(1);
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          username: r.username,
          passwordHash: r.passwordHash,
          recoveryEmail: r.recoveryEmail,
          status: (r.status as "active" | "locked" | "inactive") || "active",
          tokenVersion: r.tokenVersion ?? 1,
          lastLoginAt: r.lastLoginAt ? r.lastLoginAt.toISOString() : null,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        };
      }
      return null;
    } catch (err) {
      throw new DatabaseQueryError("Failed to query admin user by ID", err);
    }
  }

  if (process.env.NODE_ENV === "production") {
    throw new DatabaseQueryError("Database is not configured in production environment");
  }

  if (inMemoryAdmin && inMemoryAdmin.id === cleanId) {
    return inMemoryAdmin;
  }
  return null;
}

export async function getFirstAdminUser(): Promise<AdminUser | null> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (!db) return null;
    try {
      const rows = await db.select().from(schema.adminUsersTable).limit(1);
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          username: r.username,
          passwordHash: r.passwordHash,
          recoveryEmail: r.recoveryEmail,
          status: (r.status as "active" | "locked" | "inactive") || "active",
          tokenVersion: r.tokenVersion ?? 1,
          lastLoginAt: r.lastLoginAt ? r.lastLoginAt.toISOString() : null,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  if (inMemoryAdmin) return inMemoryAdmin;
  return null;
}

export async function getSafeAdminUser(username?: string): Promise<SafeAdminUser | null> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (!db) return null;
    try {
      let query = db.select().from(schema.adminUsersTable);
      if (username) {
        const rows = await query.where(eq(schema.adminUsersTable.username, username.trim())).limit(1);
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            username: r.username,
            recoveryEmail: r.recoveryEmail,
            status: (r.status as "active" | "locked" | "inactive") || "active",
            tokenVersion: r.tokenVersion ?? 1,
            lastLoginAt: r.lastLoginAt ? r.lastLoginAt.toISOString() : null,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          };
        }
      } else {
        const rows = await query.limit(1);
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            username: r.username,
            recoveryEmail: r.recoveryEmail,
            status: (r.status as "active" | "locked" | "inactive") || "active",
            tokenVersion: r.tokenVersion ?? 1,
            lastLoginAt: r.lastLoginAt ? r.lastLoginAt.toISOString() : null,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  if (process.env.NODE_ENV === "production") return null;

  if (inMemoryAdmin) {
    return {
      id: inMemoryAdmin.id,
      username: inMemoryAdmin.username,
      recoveryEmail: inMemoryAdmin.recoveryEmail,
      status: inMemoryAdmin.status,
      tokenVersion: inMemoryAdmin.tokenVersion ?? 1,
      lastLoginAt: inMemoryAdmin.lastLoginAt,
      createdAt: inMemoryAdmin.createdAt,
      updatedAt: inMemoryAdmin.updatedAt,
    };
  }
  return null;
}

export async function createAdminUser(data: {
  username: string;
  passwordHash: string;
  recoveryEmail?: string;
  status?: string;
}): Promise<AdminUser | null> {
  const cleanUsername = data.username.trim();

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (!db) {
      throw new DatabaseQueryError("Database is configured but client could not be initialized");
    }
    try {
      // Atomic conditional insert: only insert if no admin user exists in admin_users table
      const result = await db.execute(sql`
        INSERT INTO ${schema.adminUsersTable} (
          "username",
          "password_hash",
          "recovery_email",
          "status",
          "token_version"
        )
        SELECT
          ${cleanUsername},
          ${data.passwordHash},
          ${data.recoveryEmail || "patilshivam1280@gmail.com"},
          ${data.status || "active"},
          1
        WHERE NOT EXISTS (
          SELECT 1 FROM ${schema.adminUsersTable}
        )
        RETURNING "id", "username", "password_hash", "recovery_email", "status", "token_version", "last_login_at", "created_at", "updated_at";
      `);

      const rows = (result.rows || []) as any[];
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          username: r.username,
          passwordHash: r.password_hash,
          recoveryEmail: r.recovery_email,
          status: (r.status as "active" | "locked" | "inactive") || "active",
          tokenVersion: r.token_version ?? 1,
          lastLoginAt: r.last_login_at ? new Date(r.last_login_at).toISOString() : null,
          createdAt: new Date(r.created_at).toISOString(),
          updatedAt: new Date(r.updated_at).toISOString(),
        };
      }
      // Zero rows returned means another bootstrap process already created the account
      return null;
    } catch (err) {
      throw new DatabaseQueryError("Failed to create admin user in database", err);
    }
  }

  if (process.env.NODE_ENV === "production") {
    throw new DatabaseQueryError("Database is not configured in production environment");
  }

  // In-memory fallback (development only)
  if (inMemoryAdmin) {
    return null; // Atomic: only 1 admin account permitted
  }

  inMemoryAdmin = {
    id: `admin-${Date.now()}`,
    username: cleanUsername,
    passwordHash: data.passwordHash,
    recoveryEmail: data.recoveryEmail || "patilshivam1280@gmail.com",
    status: (data.status as "active" | "locked" | "inactive") || "active",
    tokenVersion: 1,
    lastLoginAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return inMemoryAdmin;
}

export async function recordAdminLoginSuccess(id: string): Promise<boolean> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        await db
          .update(schema.adminUsersTable)
          .set({
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(schema.adminUsersTable.id, id));
        return true;
      } catch {
        return false;
      }
    }
  }

  if (inMemoryAdmin && inMemoryAdmin.id === id) {
    inMemoryAdmin.lastLoginAt = new Date().toISOString();
    inMemoryAdmin.updatedAt = new Date().toISOString();
    return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────
// 11. Password Reset & OTP Operations
// ─────────────────────────────────────────────────────────────────
let inMemoryResets: PasswordResetRecord[] = [];

export async function getAdminUserByRecoveryEmail(email: string): Promise<AdminUser | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return null;

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        const rows = await db
          .select()
          .from(schema.adminUsersTable)
          .where(sql`lower(${schema.adminUsersTable.recoveryEmail}) = ${cleanEmail}`)
          .limit(1);
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            username: r.username,
            passwordHash: r.passwordHash,
            recoveryEmail: r.recoveryEmail,
            status: (r.status as "active" | "locked" | "inactive") || "active",
            tokenVersion: r.tokenVersion ?? 1,
            lastLoginAt: r.lastLoginAt ? r.lastLoginAt.toISOString() : null,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          };
        }
        return null;
      } catch {
        return null;
      }
    }
  }

  if (inMemoryAdmin && inMemoryAdmin.recoveryEmail.toLowerCase() === cleanEmail) {
    return inMemoryAdmin;
  }
  return null;
}

export async function createPasswordResetRequest(data: {
  adminId: string;
  email: string;
  otpHash: string;
  expiresAt: Date;
  resendAvailableAt: Date;
}): Promise<PasswordResetRecord | null> {
  const cleanEmail = data.email.trim().toLowerCase();

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        // Invalidate any existing pending resets for this admin
        await db
          .update(schema.adminPasswordResetsTable)
          .set({ isConsumed: true })
          .where(
            and(
              eq(schema.adminPasswordResetsTable.adminId, data.adminId),
              eq(schema.adminPasswordResetsTable.isConsumed, false)
            )
          );

        const inserted = await db
          .insert(schema.adminPasswordResetsTable)
          .values({
            adminId: data.adminId,
            email: cleanEmail,
            otpHash: data.otpHash,
            expiresAt: data.expiresAt,
            resendAvailableAt: data.resendAvailableAt,
            attempts: 0,
            maxAttempts: 5,
            isConsumed: false,
          })
          .returning();

        if (inserted.length > 0) {
          const r = inserted[0];
          return {
            id: r.id,
            adminId: r.adminId,
            email: r.email,
            otpHash: r.otpHash,
            resetToken: r.resetToken,
            attempts: r.attempts,
            maxAttempts: r.maxAttempts,
            resendAvailableAt: r.resendAvailableAt.toISOString(),
            expiresAt: r.expiresAt.toISOString(),
            isConsumed: r.isConsumed,
            createdAt: r.createdAt.toISOString(),
          };
        }
      } catch {
        // Fall through to in-memory handling if table does not exist yet
      }
    }
  }

  // Invalidate any in-memory pending resets for this admin
  inMemoryResets = inMemoryResets.map((item) =>
    item.adminId === data.adminId ? { ...item, isConsumed: true } : item
  );

  const resetRecord: PasswordResetRecord = {
    id: `reset-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    adminId: data.adminId,
    email: cleanEmail,
    otpHash: data.otpHash,
    resetToken: null,
    attempts: 0,
    maxAttempts: 5,
    resendAvailableAt: data.resendAvailableAt.toISOString(),
    expiresAt: data.expiresAt.toISOString(),
    isConsumed: false,
    createdAt: new Date().toISOString(),
  };
  inMemoryResets.push(resetRecord);
  return resetRecord;
}

export async function getActivePasswordReset(identifier: {
  id?: string;
  email?: string;
  adminId?: string;
}): Promise<PasswordResetRecord | null> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        let query = db
          .select()
          .from(schema.adminPasswordResetsTable)
          .where(eq(schema.adminPasswordResetsTable.isConsumed, false))
          .orderBy(desc(schema.adminPasswordResetsTable.createdAt))
          .limit(1);

        if (identifier.id) {
          query = db
            .select()
            .from(schema.adminPasswordResetsTable)
            .where(
              and(
                eq(schema.adminPasswordResetsTable.id, identifier.id),
                eq(schema.adminPasswordResetsTable.isConsumed, false)
              )
            )
            .limit(1);
        } else if (identifier.adminId) {
          query = db
            .select()
            .from(schema.adminPasswordResetsTable)
            .where(
              and(
                eq(schema.adminPasswordResetsTable.adminId, identifier.adminId),
                eq(schema.adminPasswordResetsTable.isConsumed, false)
              )
            )
            .orderBy(desc(schema.adminPasswordResetsTable.createdAt))
            .limit(1);
        } else if (identifier.email) {
          query = db
            .select()
            .from(schema.adminPasswordResetsTable)
            .where(
              and(
                sql`lower(${schema.adminPasswordResetsTable.email}) = ${identifier.email.trim().toLowerCase()}`,
                eq(schema.adminPasswordResetsTable.isConsumed, false)
              )
            )
            .orderBy(desc(schema.adminPasswordResetsTable.createdAt))
            .limit(1);
        }

        const rows = await query;
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            adminId: r.adminId,
            email: r.email,
            otpHash: r.otpHash,
            resetToken: r.resetToken,
            attempts: r.attempts,
            maxAttempts: r.maxAttempts,
            resendAvailableAt: r.resendAvailableAt.toISOString(),
            expiresAt: r.expiresAt.toISOString(),
            isConsumed: r.isConsumed,
            createdAt: r.createdAt.toISOString(),
          };
        }
        return null;
      } catch {
        // Fall through to in-memory lookup
      }
    }
  }

  const found = inMemoryResets
    .filter((r) => {
      if (r.isConsumed) return false;
      if (identifier.id && r.id !== identifier.id) return false;
      if (identifier.adminId && r.adminId !== identifier.adminId) return false;
      if (identifier.email && r.email.toLowerCase() !== identifier.email.trim().toLowerCase()) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  return found || null;
}

export async function incrementPasswordResetAttempts(id: string): Promise<number> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        const updated = await db
          .update(schema.adminPasswordResetsTable)
          .set({ attempts: sql`${schema.adminPasswordResetsTable.attempts} + 1` })
          .where(eq(schema.adminPasswordResetsTable.id, id))
          .returning({ attempts: schema.adminPasswordResetsTable.attempts });
        if (updated.length > 0) {
          return updated[0].attempts;
        }
      } catch {
        // fall through
      }
    }
  }

  const item = inMemoryResets.find((r) => r.id === id);
  if (item) {
    item.attempts += 1;
    return item.attempts;
  }
  return 1;
}

export async function savePasswordResetToken(id: string, resetToken: string): Promise<boolean> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        await db
          .update(schema.adminPasswordResetsTable)
          .set({ resetToken })
          .where(eq(schema.adminPasswordResetsTable.id, id));
        return true;
      } catch {
        // fall through
      }
    }
  }

  const item = inMemoryResets.find((r) => r.id === id);
  if (item) {
    item.resetToken = resetToken;
    return true;
  }
  return false;
}

export async function getPasswordResetByToken(resetToken: string): Promise<PasswordResetRecord | null> {
  const cleanToken = resetToken.trim();
  if (!cleanToken) return null;

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        const rows = await db
          .select()
          .from(schema.adminPasswordResetsTable)
          .where(
            and(
              eq(schema.adminPasswordResetsTable.resetToken, cleanToken),
              eq(schema.adminPasswordResetsTable.isConsumed, false)
            )
          )
          .limit(1);
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            adminId: r.adminId,
            email: r.email,
            otpHash: r.otpHash,
            resetToken: r.resetToken,
            attempts: r.attempts,
            maxAttempts: r.maxAttempts,
            resendAvailableAt: r.resendAvailableAt.toISOString(),
            expiresAt: r.expiresAt.toISOString(),
            isConsumed: r.isConsumed,
            createdAt: r.createdAt.toISOString(),
          };
        }
        return null;
      } catch {
        // fall through
      }
    }
  }

  const item = inMemoryResets.find(
    (r) => r.resetToken === cleanToken && !r.isConsumed
  );
  return item || null;
}

export async function completePasswordReset(
  resetId: string,
  adminId: string,
  newPasswordHash: string
): Promise<boolean> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        // 1. Update password hash and increment tokenVersion on admin_users to revoke all active JWT sessions
        await db
          .update(schema.adminUsersTable)
          .set({
            passwordHash: newPasswordHash,
            tokenVersion: sql`${schema.adminUsersTable.tokenVersion} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(schema.adminUsersTable.id, adminId));

        // 2. Invalidate all reset tokens for this admin
        await db
          .update(schema.adminPasswordResetsTable)
          .set({ isConsumed: true })
          .where(eq(schema.adminPasswordResetsTable.adminId, adminId));

        return true;
      } catch {
        // fall through
      }
    }
  }

  if (inMemoryAdmin && inMemoryAdmin.id === adminId) {
    inMemoryAdmin.passwordHash = newPasswordHash;
    inMemoryAdmin.tokenVersion = (inMemoryAdmin.tokenVersion ?? 1) + 1;
    inMemoryAdmin.updatedAt = new Date().toISOString();
  }

  inMemoryResets = inMemoryResets.map((r) =>
    r.adminId === adminId ? { ...r, isConsumed: true } : r
  );
  return true;
}

// ─────────────────────────────────────────────────────────────────
// 12. Account Security & Recovery Email Verifications (Phase 3)
// ─────────────────────────────────────────────────────────────────

export async function updateAdminUsername(
  adminId: string,
  newUsername: string
): Promise<boolean> {
  const cleanUsername = newUsername.trim();
  if (!cleanUsername) return false;

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        await db
          .update(schema.adminUsersTable)
          .set({
            username: cleanUsername,
            updatedAt: new Date(),
          })
          .where(eq(schema.adminUsersTable.id, adminId));
        return true;
      } catch (err) {
        throw new DatabaseQueryError("Failed to update admin username in database", err);
      }
    }
  }

  if (inMemoryAdmin && inMemoryAdmin.id === adminId) {
    inMemoryAdmin.username = cleanUsername;
    inMemoryAdmin.updatedAt = new Date().toISOString();
    return true;
  }
  return false;
}

export async function updateAdminPassword(
  adminId: string,
  newPasswordHash: string
): Promise<number> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        const updated = await db
          .update(schema.adminUsersTable)
          .set({
            passwordHash: newPasswordHash,
            tokenVersion: sql`${schema.adminUsersTable.tokenVersion} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(schema.adminUsersTable.id, adminId))
          .returning({ tokenVersion: schema.adminUsersTable.tokenVersion });

        if (updated.length > 0) {
          return updated[0].tokenVersion;
        }
      } catch (err) {
        throw new DatabaseQueryError("Failed to update admin password in database", err);
      }
    }
  }

  if (inMemoryAdmin && inMemoryAdmin.id === adminId) {
    inMemoryAdmin.passwordHash = newPasswordHash;
    inMemoryAdmin.tokenVersion = (inMemoryAdmin.tokenVersion ?? 1) + 1;
    inMemoryAdmin.updatedAt = new Date().toISOString();
    return inMemoryAdmin.tokenVersion;
  }
  return 2;
}

let inMemoryEmailVerifications: EmailVerificationRecord[] = [];

export async function createEmailVerificationRequest(data: {
  adminId: string;
  newEmail: string;
  otpHash: string;
  expiresAt: Date;
  resendAvailableAt: Date;
}): Promise<EmailVerificationRecord | null> {
  const cleanEmail = data.newEmail.trim().toLowerCase();

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        // Invalidate any pending email verifications for this admin
        await db
          .update(schema.adminEmailVerificationsTable)
          .set({ isConsumed: true })
          .where(
            and(
              eq(schema.adminEmailVerificationsTable.adminId, data.adminId),
              eq(schema.adminEmailVerificationsTable.isConsumed, false)
            )
          );

        const inserted = await db
          .insert(schema.adminEmailVerificationsTable)
          .values({
            adminId: data.adminId,
            newEmail: cleanEmail,
            otpHash: data.otpHash,
            expiresAt: data.expiresAt,
            resendAvailableAt: data.resendAvailableAt,
            attempts: 0,
            maxAttempts: 5,
            isConsumed: false,
          })
          .returning();

        if (inserted.length > 0) {
          const r = inserted[0];
          return {
            id: r.id,
            adminId: r.adminId,
            newEmail: r.newEmail,
            otpHash: r.otpHash,
            attempts: r.attempts,
            maxAttempts: r.maxAttempts,
            resendAvailableAt: r.resendAvailableAt.toISOString(),
            expiresAt: r.expiresAt.toISOString(),
            isConsumed: r.isConsumed,
            createdAt: r.createdAt.toISOString(),
          };
        }
      } catch {
        // Fall through to in-memory handling
      }
    }
  }

  inMemoryEmailVerifications = inMemoryEmailVerifications.map((item) =>
    item.adminId === data.adminId ? { ...item, isConsumed: true } : item
  );

  const verificationRecord: EmailVerificationRecord = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    adminId: data.adminId,
    newEmail: cleanEmail,
    otpHash: data.otpHash,
    attempts: 0,
    maxAttempts: 5,
    resendAvailableAt: data.resendAvailableAt.toISOString(),
    expiresAt: data.expiresAt.toISOString(),
    isConsumed: false,
    createdAt: new Date().toISOString(),
  };
  inMemoryEmailVerifications.push(verificationRecord);
  return verificationRecord;
}

export async function getActiveEmailVerification(identifier: {
  id?: string;
  adminId?: string;
  newEmail?: string;
}): Promise<EmailVerificationRecord | null> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        let query = db
          .select()
          .from(schema.adminEmailVerificationsTable)
          .where(eq(schema.adminEmailVerificationsTable.isConsumed, false))
          .orderBy(desc(schema.adminEmailVerificationsTable.createdAt))
          .limit(1);

        if (identifier.id) {
          query = db
            .select()
            .from(schema.adminEmailVerificationsTable)
            .where(
              and(
                eq(schema.adminEmailVerificationsTable.id, identifier.id),
                eq(schema.adminEmailVerificationsTable.isConsumed, false)
              )
            )
            .limit(1);
        } else if (identifier.adminId) {
          query = db
            .select()
            .from(schema.adminEmailVerificationsTable)
            .where(
              and(
                eq(schema.adminEmailVerificationsTable.adminId, identifier.adminId),
                eq(schema.adminEmailVerificationsTable.isConsumed, false)
              )
            )
            .orderBy(desc(schema.adminEmailVerificationsTable.createdAt))
            .limit(1);
        } else if (identifier.newEmail) {
          query = db
            .select()
            .from(schema.adminEmailVerificationsTable)
            .where(
              and(
                sql`lower(${schema.adminEmailVerificationsTable.newEmail}) = ${identifier.newEmail.trim().toLowerCase()}`,
                eq(schema.adminEmailVerificationsTable.isConsumed, false)
              )
            )
            .orderBy(desc(schema.adminEmailVerificationsTable.createdAt))
            .limit(1);
        }

        const rows = await query;
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            adminId: r.adminId,
            newEmail: r.newEmail,
            otpHash: r.otpHash,
            attempts: r.attempts,
            maxAttempts: r.maxAttempts,
            resendAvailableAt: r.resendAvailableAt.toISOString(),
            expiresAt: r.expiresAt.toISOString(),
            isConsumed: r.isConsumed,
            createdAt: r.createdAt.toISOString(),
          };
        }
        return null;
      } catch {
        // Fall through to in-memory lookup
      }
    }
  }

  const found = inMemoryEmailVerifications
    .filter((r) => {
      if (r.isConsumed) return false;
      if (identifier.id && r.id !== identifier.id) return false;
      if (identifier.adminId && r.adminId !== identifier.adminId) return false;
      if (identifier.newEmail && r.newEmail.toLowerCase() !== identifier.newEmail.trim().toLowerCase()) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  return found || null;
}

export async function incrementEmailVerificationAttempts(id: string): Promise<number> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        const updated = await db
          .update(schema.adminEmailVerificationsTable)
          .set({ attempts: sql`${schema.adminEmailVerificationsTable.attempts} + 1` })
          .where(eq(schema.adminEmailVerificationsTable.id, id))
          .returning({ attempts: schema.adminEmailVerificationsTable.attempts });
        if (updated.length > 0) {
          return updated[0].attempts;
        }
      } catch {
        // fall through
      }
    }
  }

  const item = inMemoryEmailVerifications.find((r) => r.id === id);
  if (item) {
    item.attempts += 1;
    return item.attempts;
  }
  return 1;
}

export async function confirmEmailVerification(
  verificationId: string,
  adminId: string,
  newEmail: string
): Promise<boolean> {
  const cleanEmail = newEmail.trim().toLowerCase();

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        // 1. Update recovery email on admin_users table
        await db
          .update(schema.adminUsersTable)
          .set({
            recoveryEmail: cleanEmail,
            updatedAt: new Date(),
          })
          .where(eq(schema.adminUsersTable.id, adminId));

        // 2. Mark this and any other pending verifications as consumed
        await db
          .update(schema.adminEmailVerificationsTable)
          .set({ isConsumed: true })
          .where(eq(schema.adminEmailVerificationsTable.adminId, adminId));

        return true;
      } catch (err) {
        throw new DatabaseQueryError("Failed to confirm email verification in database", err);
      }
    }
  }

  if (inMemoryAdmin && inMemoryAdmin.id === adminId) {
    inMemoryAdmin.recoveryEmail = cleanEmail;
    inMemoryAdmin.updatedAt = new Date().toISOString();
  }

  inMemoryEmailVerifications = inMemoryEmailVerifications.map((r) =>
    r.adminId === adminId ? { ...r, isConsumed: true } : r
  );
  return true;
}

export async function invalidateEmailVerification(id: string): Promise<boolean> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        await db
          .update(schema.adminEmailVerificationsTable)
          .set({ isConsumed: true })
          .where(eq(schema.adminEmailVerificationsTable.id, id));
        return true;
      } catch {
        return false;
      }
    }
  }

  inMemoryEmailVerifications = inMemoryEmailVerifications.map((item) =>
    item.id === id ? { ...item, isConsumed: true } : item
  );
  return true;
}



