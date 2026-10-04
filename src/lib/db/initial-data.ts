export interface HeroProfile {
  id: string;
  fullName: string;
  headline: string;
  subHeadline: string;
  summary: string;
  profileImageUrl: string | null;
  email: string;
  phone?: string | null;
  location: string;
  availabilityStatus: string;
  primaryCtaText: string;
  ctaLink: string;
  githubUrl: string;
  linkedinUrl: string;
  updatedAt: string;
}

export interface AboutDetails {
  id: string;
  storyParagraphs: string[];
  bioHighlight: string;
  yearsOfExperience: string;
  projectsCompleted: string;
  updatedAt: string;
}

export interface SkillItem {
  id: string;
  category: "backend" | "frontend" | "database" | "tools" | "architecture";
  name: string;
  icon: string;
  proficiencyLabel: string;
  isFeatured: boolean;
  orderIndex: number;
}

export interface ProjectItem {
  id: string;
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
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string[];
  orderIndex: number;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startYear: string;
  endYear: string;
  grade?: string;
  description?: string;
  orderIndex: number;
}

export interface CertificationItem {
  id: string;
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
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  ipAddress?: string | null;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  recoveryEmail: string;
  status: "active" | "locked" | "inactive";
  tokenVersion: number;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SafeAdminUser {
  id: string;
  username: string;
  recoveryEmail: string;
  status: "active" | "locked" | "inactive";
  tokenVersion: number;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PasswordResetRecord {
  id: string;
  adminId: string;
  email: string;
  otpHash: string;
  resetToken?: string | null;
  attempts: number;
  maxAttempts: number;
  resendAvailableAt: string;
  expiresAt: string;
  isConsumed: boolean;
  createdAt: string;
}

export interface EmailVerificationRecord {
  id: string;
  adminId: string;
  newEmail: string;
  otpHash: string;
  attempts: number;
  maxAttempts: number;
  resendAvailableAt: string;
  expiresAt: string;
  isConsumed: boolean;
  createdAt: string;
}

export interface ResumeDetails {
  id: string;
  pdfUrl: string | null;
  title: string;
  summary: string;
  originalFileName?: string | null;
  displayFileName: string;
  fileSize?: number | null;
  updatedAt: string;
}

export const INITIAL_RESUME: ResumeDetails = {
  id: "resume-1",
  pdfUrl: null,
  title: "Shivam Patil - .NET Full Stack Developer Resume",
  summary: "Comprehensive professional profile detailing .NET 8, C#, ASP.NET Core, React, and SQL Server expertise.",
  originalFileName: null,
  displayFileName: "Shivam_Patil_Resume.pdf",
  fileSize: null,
  updatedAt: new Date().toISOString(),
};

export const INITIAL_HERO: HeroProfile = {
  id: "hero-1",
  fullName: "Shivam Patil",
  headline: ".NET Full Stack Developer",
  subHeadline: "Specializing in C#, .NET 8, ASP.NET Core Web API, React, TypeScript & SQL Server",
  summary: "Architecting robust enterprise backends, scalable RESTful APIs, and responsive, fluid React frontends with Clean Architecture principles.",
  profileImageUrl: null,
  email: "patilshivam1280@gmail.com",
  phone: null,
  location: "Pune, Maharashtra, India",
  availabilityStatus: "Open for Full-time Roles & Projects",
  primaryCtaText: "Work With Me",
  ctaLink: "/contact",
  githubUrl: "https://github.com/Shivampatil09",
  linkedinUrl: "https://www.linkedin.com/in/shivampatil9",
  updatedAt: new Date().toISOString(),
};

export const INITIAL_ABOUT: AboutDetails = {
  id: "about-1",
  storyParagraphs: [
    "I am a results-driven .NET Full Stack Developer with a solid technical foundation in building enterprise-grade web applications, resilient backend architectures, and modern dynamic user interfaces.",
    "My core expertise lies within the Microsoft .NET ecosystem—designing RESTful APIs with ASP.NET Core Web API, managing data layers with Entity Framework Core & SQL Server, and adhering to Clean Architecture & SOLID design patterns.",
    "On the frontend, I combine React, Next.js, and TypeScript with modern styling systems like Tailwind CSS to deliver intuitive, high-performance web experiences that bridge complex business logic with seamless user design."
  ],
  bioHighlight: "Passionate about building scalable distributed systems, writing clean maintainable code, and solving real-world business challenges.",
  yearsOfExperience: "Fresher",
  projectsCompleted: "10+ Projects",
  updatedAt: new Date().toISOString(),
};

export const INITIAL_SKILLS: SkillItem[] = [
  // Backend (.NET Core Visual Primary)
  { id: "sk-1", category: "backend", name: "C#", icon: "csharp", proficiencyLabel: "Core Language", isFeatured: true, orderIndex: 1 },
  { id: "sk-2", category: "backend", name: ".NET 8 / .NET Core", icon: "dotnet", proficiencyLabel: "Framework", isFeatured: true, orderIndex: 2 },
  { id: "sk-3", category: "backend", name: "ASP.NET Core Web API", icon: "aspnet", proficiencyLabel: "API Architecture", isFeatured: true, orderIndex: 3 },
  { id: "sk-4", category: "backend", name: "Entity Framework Core", icon: "efcore", proficiencyLabel: "ORM & Data Access", isFeatured: true, orderIndex: 4 },
  { id: "sk-5", category: "backend", name: "RESTful APIs", icon: "rest", proficiencyLabel: "Web Services", isFeatured: true, orderIndex: 5 },
  { id: "sk-6", category: "backend", name: "JWT Authentication & Security", icon: "jwt", proficiencyLabel: "Auth & Identity", isFeatured: true, orderIndex: 6 },
  { id: "sk-7", category: "backend", name: "Clean Architecture & SOLID", icon: "layers", proficiencyLabel: "Design Patterns", isFeatured: true, orderIndex: 7 },

  // Frontend
  { id: "sk-8", category: "frontend", name: "React.js", icon: "react", proficiencyLabel: "Frontend Library", isFeatured: true, orderIndex: 8 },
  { id: "sk-9", category: "frontend", name: "TypeScript", icon: "typescript", proficiencyLabel: "Type Safety", isFeatured: true, orderIndex: 9 },
  { id: "sk-10", category: "frontend", name: "Next.js", icon: "nextjs", proficiencyLabel: "Full-Stack Framework", isFeatured: true, orderIndex: 10 },
  { id: "sk-11", category: "frontend", name: "JavaScript (ES6+)", icon: "javascript", proficiencyLabel: "Web Core", isFeatured: false, orderIndex: 11 },
  { id: "sk-12", category: "frontend", name: "Tailwind CSS", icon: "tailwind", proficiencyLabel: "Utility Styling", isFeatured: true, orderIndex: 12 },
  { id: "sk-13", category: "frontend", name: "shadcn/ui", icon: "palette", proficiencyLabel: "UI Components", isFeatured: false, orderIndex: 13 },
  { id: "sk-14", category: "frontend", name: "HTML5 & Modern CSS3", icon: "html5", proficiencyLabel: "Semantic Markup", isFeatured: false, orderIndex: 14 },
  { id: "sk-15", category: "frontend", name: "React Query & Zustand", icon: "state", proficiencyLabel: "State & Data Fetching", isFeatured: false, orderIndex: 15 },

  // Database
  { id: "sk-16", category: "database", name: "Microsoft SQL Server", icon: "sqlserver", proficiencyLabel: "RDBMS & T-SQL", isFeatured: true, orderIndex: 16 },
  { id: "sk-17", category: "database", name: "PostgreSQL", icon: "postgres", proficiencyLabel: "Relational DB", isFeatured: true, orderIndex: 17 },
  { id: "sk-18", category: "database", name: "Drizzle ORM", icon: "database", proficiencyLabel: "TypeScript ORM", isFeatured: false, orderIndex: 18 },

  // Tools & Development
  { id: "sk-19", category: "tools", name: "Visual Studio & VS Code", icon: "vs", proficiencyLabel: "IDE Environments", isFeatured: true, orderIndex: 19 },
  { id: "sk-20", category: "tools", name: "Git & GitHub", icon: "github", proficiencyLabel: "Version Control", isFeatured: true, orderIndex: 20 },
  { id: "sk-21", category: "tools", name: "Postman", icon: "postman", proficiencyLabel: "API Testing", isFeatured: true, orderIndex: 21 },
  { id: "sk-22", category: "tools", name: "Swagger / OpenAPI", icon: "swagger", proficiencyLabel: "API Documentation", isFeatured: true, orderIndex: 22 },
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title: "SmartStationary",
    slug: "smart-stationary",
    shortDescription: "Comprehensive stationary inventory, billing, and distribution management system engineered with ASP.NET Core Web API, SQL Server, and modern React.",
    fullDescription: "A full-fledged e-commerce & inventory solution for stationary enterprises featuring role-based access control (RBAC), multi-tier catalog management, real-time stock tracking, invoicing, and secure payment processing.",
    imageUrl: null,
    techStack: [".NET 8", "ASP.NET Core Web API", "React", "TypeScript", "SQL Server", "Entity Framework Core", "Tailwind CSS"],
    githubUrl: "https://github.com/Shivampatil09",
    liveDemoUrl: "https://github.com/Shivampatil09",
    isFeatured: true,
    orderIndex: 1,
  },
];

export const INITIAL_EXPERIENCE: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Admin & Career Consultant",
    company: "CJC (Complete Java Classes)",
    location: "Pune, Maharashtra, India",
    startDate: "2023",
    endDate: "Present",
    isCurrent: true,
    responsibilities: [
      "Guided and mentored aspiring software engineers through technical learning paths and interview readiness.",
      "Coordinated academic administration and student workflows with technical training teams.",
      "Assisted students in mastering core software concepts and development project preparation."
    ],
    orderIndex: 1,
  },
];

export const INITIAL_EDUCATION: EducationItem[] = [
  {
    id: "edu-1",
    degree: "Master of Computer Applications (MCA)",
    institution: "University / Institute",
    location: "Pune, Maharashtra",
    startYear: "2022",
    endYear: "2024",
    grade: "",
    description: "Specialized in Advanced Software Engineering, Distributed Systems, Database Management Systems, and Object-Oriented Architecture.",
    orderIndex: 1,
  },
  {
    id: "edu-2",
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "University / Institute",
    location: "Maharashtra, India",
    startYear: "2019",
    endYear: "2022",
    grade: "",
    description: "Core foundation in Computer Science, Data Structures & Algorithms, Web Technologies, Database Systems, and Object-Oriented Programming.",
    orderIndex: 2,
  },
];

export const INITIAL_CERTIFICATIONS: CertificationItem[] = [];
