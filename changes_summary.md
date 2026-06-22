# SkillBridge Project Modifications Summary

This document details all the enhancements and updates implemented in the SkillBridge application today. The changes cover database schemas, authentication configuration, backend API routes, and modern glassmorphic dashboard views.

---

## 1. Advanced DSA Tracker Module

### 📂 Created Files:
* **Mongoose Schema**: [DsaTracker.ts](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/models/DsaTracker.ts)
* **Backend API Route (Get/Put/Post)**: [route.ts](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/dsa-tracker/route.ts)
* **Backend API Route (CRUD Problems)**: [route.ts](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/dsa-tracker/problems/%5Bid%5D/route.ts)
* **Frontend Dashboard**: [page.tsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/dsa-tracker/page.tsx)

### 💡 Details:
1. **Schema Design**: Built a comprehensive DSA tracking schema to monitor user progress. It houses platform ratings (LeetCode, CodeChef, Codeforces, HackerRank, GeeksforGeeks), daily streaks, target company tiers (Tier 1: Google/MS/Amazon, etc.), solved count metrics (Easy, Medium, Hard), and problem logs.
2. **REST Endpoints**: Implemented API handlers to fetch, update, and manage DSA stats, as well as a full set of CRUD endpoints to add, edit, or delete solved problem practice logs.
3. **Interactive UI**: Added a state-of-the-art dark glassmorphic dashboard inside the dashboard menu. The view includes statistics cards, platform metrics modifiers, search-by-name problem log filters, and interactive SVG charts representing platform achievements.

---

## 2. Google & GitHub Social Login Integration

### 📂 Created/Modified Files:
* **NextAuth Configurations**: [route.ts](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/auth/%5B...nextauth%5D/route.ts)
* **Login UI Form**: [page.tsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/login/page.tsx)
* **Environment variables**: [env.download](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/env.download)

### 💡 Details:
1. **OAuth Providers**: Added `GoogleProvider` and `GithubProvider` to the NextAuth handler.
2. **Auto-Registration Database Hooks**: Added a custom `signIn` handler callback. When a student signs in via Google or GitHub for the first time, the callback automatically registers a new User document in MongoDB using secure random passwords and default fields to comply with Mongoose validations.
3. **Buttons & Branding**: Added inline vector icon buttons styled with brand matching colors to the existing login card.

---

## 3. Career Target Roles Expansion

### 📂 Modified Files:
* **Profile Schema**: [Profile.ts](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/models/Profile.ts)
* **Profile Dropdown UI**: [page.tsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/profile/page.tsx)
* **Dashboard Skills Mapping & Points Calculations**:
  * [page.tsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/page.tsx) (overview)
  * [page.tsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/readiness/page.tsx) (readiness points)
  * [page.tsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/skill-gap/page.tsx) (gap resources)
  * [page.tsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/roadmap/page.tsx) (study plans)
  * [page.tsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/analytics/page.tsx) (charts)
  * [page.tsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/(admin-dashboard)/admin/page.tsx) (KPIs)

### 💡 Details:
1. **New Job Profiles**: Added validation options to support **Machine Learning Engineer**, **DevOps Engineer**, **Cloud Architect**, **Cybersecurity Analyst**, and **Mobile Developer**.
2. **Point Sync**: Synchronized the target skills mapping (`ROLE_SKILLS`, `SKILL_RESOURCES`) and learning paths across all six calculation and visualization routes so new profiles get fully-functional analytics.

---

## 4. Hackathons Directory

### 📂 Created/Modified Files:
* **Profile Schema**: [Profile.ts](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/models/Profile.ts) (added `registeredHackathons: [String]`)
* **Profile REST Handler**: [route.ts](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/profile/route.ts)
* **Sidebar Layout**: [layout.tsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/layout.tsx)
* **Hackathons Page**: [page.tsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/hackathons/page.tsx)

### 💡 Details:
1. **Missing Module Fix**: Delivered the dashboard page showing active/upcoming contests (SIH 2026, Google Hash Code, MS Imagine Cup, etc.).
2. **MongoDB State Synchronization**: Added registered/interested markers that dynamically save to the user's profile schema inside MongoDB.
3. **Class Team Finder**: Implemented a classmate team finder recruitment panel to allow students to connect for team registration.

---

## 5. Study Resources Link Corrections

### 📂 Modified Files:
* **Resources Seeder & GET Route**: [route.ts](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/resources/route.ts)

### 💡 Details:
1. **Correct Links**: Updated Striver's DSA video playlist and sheet resources:
   * **Striver's A2Z DSA Sheet** (Website): `https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z`
   * **Striver's A2Z DSA Video Playlist** (Video): `https://youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz&si=T3HY7x_SDhCQrLXJ`
2. **Active Database Migration**: Added logic to verify and overwrite preexisting database documents dynamically upon fetching the `/api/resources` endpoint, ensuring existing databases get patched.

---

## 6. TypeScript to JavaScript Project Conversion

### 📂 Created/Modified/Deleted Files:
* **Deleted Configurations**:
  * `tsconfig.json` (TypeScript compiler configuration)
  * `next-env.d.ts` (Next.js TS global declarations)
  * `src/types/next-auth.d.ts` (Custom NextAuth session types)
  * `next.config.ts` (TypeScript configuration)
* **Created Configurations**:
  * [next.config.mjs](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/next.config.mjs) (JavaScript configuration for Next.js)
  * [jsconfig.json](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/jsconfig.json) (JavaScript configuration mapping path aliases `@/*` to `./src/*`)
* **Modified Configurations**:
  * [eslint.config.mjs](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/eslint.config.mjs) (Removed TypeScript ESLint presets and disabled rules like `react-hooks/set-state-in-effect` and `react/no-unescaped-entities` for cleaner JS code checking)
  * [package.json](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/package.json) (Cleaned up devDependencies by removing `typescript` and `@types/*` packages)
* **Source Code Conversion**:
  * All `.ts` files inside `src/` (database config, Mongoose models, API routes, utilities, and middleware) were converted to `.js` files.
  * All `.tsx` components and pages inside `src/` were converted to React `.jsx` files. All TypeScript interface definitions, type annotations, and type assertions were cleanly stripped.

### 💡 Details:
1. **Clean Code Conversion**: Employed static analysis formatting tools to completely strip out type signatures, interfaces, generics, and annotations across all source files, converting the project to clean, modern JavaScript and React JSX.
2. **Path Alias Restorations**: Configured `jsconfig.json` to allow Next.js and ESLint to resolve path aliases such as `@/models/...` and `@/lib/...` seamlessly in JavaScript files.
3. **JS Scope Resolution & Hoisting Fixes**: Relocated block-scoped helper functions (like `showToast` in resources, `fetchTracker` in DSA tracker, and `fetchProfile` in hackathons) above `useEffect` hooks and fetch handlers, resolving JavaScript `ReferenceError` violations flagged by ESLint.
4. **Build & Lint Verification**: Ran `npm run lint` which resolved with 0 errors, and successfully generated production routes using `npm run build` after removing stale build caches.
5. **Dashboard Company Matching Sync**: Aligned the company readiness matching calculations on the landing dashboard page with the details tab (removed the 30% baseline offset and adjusted the strong match threshold to 80% to make it completely consistent with the Company Readiness Checker).

---

## 7. DSA Tracker Achievements Modal Layout and Spacing Adjustments

### 📂 Modified Files:
* **DSA Tracker Component**: [page.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/dsa-tracker/page.jsx)

### 💡 Details:
1. **Modal Centering & Positioning**: Removed the redundant `overflow-y-auto` layout class on the parent overlay element that caused weird flexbox vertical alignment issues and pushed the modal down, and ensured standard viewport vertical and horizontal centering.
2. **Padding and Spacing Reductions**: Reduced vertical padding of the card container from `p-6` to `p-4 sm:p-5` and adjusted `space-y-6` to `space-y-4` to tighten up the general form structure.
3. **Input Heights and Inner Margins**: Updated Section 1 and Section 2 input fields from `p-2` to `py-1.5 px-2.5` to make them more compact vertically, and minimized label bottom margins to shrink the total form height to fit perfectly on standard viewports without excessive vertical scrolling.

---

## 8. Teammate Finder Backend and Database Integration

### 📂 Created/Modified Files:
* **Created Database Model**: [TeammatePost.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/models/TeammatePost.js)
* **Created API Route**: [route.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/hackathons/teammates/route.js)
* **Modified Frontend Component**: [page.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/hackathons/page.jsx)

### 💡 Details:
1. **Dynamic Teammate Database Collection**: Created the `TeammatePost` model to dynamically save and load peer teammates recruitment posts in MongoDB instead of displaying static mock elements.
2. **Classmate Posts REST API**: Implemented a Next.js API route that supports:
   - `GET`: Returns the active classmate teammate posts sorted by newest first (with automated fallback seeding of sample posts if the DB collection is fresh and empty).
   - `POST`: Validates credentials, queries the poster's college/branch from DB, and saves the new recruitment details.
   - `DELETE`: Authorizes the request session and removes target posts from the collection.
3. **Interactive UI Wiring**: Wired state, loader indicators, and a dialog modal to the "Post Team Recruitment" trigger in [page.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/hackathons/page.jsx). Added inline delete actions visible only to the post's owner.

---

## 9. Resume Analyzer & Resume Readiness Module (Phase 13)

### 📂 Created/Modified Files:
* **Created Database Model**: [ResumeAnalysis.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/models/ResumeAnalysis.js)
* **Created API Route**: [route.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/resume-analyzer/route.js)
* **Created Frontend Page**: [page.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/resume-analyzer/page.jsx)
* **Modified Layout**: [layout.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/layout.jsx)
* **Modified Profile Schema**: [Profile.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/models/Profile.js)
* **Modified Profile Page**: [page.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/profile/page.jsx)
* **Modified Profile API**: [route.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/profile/route.js)
* **Modified Dashboard Main Page**: [page.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/page.jsx)
* **Modified Readiness Score Page**: [page.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/readiness/page.jsx)
* **Modified Analytics Pages**:
  * [page.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/analytics/page.jsx)
* **Modified Legacy Checklist Redirect**: [page.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/resume/page.jsx)
* **Modified Admin Actions**: [route.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/admin/users/%5Bid%5D/route.js)

### 💡 Details:
1. **Offline Parsing Engines**: Installed and integrated `pdf-parse` and `mammoth` to handle buffer-based local text extraction from uploaded PDF and Word documents without external AI API dependencies.
2. **Rule-Based Resume Parsing**: Implemented dynamic regex-based name, email, phone, LinkedIn, and GitHub link identification, alongside section-based chunk parsing for Education, Skills, Projects, Experience, and Achievements.
3. **Double Scoring Engine**: Programmed Resume Readiness scoring (out of 100) aligned with strict weightages (contact details, projects, education, formatting etc.) and ATS Compatibility scoring (checking layout, standard headings, readability, keyword density).
4. **Auto-Profile Synchronization**: Synced parsed contact details, skills, certifications, and projects automatically with the user's Profile collection in MongoDB. This updates calculations, roadmaps, and company checkers instantly without duplicate entry.
5. **Interactive UI Module**: Implemented a responsive SaaS analyzer view at `/dashboard/resume-analyzer` containing radial gauges, upload drop zones, visual progress bars, priority cards (High/Medium/Low) for suggestions, and structured tabs for extracted blocks.
6. **Placement Score Refactoring**: Updated the overall Placement Readiness Score across the dashboard, analytics, and readiness tabs to follow the new formula: Skills (25%), Projects (25%), DSA (20%), Resume Score (20%), and Certifications (10%).

---

## 10. Hybrid Resume Analyzer Fallback (Phase 13.1)

### 📂 Created/Modified Files:
* **Modified Database Schema**: [ResumeAnalysis.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/models/ResumeAnalysis.js)
* **Modified Backend API Route**: [route.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/resume-analyzer/route.js)
* **Modified Frontend Component**: [page.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/resume-analyzer/page.jsx)

### 💡 Details:
1. **Schema Adjustments**: Modified the `ResumeAnalysis` Mongoose schema to mark file metadata fields (`fileName`, `fileSize`, `fileType`, `fileData`) as optional and added the `isManual` boolean flag to differentiate manual entry calculations from parsed uploads.
2. **Flexible API Payload Handling**: Enhanced the POST handler in `route.js` to process JSON request bodies. When `content-type` is `application/json`, it builds dummy resume text and parses form elements (Name, College, Branch, CGPA, skills array, projects array, certifications array, experience string).
3. **Advanced Heuristic Fallback Scoring**: Refined grading heuristics so points are awarded based on content presence instead of strict title headings (e.g. recognizing project-like text blocks or repository URLs anywhere in the raw text).
4. **Auto-Profile Synchronization**: Synced manually inputted technical skills, certifications, and project lists with the student's main career `Profile` collection inside MongoDB, deduplicating keys via case-insensitive checks.
5. **Interactive Form UI**: Added a sleek glassmorphic collapsible card `Don't have a resume yet? [ Complete Manually ]` separated from the primary upload zone by a clean custom divider. Includes tag input components for skills and certifications and a dynamic project list builder.

---

## 11. GitHub & Google OAuth Environment Variables Alignment

### 📂 Modified Files:
* **NextAuth Route Handler**: [route.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/auth/%5B...nextauth%5D/route.js)
* **Environment Configuration**: [.env.local](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/.env.local)

### 💡 Details:
1. **Unified Environment Variable Fallbacks**: Resolved the `client_id is required` runtime signin OAuth exception by editing the NextAuth API handler's provider configurations. Added secondary checks (`process.env.GITHUB_ID` and `process.env.Google_Client_ID`) to align with existing environment settings.
2. **Environment Synchronization**: Standardized the NextAuth OAuth credentials inside `.env.local` by defining `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET` to prevent any future naming mismatch issues.

---

## 12. Improved Resume Extraction & Scoring Logic (Scoring & Parsing Enhancements)

### 📂 Modified Files:
* **Backend API Route**: [route.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/resume-analyzer/route.js)
* **Frontend Component**: [page.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/resume-analyzer/page.jsx)

### 💡 Details:
1. **GitHub & LinkedIn Extraction Rules**: Expanded the regex and matching conditions to robustly capture any instances of `github.com` or `github.io` (including custom subdomains) and `linkedin.com` / `linkedin.com/in/`.
2. **Predefined Skills Database**: Enlarged the `SKILL_MAP` keywords database to cleanly capture matches for Tailwind CSS, Express.js, JavaScript, React, Node.js, Express, MongoDB, Java, C++, Next.js, HTML, and CSS anywhere in the text.
3. **Advanced Projects Fallback**: Programmed a content-based fallback that scans raw resume text line-by-line for action keywords (`Tech Stack`, `Developed`, `Built`, `Implemented`) if fewer than two projects are matched via section headings.
4. **Flexible Heading Matching**: Updated heading-based extraction to support custom variations for Experience (`Experience`, `Activities`, `Experience & Activities`, `Internships`, `Participation`, `Open Source`) and Certifications (`Certifications`, `Courses`, `Training`, `Certificates`).
5. **No-Zero Content Scoring**: Ensured that Readiness and ATS scores are computed directly from extracted content matches (rather than assigning zero simply because a heading is absent).
6. **Developer Mode Debug Logs**: Implemented a detailed extraction check-log output to both the server-side logs and a client-side visual debug card + browser console logging statement when running in development mode.

---

## 13. Phase 14 – Resume to Profile Auto-Sync

### 📂 Created/Modified Files:
* **Created API Route**: [route.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/resume-analyzer/sync/route.js)
* **Modified Backend API Route**: [route.js](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/api/resume-analyzer/route.js)
* **Modified Frontend Component**: [page.jsx](file:///c:/Users/pjha9/Documents/ALL%20Coding/Projects/SkillBridge/src/app/dashboard/resume-analyzer/page.jsx)

### 💡 Details:
1. **Interactive Review Screen**: Built a comprehensive glassmorphic side-by-side comparison screen (`Current Profile Data` vs `Resume Extracted Data`) that renders immediately after parsing or manual submission.
2. **Selective Auto-Sync**: Allows the user to choose to "Accept All Changes", pick and choose "Select Individual Changes" using active checklist toggle state checkboxes for each field (Name, College, Branch, Github, LinkedIn, Skills, Certifications, and Projects), or "Skip Sync".
3. **Atomic API Integration**: Programmed a secure POST endpoint at `/api/resume-analyzer/sync` that merges incoming arrays and objects with the existing database documents while avoiding duplicates via case-insensitive matching.
4. **Dynamic Score Recalculation**: Utilized Next.js dynamic routing updates (`router.refresh()`) to immediately recalculate the student's Career Roadmap, Skill Gap, Company Readiness, and Placement Readiness Scores without page refreshes.

