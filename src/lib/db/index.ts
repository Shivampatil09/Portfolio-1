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
} from "./initial-data";
import { eq } from "drizzle-orm";

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
          yearsOfExperience: r.yearsOfExperience ?? "2+ Years",
          projectsCompleted: r.projectsCompleted ?? "10+",
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

export async function updateExperienceItem(id: string, item: Partial<ExperienceItem>): Promise<ExperienceItem | null> {
  const db = getDb();
  if (db) {
    try {
      await db.update(schema.experienceTable).set({
        ...(item.role && { role: item.role }),
        ...(item.company && { company: item.company }),
        ...(item.location && { location: item.location }),
        ...(item.startDate && { startDate: item.startDate }),
        ...(item.endDate && { endDate: item.endDate }),
        ...(item.isCurrent !== undefined && { isCurrent: item.isCurrent }),
        ...(item.responsibilities && { responsibilities: item.responsibilities }),
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

export async function updateEducationItem(id: string, item: Partial<EducationItem>): Promise<EducationItem | null> {
  const db = getDb();
  if (db) {
    try {
      await db.update(schema.educationTable).set({
        ...(item.degree && { degree: item.degree }),
        ...(item.institution && { institution: item.institution }),
        ...(item.location !== undefined && { location: item.location }),
        ...(item.startYear && { startYear: item.startYear }),
        ...(item.endYear && { endYear: item.endYear }),
        ...(item.grade !== undefined && { grade: item.grade }),
        ...(item.description !== undefined && { description: item.description }),
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
