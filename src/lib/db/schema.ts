import { pgTable, text, timestamp, boolean, integer, jsonb, uuid } from "drizzle-orm/pg-core";

// Hero & Profile Information
export const heroProfileTable = pgTable("hero_profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull().default("Shivam Patil"),
  headline: text("headline").notNull().default(".NET Full Stack Developer"),
  subHeadline: text("sub_headline").notNull().default("Building high-performance enterprise applications with ASP.NET Core & Modern React"),
  summary: text("summary").notNull().default("Passionate .NET Full Stack Engineer specializing in clean architecture, high-throughput REST APIs, C#, .NET 8, React, and SQL Server."),
  profileImageUrl: text("profile_image_url"),
  email: text("email").default("patilshivam1280@gmail.com"),
  phone: text("phone"),
  location: text("location").default("Pune, Maharashtra, India"),
  availabilityStatus: text("availability_status").default("Typically within 24 hours"),
  primaryCtaText: text("primary_cta_text").notNull().default("Work With Me"),
  ctaLink: text("cta_link").notNull().default("/contact"),
  githubUrl: text("github_url").notNull().default("https://github.com/Shivampatil09"),
  linkedinUrl: text("linkedin_url").notNull().default("https://www.linkedin.com/in/shivampatil9"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// About Section
export const aboutDetailsTable = pgTable("about_details", {
  id: uuid("id").defaultRandom().primaryKey(),
  storyParagraphs: jsonb("story_paragraphs").$type<string[]>().notNull(),
  bioHighlight: text("bio_highlight").notNull(),
  yearsOfExperience: text("years_of_experience").default("2+ Years"),
  projectsCompleted: text("projects_completed").default("15+"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Skills categorized
export const skillsTable = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: text("category").notNull(), // 'backend' | 'frontend' | 'database' | 'tools' | 'architecture'
  name: text("name").notNull(),
  icon: text("icon"), // icon key or slug
  proficiencyLabel: text("proficiency_label").default("Advanced"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Certifications
export const certificationsTable = pgTable("certifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: text("issue_date").notNull(),
  credentialUrl: text("credential_url"),
  credentialId: text("credential_id"),
  certificateFileUrl: text("certificate_file_url"),
  fileType: text("file_type").default("image"), // 'image' | 'pdf'
  description: text("description"),
  badgeIcon: text("badge_icon"),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects
export const projectsTable = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description"),
  imageUrl: text("image_url"),
  techStack: jsonb("tech_stack").$type<string[]>().notNull(),
  githubUrl: text("github_url"),
  liveDemoUrl: text("live_demo_url"),
  isFeatured: boolean("is_featured").default(true).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Experience
export const experienceTable = pgTable("experience", {
  id: uuid("id").defaultRandom().primaryKey(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(), // or 'Present'
  isCurrent: boolean("is_current").default(false).notNull(),
  responsibilities: jsonb("responsibilities").$type<string[]>().notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Education
export const educationTable = pgTable("education", {
  id: uuid("id").defaultRandom().primaryKey(),
  degree: text("degree").notNull(), // e.g. "MCA - Master of Computer Applications"
  institution: text("institution").notNull(),
  location: text("location"),
  startYear: text("start_year").notNull(),
  endYear: text("end_year").notNull(),
  grade: text("grade"),
  description: text("description"),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Resume
export const resumeTable = pgTable("resume", {
  id: uuid("id").defaultRandom().primaryKey(),
  pdfUrl: text("pdf_url"),
  title: text("title").notNull().default("Shivam Patil - .NET Full Stack Developer Resume"),
  summary: text("summary"),
  originalFileName: text("original_file_name"),
  displayFileName: text("display_file_name").default("Shivam_Patil_Resume.pdf"),
  fileSize: integer("file_size"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Contact Messages
export const contactMessagesTable = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  ipAddress: text("ip_address"),
  isRead: boolean("is_read").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Admin Users
export const adminUsersTable = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
