"use client";

import { motion } from "framer-motion";
import { Download, FileText, CheckCircle2, Briefcase, GraduationCap, Code2, Mail, Phone, MapPin, Globe, AlertCircle } from "lucide-react";
import { HeroProfile, ExperienceItem, EducationItem, SkillItem, ResumeDetails } from "@/lib/db/initial-data";

export function InteractiveResume({
  profile,
  experiences,
  educations,
  skills,
  resumeData,
}: {
  profile: HeroProfile;
  experiences: ExperienceItem[];
  educations: EducationItem[];
  skills: SkillItem[];
  resumeData: ResumeDetails;
}) {
  const handlePrint = () => {
    window.print();
  };

  const hasPdf = Boolean(resumeData?.pdfUrl);

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#17120e] border border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#faf7f2]">{profile.fullName} — Official Resume</h3>
            <p className="text-xs text-[#a39687]">
              {hasPdf
                ? `Custom PDF: ${resumeData.displayFileName || "Shivam_Patil_Resume.pdf"}`
                : "Interactive Digital Resume (.NET Full Stack)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#1f1814] border border-[#3d2e24] text-xs font-semibold text-[#f6f2ec] hover:border-amber-500/40 hover:text-amber-300 transition-all"
          >
            Print / Save as PDF
          </button>
          
          {hasPdf ? (
            <a
              href="/api/resume/download"
              download={resumeData.displayFileName || "Shivam_Patil_Resume.pdf"}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-xs font-bold text-[#090807] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </a>
          ) : (
            <div className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1f1814] border border-amber-500/30 text-xs font-medium text-amber-400/90">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>PDF Ready to Print</span>
            </div>
          )}
        </div>
      </div>

      {/* Styled Interactive Document Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card-static rounded-3xl p-6 sm:p-12 border border-amber-500/20 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative corner seal */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />

        {/* Resume Header */}
        <div className="border-b border-[#352923] pb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#faf7f2] tracking-tight">
                {profile.fullName}
              </h1>
              <h2 className="text-lg sm:text-xl font-bold text-amber-400 font-mono mt-1">
                {profile.headline}
              </h2>
            </div>
            
            <div className="space-y-1.5 text-xs font-mono text-[#b8ada0]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Pune, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                  github.com/Shivampatil09
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                  linkedin.com/in/shivampatil9
                </a>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#b8ada0] leading-relaxed pt-2">
            {profile.summary}
          </p>
        </div>

        {/* Resume Sections */}
        <div className="pt-8 space-y-8">
          {/* 1. Core Technical Competencies */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              Technical Skill Set
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#14100e] border border-[#352923]">
                <strong className="text-amber-300 block mb-1 font-mono">Backend & Frameworks:</strong>
                <span className="text-[#cfc5b8]">C#, .NET 8, ASP.NET Core Web API, Entity Framework Core, RESTful APIs, JWT Auth, Clean Architecture</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14100e] border border-[#352923]">
                <strong className="text-amber-300 block mb-1 font-mono">Frontend & Web:</strong>
                <span className="text-[#cfc5b8]">React.js, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, shadcn/ui, HTML5, CSS3</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14100e] border border-[#352923]">
                <strong className="text-amber-300 block mb-1 font-mono">Databases:</strong>
                <span className="text-[#cfc5b8]">Microsoft SQL Server, PostgreSQL, Drizzle ORM, T-SQL</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14100e] border border-[#352923]">
                <strong className="text-amber-300 block mb-1 font-mono">Tools & Practices:</strong>
                <span className="text-[#cfc5b8]">Git, GitHub, Visual Studio, VS Code, Postman, Swagger/OpenAPI, Agile/Scrum</span>
              </div>
            </div>
          </div>

          {/* 2. Professional Experience */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              Professional Experience
            </h3>
            {experiences.map((exp) => (
              <div key={exp.id} className="p-4 rounded-xl bg-[#14100e] border border-[#352923] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-sm font-bold text-[#faf7f2]">{exp.role} — <span className="text-amber-400">{exp.company}</span></span>
                  <span className="text-xs font-mono text-[#a39687]">{exp.startDate} – {exp.endDate} | {exp.location}</span>
                </div>
                <ul className="space-y-1.5 pt-1">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#b8ada0]">
                      <span className="text-amber-500 font-bold mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 3. Featured Project Highlights */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Featured Full-Stack Project: SmartStationary
            </h3>
            <div className="p-4 rounded-xl bg-[#14100e] border border-[#352923] space-y-1.5 text-xs text-[#b8ada0]">
              <p className="font-semibold text-[#faf7f2]">
                Full Stack E-Commerce & Inventory Management Platform
              </p>
              <p>
                Engineered with <strong className="text-amber-300">ASP.NET Core Web API, SQL Server, Entity Framework Core, and React</strong>. Designed secure JWT role-based authentication, real-time inventory management, order processing pipelines, and responsive dashboards.
              </p>
            </div>
          </div>

          {/* 4. Education */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Education
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {educations.map((edu) => (
                <div key={edu.id} className="p-3.5 rounded-xl bg-[#14100e] border border-[#352923]">
                  <p className="font-bold text-[#faf7f2]">{edu.degree}</p>
                  <p className="text-amber-400/90">{edu.institution}</p>
                  <p className="text-xs font-mono text-[#a39687] mt-1">{edu.startYear} – {edu.endYear}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
