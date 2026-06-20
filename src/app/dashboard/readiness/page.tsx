import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Briefcase,
  Compass,
  ArrowRight,
  BookOpen,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

const ROLE_SKILLS: Record<string, string[]> = {
  'Frontend Developer': ['React', 'HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'TypeScript', 'Next.js'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL', 'DBMS', 'Docker', 'Git'],
  'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'DBMS', 'SQL', 'Tailwind CSS', 'TypeScript'],
  'Software Engineer': ['Data Structures', 'Algorithms', 'DBMS', 'Java', 'Python', 'System Design', 'Git'],
  'Data Analyst': ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics', 'Pandas', 'PowerBI'],
};

export default async function ReadinessScorePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  await dbConnect();
  const userDoc = await User.findById(userId);
  const profileDoc = await Profile.findOne({ userId });

  if (!userDoc) {
    redirect("/login");
  }

  const profile = profileDoc || {
    cgpa: 0,
    skills: [],
    certifications: [],
    targetRole: '',
    projects: [],
    dsaProgress: 0,
  };

  const userSkillsLower = (profile.skills || []).map((s: string) => s.toLowerCase().trim());
  const targetRole = profile.targetRole || '';
  const requiredSkills = ROLE_SKILLS[targetRole] || [];

  // Calculate acquired and missing skills for target role
  const acquiredSkills = requiredSkills.filter((skill) =>
    userSkillsLower.includes(skill.toLowerCase().trim())
  );
  const missingSkills = requiredSkills.filter((skill) =>
    !userSkillsLower.includes(skill.toLowerCase().trim())
  );

  // Scoring Component Calculations (Max 100 points)

  // 1. Skills (Max 30)
  let skillsPoints = 0;
  if (targetRole) {
    skillsPoints = requiredSkills.length > 0 
      ? Math.round((acquiredSkills.length / requiredSkills.length) * 30) 
      : 0;
  } else {
    skillsPoints = Math.min(30, (profile.skills?.length || 0) * 5);
  }

  // 2. Projects (Max 25)
  // Formula: 10 points per project up to 25
  const projectsCount = profile.projects?.length || 0;
  const projectsPoints = Math.min(25, projectsCount * 10);

  // 3. DSA Progress (Max 25)
  // Formula: dsaProgress percentage * 0.25
  const dsaProgressVal = profile.dsaProgress || 0;
  const dsaPoints = Math.round(dsaProgressVal * 0.25);

  // 4. Certifications (Max 10)
  // Formula: 5 points per certification up to 10
  const certsCount = profile.certifications?.length || 0;
  const certsPoints = Math.min(10, certsCount * 5);

  // 5. Profile Completion (Max 10)
  // Name (+2), College (+2), Branch (+2), GraduationYear (+2), CGPA set (+1), TargetRole set (+1)
  let profilePoints = 0;
  if (userDoc.name) profilePoints += 2;
  if (userDoc.college) profilePoints += 2;
  if (userDoc.branch) profilePoints += 2;
  if (userDoc.graduationYear) profilePoints += 2;
  if (profile.cgpa > 0) profilePoints += 1;
  if (targetRole) profilePoints += 1;

  const totalScore = skillsPoints + projectsPoints + dsaPoints + certsPoints + profilePoints;

  // Determine Strengths
  const strengths: string[] = [];
  if (skillsPoints >= 20) strengths.push("Strong alignment with core technologies for the target role");
  if (projectsPoints >= 20) strengths.push("Completed multiple hands-on development projects");
  if (dsaProgressVal >= 60) strengths.push(`Excellent DSA preparation status (${dsaProgressVal}% completed)`);
  if (certsPoints >= 10) strengths.push("Holds multiple industry-certified credentials");
  if (profile.cgpa >= 8.0) strengths.push(`Maintained a high academic scoring background (${profile.cgpa.toFixed(2)} CGPA)`);
  if (strengths.length === 0) strengths.push("Account registered successfully and placement tracking activated");

  // Determine Improvement Areas & Suggestions
  const suggestions: string[] = [];
  if (missingSkills.length > 0) {
    suggestions.push(`Acquire core target skills: ${missingSkills.slice(0, 3).join(", ")}`);
  }
  if (projectsCount < 1) {
    suggestions.push("Build one full stack project to highlight development competencies");
  } else if (projectsCount < 2) {
    suggestions.push("Build another advanced repository to expand technical breadth");
  }
  if (dsaProgressVal < 50) {
    suggestions.push("Improve DSA progress (Aim to complete foundational data structures & algorithms)");
  }
  if (certsCount < 1) {
    suggestions.push("Earn an industry-standard certification to validate your skill set");
  }
  if (profilePoints < 10) {
    suggestions.push("Fill out any empty basic fields in your profile to complete setup");
  }

  // Circular progress dimensions
  const radius = 60;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />

      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
              <Award className="h-10 w-10 text-indigo-400" />
              Placement Readiness Score
            </h1>
            <p className="text-slate-400 mt-1">
              Your preparation score evaluated against technical placement requirements.
            </p>
          </div>
          <Link href="/dashboard/profile">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer shadow-lg shadow-indigo-600/20">
              Update Profile details
            </Button>
          </Link>
        </div>

        {/* Dial & Score Breakdown grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Circular Ring Card */}
          <Card className="md:col-span-1 border border-border/10 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col items-center justify-center text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                Overall Index
              </CardTitle>
            </CardHeader>
            <div className="relative flex items-center justify-center my-6">
              {/* Glowing gradient background */}
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
              
              {/* Circular Ring */}
              <svg className="w-40 h-40 transform -rotate-90 relative z-10">
                {/* Background circle */}
                <circle
                  className="text-slate-800"
                  strokeWidth={strokeWidth}
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="80"
                  cy="80"
                />
                {/* Foreground Progress */}
                <circle
                  className="text-indigo-500 transition-all duration-500 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="url(#progressGradient)"
                  fill="transparent"
                  r={radius}
                  cx="80"
                  cy="80"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center Text */}
              <div className="absolute flex flex-col items-center justify-center relative z-20">
                <span className="text-3xl font-black text-white">{totalScore}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Points</span>
              </div>
            </div>
            <div className="text-xs font-semibold text-indigo-400 mt-2 px-3 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/10">
              {totalScore >= 80 ? "Level: Elite Candidate" : totalScore >= 60 ? "Level: Strong Match" : "Level: Build Profile"}
            </div>
          </Card>

          {/* Breakdown Score details */}
          <Card className="md:col-span-2 border border-border/10 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white border-b border-border/10 pb-3 flex items-center justify-between">
                <span>Score Checklist Breakdown</span>
                <span className="text-xs text-indigo-400 font-bold">{totalScore} / 100 points</span>
              </h3>

              <div className="space-y-4 mt-4">
                {/* 1. Skills */}
                <div className="flex justify-between items-center text-xs p-3 rounded bg-slate-950/60 border border-border/5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200">Required Skills Profile</span>
                    <p className="text-[10px] text-slate-500">Acquire core skills for selected target role (Max 30 pts)</p>
                  </div>
                  <span className="font-bold text-indigo-400">{skillsPoints} / 30 pts</span>
                </div>

                {/* 2. Projects */}
                <div className="flex justify-between items-center text-xs p-3 rounded bg-slate-950/60 border border-border/5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200">Portfolio Projects</span>
                    <p className="text-[10px] text-slate-500">10 pts per project added to profile (Max 25 pts)</p>
                  </div>
                  <span className="font-bold text-indigo-400">{projectsPoints} / 25 pts</span>
                </div>

                {/* 3. DSA Progress */}
                <div className="flex justify-between items-center text-xs p-3 rounded bg-slate-950/60 border border-border/5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200">Data Structures & Algorithms Progress</span>
                    <p className="text-[10px] text-slate-500">Proportional to DSA curriculum percentage (Max 25 pts)</p>
                  </div>
                  <span className="font-bold text-indigo-400">{dsaPoints} / 25 pts</span>
                </div>

                {/* 4. Certifications */}
                <div className="flex justify-between items-center text-xs p-3 rounded bg-slate-950/60 border border-border/5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200">Certifications & Validations</span>
                    <p className="text-[10px] text-slate-500">5 pts per credential listing (Max 10 pts)</p>
                  </div>
                  <span className="font-bold text-indigo-400">{certsPoints} / 10 pts</span>
                </div>

                {/* 5. Profile Completion */}
                <div className="flex justify-between items-center text-xs p-3 rounded bg-slate-950/60 border border-border/5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200">Profile Completion Details</span>
                    <p className="text-[10px] text-slate-500">Academics, college, target selection inputs (Max 10 pts)</p>
                  </div>
                  <span className="font-bold text-indigo-400">{profilePoints} / 10 pts</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Missing Skills & Suggestion Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Missing Target Skills */}
          <Card className="border border-border/10 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-indigo-400" />
                Missing Key Competencies
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {targetRole 
                  ? `Required core competencies for ${targetRole} missing from your profile:` 
                  : "Specify a target role in your profile to analyze skill gaps."}
              </p>

              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {targetRole ? (
                  missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {missingSkills.map((skill) => (
                        <span key={skill} className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/10 font-medium">
                          <AlertCircle className="h-3 w-3 text-rose-400" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-xs text-emerald-400 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      All core technical skills acquired! Outstanding.
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-slate-950 border border-border/5 rounded-lg text-xs text-slate-500 italic">
                    <Compass className="h-4 w-4 text-slate-600" />
                    Example missing skills: React, DBMS, System Design
                  </div>
                )}
              </div>
            </div>
            
            {/* Direct navigation helper */}
            <div className="pt-4 border-t border-border/5 flex justify-end">
              <Link href="/dashboard/skill-gap" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Deep Skill Gap analysis
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>

          {/* Dynamic Action Suggestions */}
          <Card className="border border-border/10 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <Compass className="h-5 w-5 text-indigo-400" />
                Improvement Suggestions
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Recommended tasks to directly increase your placement readiness score:
              </p>

              <ul className="text-xs text-slate-300 space-y-2">
                {suggestions.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 rounded bg-slate-950/60 border border-border/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border/5 flex justify-end">
              <Link href="/dashboard/roadmap" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View study roadmap
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>

        </div>

        {/* Strengths Inventory card */}
        <Card className="border border-border/10 bg-slate-900/40 p-6 backdrop-blur-md">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            Verified Portfolio Strengths
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {strengths.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-xs text-slate-300">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
