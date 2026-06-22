# SkillBridge 🚀

**SkillBridge** is a modern, high-fidelity peer-to-peer campus networking and career preparation platform designed for college students. It connects peers to share technical skills, collaborate on projects, track academic scoring, and analyze job placement readiness against top-tier corporate recruitment expectations.

---

## ✨ Features

- **🛡️ Secure Peer Authentication**: Complete authentication workflows powered by **NextAuth.js** with college email validations.
- **📊 Placement Readiness Score**: A dynamic scoring system (out of 100 points) evaluating students on Profile completion, Skills, Projects, DSA progress, and Certifications.
- **🎯 Dynamic Skill Gap Assessment**: Compares your listed profile competencies against standard requirements for target roles (e.g., Frontend, Backend, Full Stack, Software Engineer, Data Analyst) and charts missing technologies.
- **🗺️ Interactive Timeline Career Roadmap**: Generates a step-by-step career path checklist optimized for the student's selected target role.
- **🏢 Company Readiness Checker**: Gauges preparation index against specific requirements for corporate partners (Google, Amazon, Microsoft, JPMC, TCS, Infosys) detailing matched vs. missing skills.
- **📚 Study Resource Hub**: A centralized repository containing curated placement preparation material (DSA, DBMS, Networks, OS, OOP, Web Development, Interview Prep) filterable by difficulty and category.
- **📅 Weekly Goal Tracker**: A Kanban board and list tracker helping students create, manage, and complete priority goals for recruitment readiness.
- **📄 Resume Analyzer & Auto-Sync**: Robust offline extraction of contact links (GitHub & LinkedIn), education records, skills, projects, and certifications from PDF/DOCX files. Features a side-by-side **Profile Auto-Sync Review Screen** that highlights difference details, supports selective syncing (Name, Email, Education, Links, Skills, Projects, Certifications), and automatically triggers preparation score recalculations.
- **📈 Advanced Analytics Dashboard**: Visualizes placement preparation metrics, weekly progress trends, DSA topic competence radar charts, required skills mapping, and goal counts with dynamic recommendations using **Recharts**.
- **🛡️ Admin Management Panel**: Role-protected analytics dashboard containing user directories, student performance averages, resource aggregation indexes, and user deletion tools.
- **🔑 Separate Admin Login & Auto-Seeding**: Custom-styled secure gateway for admin accounts. Includes automatic database credentials checking and seeding logic (`admin@skillbridge.edu` / `adminpassword123`).
- **💫 Modern Glassmorphic SaaS UI**: Styled with responsive, glassmorphic dashboards, smooth active transitions, entry animations, glowing loading skeletons, and interactive floating toast notifications.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: Tailwind CSS & Vanilla CSS custom components
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 💻 Local Setup & Installation

Follow these steps to configure and run the SkillBridge development environment on your machine:

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (either running locally or a MongoDB Atlas Cloud URI)

---

### Step-by-Step Guide

### 1. Clone the Repository
```bash
git clone https://github.com/sjha04180/SkillBridge.git
cd SkillBridge
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a file named `.env.local` in the root of the project:
```bash
# Windows command line / PowerShell:
New-Item .env.local -ItemType File
```
Open `.env.local` and configure the following variables:
```env
# Database Connection URI
MONGODB_URI=mongodb://localhost:27017/skillbridge

# NextAuth Base URL (Local Development)
NEXTAUTH_URL=http://localhost:3000

# NextAuth Secret Key (Generate one using: openssl rand -base64 32)
NEXTAUTH_SECRET=your_generated_secret_key

# Google OAuth Client Secrets (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth Client Secrets (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 4. Run the Development Server
Make sure your MongoDB server is active, then launch the Next.js local compiler:
```bash
npm run dev
```
Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

### 5. Build for Production
To build and optimize the project for deployment:
```bash
npm run build
npm run start
```

---

## ☁️ Deployment

When deploying to platforms like **Vercel**, **Netlify**, or **Render**:
1. Do **not** commit `.env.local` to Git.
2. In the hosting provider's dashboard, configure the Production Environment variables:
   - `MONGODB_URI` -> Point to a live **MongoDB Atlas** database cloud string.
   - `NEXTAUTH_URL` -> Set to the live website URL (e.g. `https://yourdomain.com`).
   - `NEXTAUTH_SECRET` -> Generate a new cryptographically secure secret.
