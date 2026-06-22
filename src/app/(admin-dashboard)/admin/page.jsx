import React from "react";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Profile from "@/models/Profile";
import Resource from "@/models/Resource";
import Goal from "@/models/Goal";
import { Card } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  FileCode,
  CheckSquare,
  Award,
  GraduationCap,
  Sparkles,
  TrendingUp,
} from "lucide-react";

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

export default async function AdminDashboardPage() {
  await dbConnect();

  // 1. Fetch core stats counts
  const totalUsers = await User.countDocuments();
  const totalResources = await Resource.countDocuments();
  const totalGoals = await Goal.countDocuments();

  // Aggregate total projects count across all profiles
  const profileProjects = await Profile.aggregate([
    { $project: { projectsCount: { $size: { $ifNull: ["$projects", []] } } } },
    { $group: { _id: null, totalProjects: { $sum: "$projectsCount" } } },
  ]);
  const totalProjects = profileProjects[0]?.totalProjects || 0;

  // 2. Fetch popular resource categories
  const categoryCounts = await Resource.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Find max category count to compute percentage heights
  const maxCount =
    categoryCounts.length > 0
      ? Math.max(...categoryCounts.map((c) => c.count))
      : 1;

  // 3. Compute student preparation analytics (Average CGPA, Average Readiness Score)
  const allUsers = await User.find({}, "name college branch graduationYear");
  const allProfiles = await Profile.find({});
  const userMap = new Map(allUsers.map((u) => [u._id.toString(), u]));

  let totalScoreSum = 0;
  let studentCount = 0;
  let totalCgpaSum = 0;
  let cgpaCount = 0;

  allProfiles.forEach((profile) => {
    const userIdStr = profile.userId.toString();
    const user = userMap.get(userIdStr);
    if (!user) return; // ignore orphans

    studentCount++;

    // Calculate score details matching readiness algorithms
    let skillsPoints = 0;
    const targetRole = profile.targetRole || "";
    const requiredSkills = ROLE_SKILLS[targetRole] || [];
    const userSkillsLower = (profile.skills || []).map((s) =>
      s.toLowerCase().trim(),
    );

    if (targetRole) {
      const acquiredSkills = requiredSkills.filter((skill) =>
        userSkillsLower.includes(skill.toLowerCase().trim()),
      );
      skillsPoints =
        requiredSkills.length > 0
          ? Math.round((acquiredSkills.length / requiredSkills.length) * 30)
          : 0;
    } else {
      skillsPoints = Math.min(30, (profile.skills?.length || 0) * 5);
    }

    const pCount = profile.projects?.length || 0;
    const projectsPoints = Math.min(25, pCount * 10);

    const dsaProgressVal = profile.dsaProgress || 0;
    const dsaPoints = Math.round(dsaProgressVal * 0.25);

    const certsCount = profile.certifications?.length || 0;
    const certsPoints = Math.min(10, certsCount * 5);

    let profilePoints = 0;
    if (user.name) profilePoints += 2;
    if (user.college) profilePoints += 2;
    if (user.branch) profilePoints += 2;
    if (user.graduationYear) profilePoints += 2;
    if (profile.cgpa > 0) {
      profilePoints += 1;
      totalCgpaSum += profile.cgpa;
      cgpaCount++;
    }
    if (targetRole) profilePoints += 1;

    const score =
      skillsPoints + projectsPoints + dsaPoints + certsPoints + profilePoints;
    totalScoreSum += score;
  });

  const averageReadiness =
    studentCount > 0 ? Math.round(totalScoreSum / studentCount) : 0;
  const averageCgpa =
    cgpaCount > 0 ? (totalCgpaSum / cgpaCount).toFixed(2) : "0.00";

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 space-y-8 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
          <TrendingUp className="h-10 w-10 text-indigo-400" />
          Admin Analytics Overview
        </h1>
        <p className="text-slate-400 mt-1">
          Review system metrics, student activity indexes, and preparation
          benchmarks.
        </p>
      </div>

      {/* Grid: Core Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1: Total Users */}
        <Card className="glass-panel p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{totalUsers}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Total Users
            </p>
          </div>
        </Card>

        {/* Stat 2: Total Resources */}
        <Card className="glass-panel p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{totalResources}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Total Resources
            </p>
          </div>
        </Card>

        {/* Stat 3: Total Projects */}
        <Card className="glass-panel p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <FileCode className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{totalProjects}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Total Projects
            </p>
          </div>
        </Card>

        {/* Stat 4: Total Goals */}
        <Card className="glass-panel p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{totalGoals}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Total Goals
            </p>
          </div>
        </Card>
      </div>

      {/* Grid: Popular Categories & Student Activity metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Popular Categories Card */}
        <Card className="glass-panel p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              Most Popular Resource Categories
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Resource distribution counts index across all categories.
            </p>
          </div>

          <div className="space-y-4">
            {categoryCounts.length > 0 ? (
              categoryCounts.map((cat) => {
                const percent = Math.round((cat.count / maxCount) * 100);
                return (
                  <div key={cat._id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{cat._id}</span>
                      <span className="text-indigo-400">
                        {cat.count} resource{cat.count > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 italic">
                No resources added yet.
              </p>
            )}
          </div>
        </Card>

        {/* Student Activity Metrics */}
        <Card className="glass-panel p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              Student Performance Benchmarks
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Aggregated preparation activity calculated from active profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
            {/* Avg Readiness Score */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Avg Readiness
                </p>
                <p className="text-xl font-black text-white">
                  {averageReadiness}%
                </p>
              </div>
            </div>

            {/* Avg CGPA */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Avg CGPA
                </p>
                <p className="text-xl font-black text-white">
                  {averageCgpa} / 10
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-slate-400 leading-relaxed">
            <span className="font-bold text-indigo-400 block mb-0.5">
              Scouter Visibility Info
            </span>
            Placement readiness score evaluates all parameters (CGPA, skills,
            projects, certifications, and goals completion). Regular updates to
            profile databases directly enhance these averages.
          </div>
        </Card>
      </div>
    </div>
  );
}
