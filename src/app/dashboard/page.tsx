import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase
} from "lucide-react";
import Link from "next/link";

// Define role-specific standard skills
const ROLE_SKILLS: Record<string, string[]> = {
  'Frontend Developer': ['React', 'HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'TypeScript', 'Next.js'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL', 'DBMS', 'Docker', 'Git'],
  'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'DBMS', 'SQL', 'Tailwind CSS', 'TypeScript'],
  'Software Engineer': ['Data Structures', 'Algorithms', 'DBMS', 'Java', 'Python', 'System Design', 'Git'],
  'Data Analyst': ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics', 'Pandas', 'PowerBI'],
};

const COMPANY_REQUIREMENTS = [
  { name: 'Google', skills: ['Data Structures', 'Algorithms', 'System Design', 'Python', 'Java', 'C++'] },
  { name: 'Microsoft', skills: ['TypeScript', 'SQL', 'Git', 'Algorithms', 'C++', 'Docker'] },
  { name: 'Amazon', skills: ['Java', 'System Design', 'REST APIs', 'Data Structures', 'SQL', 'Docker'] },
  { name: 'Meta', skills: ['React', 'JavaScript', 'TypeScript', 'Algorithms', 'System Design', 'Git'] },
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

  if (!userDoc) {
    redirect("/login");
  }

  // Fallback profile if none exists
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
  
  // Calculate missing and acquired skills
  const missingSkills = requiredSkills.filter(
    (skill: string) => !userSkillsLower.includes(skill.toLowerCase().trim())
  );
  const acquiredSkills = requiredSkills.filter(
    (skill: string) => userSkillsLower.includes(skill.toLowerCase().trim())
  );

  // New Placement Readiness Score calculation (align with /dashboard/readiness)
  let skillsPoints = 0;
  if (targetRole) {
    skillsPoints = requiredSkills.length > 0 
      ? Math.round((acquiredSkills.length / requiredSkills.length) * 30) 
      : 0;
  } else {
    skillsPoints = Math.min(30, (profile.skills?.length || 0) * 5);
  }

  const projectsCount = profile.projects?.length || 0;
  const projectsPoints = Math.min(25, projectsCount * 10);

  const dsaProgressVal = profile.dsaProgress || 0;
  const dsaPoints = Math.round(dsaProgressVal * 0.25);

  const certsCount = profile.certifications?.length || 0;
  const certsPoints = Math.min(10, certsCount * 5);

  let profilePoints = 0;
  if (userDoc.name) profilePoints += 2;
  if (userDoc.college) profilePoints += 2;
  if (userDoc.branch) profilePoints += 2;
  if (userDoc.graduationYear) profilePoints += 2;
  if (profile.cgpa > 0) profilePoints += 1;
  if (targetRole) profilePoints += 1;

  const readinessScore = skillsPoints + projectsPoints + dsaPoints + certsPoints + profilePoints;

  // 2. Company matches calculation
  const companyMatches = COMPANY_REQUIREMENTS.map((company) => {
    const matchingSkillsCount = company.skills.filter((skill) =>
      userSkillsLower.includes(skill.toLowerCase().trim())
    ).length;
    // Calculate percentage: base match of 30% + skill ratio of 70%
    const percent = Math.round(30 + (matchingSkillsCount / company.skills.length) * 70);
    return {
      name: company.name,
      percent: Math.min(100, percent),
      matchingSkillsCount,
      totalSkillsCount: company.skills.length
    };
  });

  // 3. Roadmap Progress calculation
  const totalRoadmapSteps = requiredSkills.length || 5;
  const completedRoadmapSteps = acquiredSkills.length || 0;
  const roadmapPercent = requiredSkills.length 
    ? Math.round((completedRoadmapSteps / totalRoadmapSteps) * 100) 
    : 0;

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />

      <div className="mx-auto max-w-6xl space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              Welcome back, {userDoc.name}!
            </h1>
            <p className="text-slate-400 mt-1">
              Here is your professional readiness summary and career roadmap.
            </p>
          </div>
          <Link href="/dashboard/profile">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:from-violet-500 hover:to-indigo-500 transition-all cursor-pointer">
              Edit Career Profile
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: User Summary Profile Card */}
          <div className="space-y-8 lg:col-span-1">
            <Card className="border border-border/10 bg-slate-900/40 shadow-xl backdrop-blur-md">
              <CardHeader className="border-b border-border/10 pb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg">
                    <UserIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">{userDoc.name}</CardTitle>
                    <CardDescription className="text-indigo-400 font-semibold text-xs mt-0.5 tracking-wider uppercase">
                      {targetRole || 'No Target Role Selected'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="h-5 w-5 text-indigo-400 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email</p>
                    <p className="text-sm truncate font-medium">{userDoc.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <GraduationCap className="h-5 w-5 text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">College</p>
                    <p className="text-sm font-semibold">{userDoc.college}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <BookOpen className="h-5 w-5 text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Branch & CGPA</p>
                    <p className="text-sm font-semibold">
                      {userDoc.branch} {profile.cgpa ? `• ${Number(profile.cgpa).toFixed(2)} CGPA` : '• CGPA unset'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <Briefcase className="h-5 w-5 text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Graduation Year</p>
                    <p className="text-sm font-semibold">{userDoc.graduationYear}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Skills & Certifications Preview */}
            <Card className="border border-border/10 bg-slate-900/40 shadow-xl backdrop-blur-md p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">My Skills</h3>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((skill: string) => (
                      <span key={skill} className="text-xs px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/10 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No skills listed yet. Add skills on your Profile tab.</p>
                )}
              </div>

              <div className="pt-2 border-t border-border/5">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Certifications</h3>
                {profile.certifications && profile.certifications.length > 0 ? (
                  <ul className="text-xs text-slate-400 space-y-1">
                    {profile.certifications.map((cert: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 bg-violet-400 rounded-full" />
                        <span className="truncate">{cert}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">No certifications added.</p>
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT & MID COLUMNS: Dashboard Cards Grid */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Top row cards: Placement Readiness Score & Target Company Match */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Placement Readiness Score Card */}
              <Card className="border border-border/10 bg-slate-900/40 shadow-xl backdrop-blur-md flex flex-col justify-between p-6 h-64">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Award className="h-5 w-5 text-indigo-400" />
                      Readiness Score
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Based on profile completion, CGPA & skills.</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Live Score
                  </span>
                </div>

                <div className="flex items-center justify-center my-4">
                  <div className="relative flex items-center justify-center">
                    {/* Inner glowing circle */}
                    <div className="absolute inset-0 bg-indigo-600/10 rounded-full blur-xl" />
                    
                    {/* Ring score */}
                    <div className="flex flex-col items-center justify-center bg-slate-950 h-28 w-28 rounded-full border-4 border-indigo-600/80 shadow-2xl relative z-10">
                      <span className="text-3xl font-extrabold text-white">{readinessScore}%</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Ready</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-center text-slate-400 font-medium">
                  {readinessScore >= 80 ? (
                    <span className="text-emerald-400 flex items-center justify-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> High placement readiness!
                    </span>
                  ) : readinessScore >= 50 ? (
                    <span className="text-amber-400">Moderate readiness. Add more target skills to boost score.</span>
                  ) : (
                    <span className="text-rose-400">Complete your profile setup to unlock career readiness.</span>
                  )}
                </div>
              </Card>

              {/* Target Company Match Card */}
              <Card className="border border-border/10 bg-slate-900/40 shadow-xl backdrop-blur-md flex flex-col justify-between p-6 h-64">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-400" />
                    Target Company Match
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Skill alignment with major tech hiring partners.</p>
                </div>

                <div className="space-y-3 my-2 overflow-y-auto pr-1">
                  {companyMatches.map((company) => (
                    <div key={company.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{company.name}</span>
                        <span className="text-indigo-400">{company.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${company.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-slate-500 text-center font-medium">
                  Matches are dynamically calculated from your listed skills.
                </div>
              </Card>
            </div>

            {/* Bottom row cards: Missing Skills & Roadmap Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Missing Skills Card */}
              <Card className="border border-border/10 bg-slate-900/40 shadow-xl backdrop-blur-md p-6 h-72 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-indigo-400" />
                    Missing Skills
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {targetRole 
                      ? `Key requirements for ${targetRole} you haven't added yet.` 
                      : "Choose a target role to view missing skill requirements."}
                  </p>
                </div>

                <div className="flex-1 my-4 overflow-y-auto pr-1">
                  {!targetRole ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <AlertCircle className="h-8 w-8 text-slate-600 mb-2" />
                      <p className="text-xs text-slate-500">
                        Please set a Target Role in your profile to analyze skill gaps.
                      </p>
                    </div>
                  ) : missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {missingSkills.map((skill) => (
                        <span key={skill} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/10 font-medium">
                          <AlertCircle className="h-3 w-3 text-rose-400" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                      <p className="text-xs text-slate-400 font-semibold text-emerald-400">
                        All set! You have listed all core skills for this role.
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors justify-end">
                  <Link href="/dashboard/skill-gap" className="flex items-center gap-1">
                    Go to Skill Gap analysis
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>

              {/* Roadmap Progress Card */}
              <Card className="border border-border/10 bg-slate-900/40 shadow-xl backdrop-blur-md p-6 h-72 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Map className="h-5 w-5 text-indigo-400" />
                    Roadmap Progress
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Milestones tracking based on role skills.</p>
                </div>

                <div className="flex-1 my-4 flex flex-col justify-center">
                  {!targetRole ? (
                    <div className="text-center p-4 text-xs text-slate-500 italic">
                      Choose a target role to unlock a customized skill learning roadmap.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                        <span>Milestones Reached</span>
                        <span className="text-indigo-400">
                          {completedRoadmapSteps} of {totalRoadmapSteps} ({roadmapPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${roadmapPercent}%` }}
                        />
                      </div>

                      {/* Next suggested milestone */}
                      {missingSkills.length > 0 ? (
                        <div className="p-3 rounded-lg bg-slate-950/60 border border-border/5 space-y-1">
                          <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">Suggested Next Step</p>
                          <p className="text-xs text-slate-200 font-semibold flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                            Learn & master <span className="text-indigo-300 underline font-extrabold">{missingSkills[0]}</span>
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400 font-semibold text-center">
                          🎉 Outstanding! You are ready for mock interviews.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors justify-end">
                  <Link href="/dashboard/roadmap" className="flex items-center gap-1">
                    View complete path
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
