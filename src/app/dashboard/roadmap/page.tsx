import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Map,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PlayCircle,
  Lock,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

// Mapping skills based on target role
const ROLE_SKILLS: Record<string, string[]> = {
  'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL'],
  'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'SQL'],
  'Software Engineer': ['Data Structures', 'Algorithms', 'DBMS', 'System Design'],
  'Data Analyst': ['Python', 'SQL', 'Excel', 'Tableau'],
};

interface RoadmapStep {
  title: string;
  type: 'skill' | 'projects' | 'interview';
  desc: string;
  completed: boolean;
}

export default async function RoadmapPage() {
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
    skills: [],
    targetRole: '',
    projects: [],
    dsaProgress: 0,
    certifications: [],
    cgpa: 0,
  };

  const userSkillsLower = (profile.skills || []).map((s: string) => s.toLowerCase().trim());
  const targetRole = profile.targetRole || '';
  
  // Base skills for selected target role
  const roleSkills = ROLE_SKILLS[targetRole] || [];

  // Generate dynamic 6-step roadmap
  const roadmapSteps: RoadmapStep[] = [];

  // Steps 1 to N-2: Skill steps
  roleSkills.forEach((skill) => {
    roadmapSteps.push({
      title: skill,
      type: 'skill',
      desc: `Master core syntax, layouts, and practical implementation patterns for ${skill}.`,
      completed: userSkillsLower.includes(skill.toLowerCase().trim()),
    });
  });

  // Step 5: Projects
  const projectsCount = profile.projects?.length || 0;
  const hasProjects = projectsCount >= 1;
  roadmapSteps.push({
    title: 'Projects',
    type: 'projects',
    desc: 'Build at least one full-stack or complex project to demonstrate implementation skills.',
    completed: hasProjects,
  });

  // Step 6: Interview Preparation
  // Completed if all other skills and projects steps are completed
  const allSkillsCompleted = roleSkills.every((s) => userSkillsLower.includes(s.toLowerCase().trim()));
  const isInterviewReady = allSkillsCompleted && hasProjects;
  roadmapSteps.push({
    title: 'Interview Preparation',
    type: 'interview',
    desc: 'Review data structures, practice mock HR answers, and run system design trials.',
    completed: isInterviewReady,
  });

  // Calculate completion percentage
  const completedStepsCount = roadmapSteps.filter((s) => s.completed).length;
  const totalStepsCount = roadmapSteps.length;
  const progressPercent = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden animate-slide-up">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />

      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
              <Map className="h-10 w-10 text-indigo-400" />
              Career Roadmap Generator
            </h1>
            <p className="text-slate-400 mt-1">
              Personalized pathway mapping optimized for selected target role benchmarks.
            </p>
          </div>
          <Link href="/dashboard/profile">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer shadow-lg shadow-indigo-600/20">
              Update Profile Details
            </Button>
          </Link>
        </div>

        {!targetRole ? (
          <Card className="glass-panel p-12 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Target Role Selected</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Please configure a Target Job Role in your profile to generate a structured timeline roadmap.
            </p>
            <Link href="/dashboard/profile" className="inline-block mt-2">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer">
                Go to Profile
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-8">
            
            {/* Progress metrics card */}
            <Card className="glass-panel p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Roadmap: <span className="text-indigo-400">{targetRole} Pathway</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Completed {completedStepsCount} of {totalStepsCount} preparation milestones.
                    </p>
                  </div>
                  <span className="text-2xl font-black text-white">{progressPercent}% Completed</span>
                </div>
                
                {/* Horizontal Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Stepper Timeline */}
            <Card className="glass-panel p-8">
              <div className="relative border-l-2 border-indigo-500/20 ml-6 md:ml-8 space-y-12 pb-4">
                {roadmapSteps.map((step, index) => {
                  const isCompleted = step.completed;
                  
                  // A step is "Active" if it's not completed, but all previous steps are completed.
                  const isPreviousStepsCompleted = roadmapSteps.slice(0, index).every((s) => s.completed);
                  const isActive = !isCompleted && isPreviousStepsCompleted;
                  const isLocked = !isCompleted && !isPreviousStepsCompleted;

                  return (
                    <div key={index} className="relative pl-10 md:pl-12">
                      
                      {/* Node Timeline indicator */}
                      <div className={`absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 relative z-10 ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                          : isActive
                          ? "bg-indigo-600 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                          : "bg-slate-950 border-slate-700 text-slate-600"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : isActive ? (
                          <PlayCircle className="h-5 w-5" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h4 className={`text-sm font-extrabold tracking-tight ${
                            isCompleted ? "text-white" : isActive ? "text-indigo-300" : "text-slate-500"
                          }`}>
                            Step {index + 1}: {step.title}
                          </h4>
                          
                          <div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                                : isActive
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                                : "bg-slate-900 text-slate-600 border border-transparent"
                            }`}>
                              {isCompleted ? "COMPLETED" : isActive ? "IN PROGRESS" : "LOCKED"}
                            </span>
                          </div>
                        </div>

                        <p className={`text-xs max-w-xl leading-relaxed ${
                          isLocked ? "text-slate-600" : "text-slate-400"
                        }`}>
                          {step.desc}
                        </p>

                        {/* Action requirement tips */}
                        {isActive && (
                          <div className="mt-2 p-3 rounded-lg bg-slate-950/60 border border-border/5 text-[11px] max-w-md">
                            <span className="text-indigo-400 font-bold block mb-0.5">Required Action</span>
                            <span className="text-slate-300 font-medium">
                              {step.type === 'skill' && `Add "${step.title}" skill under your Profile settings.`}
                              {step.type === 'projects' && "Create and register at least one technical project on your profile."}
                              {step.type === 'interview' && "Complete mock interviews and prepare data sheets."}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* General Advice */}
            <Card className="glass-panel p-6 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Milestone Tracking Note</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your learning roadmap automatically synchronizes as you update your career profile. Once a target skill is added, the roadmap transitions that milestone node to completed, boosting your overall readiness index.
                </p>
              </div>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}
