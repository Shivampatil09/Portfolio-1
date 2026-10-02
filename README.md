# Shivam Patil — .NET Full Stack Developer Portfolio

A production-grade, multi-page personal portfolio and CMS built for **Shivam Patil**, positioned as a **.NET Full Stack Developer**.

---

## 🌟 Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React, Sonner
- **Backend:** Next.js Route Handlers, Server Actions, bcrypt, JWT (jose)
- **Database & ORM:** Neon PostgreSQL + Drizzle ORM (with seamless fallback storage)
- **Visual Palette:** Warm White, Golden Yellow, Warm Brown, Deep Brown, Near-Black

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin CMS & Credentials

To manage your portfolio content, profile photo, projects, skills, and contact inquiries:

- **Admin Login Route:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Default Username:** `admin`
- **Default Password:** `ShivamAdmin@2026!`

*(You can configure these in your `.env.local` file)*

### Features inside Admin CMS:
1. **Profile Photo Management:** Upload directly from computer (PNG/JPG/WebP up to 5MB), enter image URL, edit, or delete photo with instant site sync.
2. **Hero & Personal Branding:** Edit full name, headline, summary, GitHub & LinkedIn links.
3. **About Me:** Update story paragraphs, bio highlight, and experience metrics.
4. **Projects CRUD:** Add, edit, or delete projects with custom tech stack pills, source links, and live demos.
5. **Skills Taxonomy:** Categorized management of .NET Backend, React Frontend, Databases, and Tools.
6. **Inquiries Inbox:** Review, mark read, and manage contact submissions.

---

## 🗄️ Database Configuration (Neon PostgreSQL)

When you are ready to connect your Neon PostgreSQL instance:

1. Open `.env.local`
2. Set your `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Push schema to database:
   ```bash
   npm run db:push
   ```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx               # Home (Hero + Featured Projects/Skills)
│   │   ├── about/page.tsx         # Story + CJC Pune Experience + MCA/BCA
│   │   ├── skills/page.tsx        # Categorized Skills (.NET visually primary) + Certs
│   │   ├── projects/page.tsx      # 4 Project cards (including SmartStationary)
│   │   ├── resume/page.tsx        # Interactive Resume + PDF Download
│   │   └── contact/page.tsx       # Work With Me Form (Server Action + DB)
│   ├── admin/
│   │   ├── login/page.tsx         # Admin Login (JWT Auth)
│   │   ├── dashboard/page.tsx     # Profile Photo Uploader & Content Editor
│   │   ├── projects/page.tsx      # Projects CRUD Manager
│   │   ├── skills/page.tsx        # Skills Taxonomy Manager
│   │   └── messages/page.tsx      # Contact Inquiries Inbox
│   ├── layout.tsx                 # Root Layout (Navbar, Footer, Toaster)
│   ├── globals.css                # Warm theme palette & glassmorphism
│   ├── robots.ts                  # Search engine robots config
│   └── sitemap.ts                 # Dynamic sitemap generator
├── actions/
│   ├── contact.ts                 # Contact submission Server Action
│   └── admin.ts                   # Admin CRUD & auth Server Actions
├── components/
│   ├── layout/                    # Navbar, Footer, PageTransition
│   ├── sections/                  # HeroSection, HeroBackground, SkillCard, ProjectCard, etc.
│   └── ui/                        # Brand icons & UI components
├── lib/
│   ├── auth/                      # JWT verification & session cookies
│   ├── db/                        # Drizzle schema, initial data & queries
│   ├── validations/               # Zod validation schemas
│   └── utils.ts                   # Class merging & formatters
└── middleware.ts                  # JWT protection for /admin routes
```
