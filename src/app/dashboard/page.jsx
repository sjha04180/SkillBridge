import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import User from "@/models/User";
import Goal from "@/models/Goal";
import ResumeAnalysis from "@/models/ResumeAnalysis";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  BookOpen,
  Mail,
  User as UserIcon,
  Award,
  Zap,
  Map,
  Building2,
  ArrowRight,
  Briefcase,
  Layers,
  FileCode,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";

const ROLE_SKILLS = {
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git"],
  "Backend Developer": [
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "DBMS",
    "Docker",
    "Git",
  ],
  "Full Stack Developer": [
    "React",
    "Node.js",
    "MongoDB",
    "DBMS",
    "SQL",
    "Git",
    "Tailwind CSS",
  ],
  "Software Engineer": [
    "Data Structures",
    "Algorithms",
    "DBMS",
    "Java",
    "Python",
    "System Design",
    "Git",
  ],
  "Data Analyst": [
    "Python",
    "SQL",
    "Excel",
    "Tableau",
    "Statistics",
    "Pandas",
    "Git",
  ],
  "Machine Learning Engineer": [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "SQL",
    "Statistics",
    "Git",
  ],
  "DevOps Engineer": [
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Linux",
    "AWS",
    "Git",
    "Shell Scripting",
  ],
  "Cloud Architect": [
    "AWS",
    "Cloud Computing",
    "System Design",
    "Networking",
    "Security",
    "Git",
  ],
  "Cybersecurity Analyst": [
    "Networking",
    "Linux",
    "Security",
    "Python",
    "Cryptography",
    "Penetration Testing",
  ],
  "Mobile Developer": ["React Native", "Swift", "Kotlin", "JavaScript", "Git"],
};

const COMPANY_REQUIREMENTS = [
  {
    name: "Google",
    skills: ["Data Structures", "Algorithms", "System Design", "Projects"],
  },
  {
    name: "Amazon",
    skills: ["Data Structures", "Algorithms", "DBMS", "OOP", "Projects"],
  },
  {
    name: "Microsoft",
    skills: ["TypeScript", "SQL", "Git", "Algorithms", "Projects"],
  },
  { name: "JPMC", skills: ["Java", "SQL", "Algorithms", "Git", "Projects"] },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  await dbConnect();

  // Fetch full details from DB
  const userDoc = await User.findById(userId);
  let profileDoc = await Profile.findOne({ userId });
  let resumeDoc = await ResumeAnalysis.findOne({ userId });

  if (!userDoc) {
    redirect("/login");
  }

  // Fallback profile if none exists
  const profile = profileDoc || {
    cgpa: 0,
    skills: [],
    certifications: [],
    targetRole: "",
    projects: [],
    dsaProgress: 0,
  };

  // Fetch goals
  const goals = await Goal.find({ userId });
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === "Completed").length;
  const pendingGoals = goals.filter(
    (g) => g.status === "Pending" || g.status === "In Progress",
  ).length;
  const goalsCompletionRate =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const userSkillsLower = (profile.skills || []).map((s) =>
    s.toLowerCase().trim(),
  );
  const targetRole = profile.targetRole || "";
  const requiredSkills = ROLE_SKILLS[targetRole] || [];
  // Calculate missing and acquired skills
  const missingSkills = requiredSkills.filter(
    (skill) => !userSkillsLower.includes(skill.toLowerCase().trim()),
  );
  const acquiredSkills = requiredSkills.filter((skill) =>
    userSkillsLower.includes(skill.toLowerCase().trim()),
  );

  // Score calculations (100 pts) - Phase 13 Formula
  let skillsPoints = 0;
  if (targetRole) {
    skillsPoints =
      requiredSkills.length > 0
        ? Math.round((acquiredSkills.length / requiredSkills.length) * 25)
        : 0;
  } else {
    skillsPoints = Math.min(25, (profile.skills?.length || 0) * 4);
  }

  const projectsCount = profile.projects?.length || 0;
  const projectsPoints = Math.min(25, Math.round(projectsCount * 12.5));

  const dsaProgressVal = profile.dsaProgress || 0;
  const dsaPoints = Math.round(dsaProgressVal * 0.2);

  const certsCount = profile.certifications?.length || 0;
  const certsPoints = Math.min(10, certsCount * 5);

  const resumeScoreVal = resumeDoc ? resumeDoc.readinessScore : 0;
  const resumePoints = Math.round((resumeScoreVal / 100) * 20);

  const readinessScore =
    skillsPoints + projectsPoints + dsaPoints + certsPoints + resumePoints;

  // Company alignment check count (scout high matching score count)
  const strongMatchesCount = COMPANY_REQUIREMENTS.map((company) => {
    const matchedCount = company.skills.filter((skill) => {
      const sKey = skill.toLowerCase();
      if (sKey === "projects") return projectsCount >= 1;
      if (sKey === "oop") {
        return (
          userSkillsLower.includes("oop") ||
          userSkillsLower.includes("java") ||
          userSkillsLower.includes("python") ||
          userSkillsLower.includes("c++") ||
          userSkillsLower.includes("c#")
        );
      }
      return userSkillsLower.includes(sKey);
    }).length;
    const score = Math.round((matchedCount / company.skills.length) * 100);
    return score >= 80;
  }).filter(Boolean).length;

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden space-y-8 animate-slide-up">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />

      {/* Overview Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            Welcome back, {userDoc.name}!
          </h1>
          <p className="text-slate-400 mt-1">
            Overview statistics of your academic profiles and corporate
            recruitment preparation.
          </p>
        </div>
        <Link href="/dashboard/profile">
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:from-violet-500 hover:to-indigo-500 transition-all cursor-pointer">
            Edit Career Profile
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* QUICK STATS SaaS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Stat 1: Readiness Score */}
        <Card className="glass-panel p-5 flex items-center gap-4 transition-all duration-300">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shadow-inner">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{readinessScore}%</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Readiness Score
            </p>
          </div>
        </Card>

        {/* Stat 2: Skills Count */}
        <Card className="glass-panel p-5 flex items-center gap-4 transition-all duration-300">
          <div className="h-12 w-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center shadow-inner">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">
              {targetRole
                ? `${acquiredSkills.length} / ${requiredSkills.length}`
                : `${profile.skills?.length || 0}`}
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Skills Acquired
            </p>
          </div>
        </Card>

        {/* Stat 3: Projects */}
        <Card className="glass-panel p-5 flex items-center gap-4 transition-all duration-300">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shadow-inner">
            <FileCode className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{projectsCount}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Technical Projects
            </p>
          </div>
        </Card>

        {/* Stat 4: Company Alignments */}
        <Card className="glass-panel p-5 flex items-center gap-4 transition-all duration-300">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-inner">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">
              {strongMatchesCount} / 4
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Company Alignments
            </p>
          </div>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMN 1: Profile Details Card */}
        <div className="space-y-8 lg:col-span-1">
          <Card className="glass-panel border border-white/5 bg-slate-900/20 shadow-xl">
            <CardHeader className="border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg">
                  <UserIcon className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    {userDoc.name}
                  </CardTitle>
                  <CardDescription className="text-indigo-400 font-semibold text-xs mt-0.5 tracking-wider uppercase">
                    {targetRole || "No Target Role Selected"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="h-5 w-5 text-indigo-400 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm truncate font-medium">
                    {userDoc.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <GraduationCap className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    College
                  </p>
                  <p className="text-sm font-semibold">{userDoc.college}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <BookOpen className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Branch & CGPA
                  </p>
                  <p className="text-sm font-semibold">
                    {userDoc.branch}{" "}
                    {profile.cgpa
                      ? `• ${Number(profile.cgpa).toFixed(2)} CGPA`
                      : "• CGPA unset"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Briefcase className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Graduation Year
                  </p>
                  <p className="text-sm font-semibold">
                    {userDoc.graduationYear}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Skills display */}
          <Card className="glass-panel border border-white/5 bg-slate-900/20 shadow-xl p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-400" /> Professional
                Skills
              </h3>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/10 font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No skills listed yet.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* COLUMN 2 & 3: Stats Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Placement Readiness */}
            <Card className="glass-panel border border-white/5 bg-slate-900/20 shadow-xl p-6 h-64 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-400" />
                    Readiness score
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Preparation benchmark points inventory.
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                  LIVE
                </span>
              </div>

              <div className="flex items-center justify-center my-2">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-indigo-600/10 rounded-full blur-xl" />
                  <div className="flex flex-col items-center justify-center bg-slate-950 h-24 w-24 rounded-full border-4 border-indigo-600/80 shadow-2xl relative z-10">
                    <span className="text-2xl font-black text-white">
                      {readinessScore}%
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                      Ready
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors justify-end">
                <Link
                  href="/dashboard/readiness"
                  className="flex items-center gap-1"
                >
                  Check points checklist
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>

            {/* 2. Target Company alignment */}
            <Card className="glass-panel border border-white/5 bg-slate-900/20 shadow-xl p-6 h-64 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-400" />
                  Company Matching
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Alignment metrics with tech hiring companies.
                </p>
              </div>

              <div className="space-y-3 overflow-y-auto pr-1">
                {COMPANY_REQUIREMENTS.map((company) => {
                  const matchedCount = company.skills.filter((skill) => {
                    const sKey = skill.toLowerCase();
                    if (sKey === "projects") return projectsCount >= 1;
                    if (sKey === "oop") {
                      return (
                        userSkillsLower.includes("oop") ||
                        userSkillsLower.includes("java") ||
                        userSkillsLower.includes("python") ||
                        userSkillsLower.includes("c++") ||
                        userSkillsLower.includes("c#")
                      );
                    }
                    return userSkillsLower.includes(sKey);
                  }).length;
                  const percent = Math.round(
                    (matchedCount / company.skills.length) * 100,
                  );

                  return (
                    <div key={company.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{company.name}</span>
                        <span className="text-indigo-400">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors justify-end">
                <Link
                  href="/dashboard/company-readiness"
                  className="flex items-center gap-1"
                >
                  Analyze readiness checker
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 3. Skill Gaps */}
            <Card className="glass-panel border border-white/5 bg-slate-900/20 shadow-xl p-6 h-64 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-indigo-400" />
                  Skill Gap
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {targetRole
                    ? `Key missing skills for ${targetRole}:`
                    : "Select target role to analyze skill gap."}
                </p>
              </div>

              <div className="flex-1 my-3 overflow-y-auto pr-1">
                {targetRole ? (
                  missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/10"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-xs text-emerald-400 font-semibold">
                      🎉 Skill gap closed! Perfect preparation.
                    </div>
                  )
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No target role selected.
                  </p>
                )}
              </div>

              <div className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors justify-end">
                <Link
                  href="/dashboard/skill-gap"
                  className="flex items-center gap-1"
                >
                  Open detailed analysis
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>

            {/* 4. Timeline Roadmap progress */}
            <Card className="glass-panel border border-white/5 bg-slate-900/20 shadow-xl p-6 h-64 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Map className="h-5 w-5 text-indigo-400" />
                  Roadmap Milestone
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Structured career progress tracking.
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-center my-3">
                {targetRole ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                      <span>Status</span>
                      <span className="text-indigo-400">
                        {acquiredSkills.length} / {requiredSkills.length + 2}{" "}
                        Steps
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500 h-full rounded-full"
                        style={{
                          width: `${Math.round((acquiredSkills.length / (requiredSkills.length + 2)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Select a target role to unlock dynamic timelines.
                  </p>
                )}
              </div>

              <div className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors justify-end">
                <Link
                  href="/dashboard/roadmap"
                  className="flex items-center gap-1"
                >
                  Open roadmap timeline
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>

            {/* 5. Weekly Goal Tracker Widget */}
            <Card className="glass-panel border border-white/5 bg-slate-900/20 shadow-xl p-6 h-64 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-indigo-400" />
                    Weekly Goals
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Track career preparation milestones.
                  </p>
                </div>
                {totalGoals > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                    {goalsCompletionRate}% Done
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center my-3 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-semibold">Status Progress</span>
                  <span className="text-white font-bold">
                    {completedGoals} / {totalGoals} Goals
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${goalsCompletionRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-bold pt-1.5 border-t border-white/2">
                  <span>Pending: {pendingGoals}</span>
                  <span>Completed: {completedGoals}</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors justify-end">
                <Link
                  href="/dashboard/goals"
                  className="flex items-center gap-1"
                >
                  Manage weekly goals
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
