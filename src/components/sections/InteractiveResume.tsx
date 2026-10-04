"use client";

import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Briefcase,
  GraduationCap,
  Code2,
  MapPin,
  Globe,
  AlertCircle,
} from "lucide-react";
import {
  HeroProfile,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ResumeDetails,
} from "@/lib/db/initial-data";

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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#14110f] border border-[#2a2118]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#edbb5f]/15 text-[#edbb5f] border border-[#edbb5f]/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#f1eee8]">
              {profile.fullName} — Official Resume
            </h3>
            <p className="text-xs text-[#827a70]">
              {hasPdf
                ? `Custom PDF: ${
                    resumeData.displayFileName || "Shivam_Patil_Resume.pdf"
                  }`
                : "Interactive Digital Resume (.NET Full Stack)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#14110f] border border-[#2a2118] text-xs font-semibold text-[#f1eee8] hover:border-[#edbb5f]/40 hover:text-[#edbb5f] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Print / Save as PDF
          </button>

          {hasPdf ? (
            <a
              href="/api/resume/download"
              download={resumeData.displayFileName || "Shivam_Patil_Resume.pdf"}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#edbb5f] hover:bg-[#edbb5f]/90 text-xs font-bold text-[#060605] hover:shadow-[0_4px_16px_rgba(237,187,95,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
            >
              <Download className="w-4 h-4 text-[#060605]" />
              <span>Download PDF</span>
            </a>
          ) : (
            <div className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#14110f] border border-[#edbb5f]/30 text-xs font-medium text-[#edbb5f]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>PDF Ready to Print</span>
            </div>
          )}
        </div>
      </div>

      {/* Styled Interactive Document Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card-static rounded-3xl p-6 sm:p-12 border border-[#2a2118] shadow-2xl relative overflow-hidden"
      >
        {/* Decorative corner seal */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#edbb5f]/5 rounded-bl-full pointer-events-none" />

        {/* Resume Header */}
        <div className="border-b border-[#2a2118] pb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f1eee8] tracking-tight">
                {profile.fullName}
              </h1>
              <h2 className="text-lg sm:text-xl font-bold text-[#edbb5f] font-mono mt-1">
                {profile.headline}
              </h2>
            </div>

            <div className="space-y-1.5 text-xs font-mono text-[#827a70]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#edbb5f]" />
                <span>Pune, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#edbb5f]" />
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#edbb5f] transition-colors"
                >
                  github.com/Shivampatil09
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#edbb5f]" />
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#edbb5f] transition-colors"
                >
                  linkedin.com/in/shivampatil9
                </a>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#c0b8ad] leading-relaxed pt-2">
            {profile.summary}
          </p>
        </div>

        {/* Resume Sections */}
        <div className="pt-8 space-y-8">
          {/* 1. Core Technical Competencies */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#edbb5f] font-bold flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#edbb5f]" />
              Technical Skill Set
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#14110f] border border-[#2a2118] hover:border-[#edbb5f]/30 transition-colors">
                <strong className="text-[#edbb5f] block mb-1 font-mono">
                  Backend & Frameworks:
                </strong>
                <span className="text-[#c0b8ad]">
                  C#, .NET 8, ASP.NET Core Web API, Entity Framework Core,
                  RESTful APIs, JWT Auth, Clean Architecture
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#14110f] border border-[#2a2118] hover:border-[#edbb5f]/30 transition-colors">
                <strong className="text-[#edbb5f] block mb-1 font-mono">
                  Frontend & Web:
                </strong>
                <span className="text-[#c0b8ad]">
                  React.js, Next.js, TypeScript, JavaScript (ES6+), Tailwind
                  CSS, shadcn/ui, HTML5, CSS3
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#14110f] border border-[#2a2118] hover:border-[#edbb5f]/30 transition-colors">
                <strong className="text-[#edbb5f] block mb-1 font-mono">
                  Databases:
                </strong>
                <span className="text-[#c0b8ad]">
                  Microsoft SQL Server, PostgreSQL, Drizzle ORM, T-SQL
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#14110f] border border-[#2a2118] hover:border-[#edbb5f]/30 transition-colors">
                <strong className="text-[#edbb5f] block mb-1 font-mono">
                  Tools & Practices:
                </strong>
                <span className="text-[#c0b8ad]">
                  Git, GitHub, Visual Studio, VS Code, Postman, Swagger/OpenAPI,
                  Agile/Scrum
                </span>
              </div>
            </div>
          </div>

          {/* 2. Professional Experience */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#edbb5f] font-bold flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#edbb5f]" />
              Professional Experience
            </h3>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl bg-[#14110f] border border-[#2a2118] space-y-2 hover:border-[#edbb5f]/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs">
                    <span className="font-bold text-sm text-[#f1eee8]">
                      {exp.role} —{" "}
                      <span className="text-[#edbb5f]">{exp.company}</span>
                    </span>
                    <span className="text-[#827a70] font-mono">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-[#c0b8ad] space-y-1">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Education Milestones */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#edbb5f] font-bold flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#edbb5f]" />
              Education Milestones
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-xl bg-[#14110f] border border-[#2a2118] space-y-1 hover:border-[#edbb5f]/30 transition-colors"
                >
                  <span className="font-bold text-xs text-[#f1eee8] block">
                    {edu.degree}
                  </span>
                  <span className="text-xs text-[#edbb5f] block">
                    {edu.institution}
                  </span>
                  <span className="text-[11px] font-mono text-[#827a70] block">
                    {edu.startYear} – {edu.endYear}
                    {edu.grade ? ` • ${edu.grade}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
