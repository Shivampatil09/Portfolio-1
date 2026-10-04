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
  username: z.string().min(1, "Username / Admin ID is required"),
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

// Admin Account Security & Management Schemas
export const adminIdSchema = z
  .string()
  .min(3, "Admin ID must be at least 3 characters")
  .max(32, "Admin ID must not exceed 32 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Admin ID may only contain letters, numbers, underscores, and hyphens");

export const adminPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const adminRecoveryEmailSchema = z
  .string()
  .email("Please provide a valid recovery email address");

export const adminAccountSecuritySchema = z.object({
  username: adminIdSchema,
  recoveryEmail: adminRecoveryEmailSchema,
});

export type AdminAccountSecurityData = z.infer<typeof adminAccountSecuritySchema>;

// Account Security Mutation Schemas (Phase 3)
export const changeAdminIdSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newUsername: adminIdSchema,
});

export type ChangeAdminIdData = z.infer<typeof changeAdminIdSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: adminPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export const requestEmailChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newEmail: adminRecoveryEmailSchema,
});

export type RequestEmailChangeData = z.infer<typeof requestEmailChangeSchema>;

export const verifyEmailChangeOtpSchema = z.object({
  newEmail: adminRecoveryEmailSchema,
  otp: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers"),
  verificationId: z.string().optional(),
});

export type VerifyEmailChangeOtpData = z.infer<typeof verifyEmailChangeOtpSchema>;

// Password Recovery Schemas
export const directRecoverySchema = z.object({
  recoverySecret: z.string().min(1, "Emergency recovery secret is required"),
});

export type DirectRecoveryData = z.infer<typeof directRecoverySchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid recovery email address"),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const verifyOtpSchema = z.object({
  email: z.string().email("Please provide a valid recovery email address").optional().or(z.literal("")),
  otp: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers"),
  resetId: z.string().optional(),
});

export type VerifyOtpData = z.infer<typeof verifyOtpSchema>;

export const resetPasswordSubmitSchema = z
  .object({
    resetToken: z.string().min(1, "Reset authorization token is required"),
    newPassword: adminPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordSubmitData = z.infer<typeof resetPasswordSubmitSchema>;



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
