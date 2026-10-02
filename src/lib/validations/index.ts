import { z } from "zod";

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Admin Login Schema
export const adminLoginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

// Profile / Hero Update Schema
export const heroUpdateSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  headline: z.string().min(3, "Headline is required"),
  subHeadline: z.string().min(5, "Sub-headline is required"),
  summary: z.string().min(10, "Summary is required"),
  profileImageUrl: z.string().nullable().optional(),
  primaryCtaText: z.string().min(2, "Primary CTA text is required"),
  ctaLink: z.string().min(1, "CTA Link is required"),
  githubUrl: z.string().url("Invalid GitHub URL"),
  linkedinUrl: z.string().url("Invalid LinkedIn URL"),
});

// Skill Schema
export const skillSchema = z.object({
  category: z.enum(["backend", "frontend", "database", "tools", "architecture"]),
  name: z.string().min(1, "Skill name is required"),
  icon: z.string().default("code"),
  proficiencyLabel: z.string().min(1, "Proficiency label is required"),
  isFeatured: z.boolean().default(false),
  orderIndex: z.number().int().default(0),
});

// Project Schema
export const projectSchema = z.object({
  title: z.string().min(2, "Project title is required"),
  slug: z.string().min(2, "Slug is required"),
  shortDescription: z.string().min(10, "Short description is required"),
  fullDescription: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  techStack: z.array(z.string()).min(1, "At least one technology is required"),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveDemoUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean().default(true),
  orderIndex: z.number().int().default(0),
});

// Experience Schema
export const experienceSchema = z.object({
  role: z.string().min(2, "Role is required"),
  company: z.string().min(2, "Company is required"),
  location: z.string().min(2, "Location is required"),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().min(2, "End date is required"),
  isCurrent: z.boolean().default(false),
  responsibilities: z.array(z.string()).min(1, "At least one responsibility is required"),
  orderIndex: z.number().int().default(0),
});

// Education Schema
export const educationSchema = z.object({
  degree: z.string().min(2, "Degree is required"),
  institution: z.string().min(2, "Institution is required"),
  location: z.string().optional(),
  startYear: z.string().min(4, "Start year is required"),
  endYear: z.string().min(4, "End year is required"),
  grade: z.string().optional(),
  description: z.string().optional(),
  orderIndex: z.number().int().default(0),
});

// Certification Schema
export const certificationSchema = z.object({
  title: z.string().min(2, "Certification title is required"),
  issuer: z.string().min(2, "Issuer is required"),
  issueDate: z.string().min(2, "Issue date is required"),
  credentialUrl: z.string().url().optional().or(z.literal("")),
  credentialId: z.string().optional(),
  badgeIcon: z.string().optional(),
  orderIndex: z.number().int().default(0),
});
