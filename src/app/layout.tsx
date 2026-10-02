import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { getHeroProfile } from "@/lib/db";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shivam Patil | .NET Full Stack Developer",
  description:
    "Official portfolio of Shivam Patil — .NET Full Stack Developer specializing in C#, .NET 8, ASP.NET Core Web API, React, TypeScript, and SQL Server.",
  keywords: [
    "Shivam Patil",
    ".NET Full Stack Developer",
    "ASP.NET Core Web API",
    "C# Developer",
    "React Developer",
    "TypeScript",
    "SQL Server",
    "Entity Framework Core",
    "Clean Architecture",
    "Pune Software Engineer",
  ],
  authors: [{ name: "Shivam Patil" }],
  creator: "Shivam Patil",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Shivam Patil | .NET Full Stack Developer",
    description:
      "Enterprise-grade .NET & React Full Stack solutions with C#, ASP.NET Core Web API, React, and SQL Server.",
    siteName: "Shivam Patil Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivam Patil | .NET Full Stack Developer",
    description: "Enterprise-grade .NET & React Full Stack Developer Portfolio.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const heroProfile = await getHeroProfile();

  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-[#0a0807] text-[#f6f2ec] selection:bg-amber-500/30 selection:text-amber-200`}
      >
        <Navbar
          githubUrl={heroProfile.githubUrl}
          linkedinUrl={heroProfile.linkedinUrl}
        />
        <main className="flex-1">{children}</main>
        <Footer
          githubUrl={heroProfile.githubUrl}
          linkedinUrl={heroProfile.linkedinUrl}
        />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#1c1511",
              border: "1px solid #3d2e24",
              color: "#faf7f2",
            },
          }}
        />
      </body>
    </html>
  );
}
