import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Map, CheckCircle2, AlertCircle, Compass, Circle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ROLE_SKILLS: Record<string, string[]> = {
  'Frontend Developer': ['React', 'HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'TypeScript', 'Next.js'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL', 'REST APIs', 'Docker', 'Git'],
  'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'Next.js', 'SQL', 'Tailwind CSS', 'TypeScript'],
  'Software Engineer': ['Data Structures', 'Algorithms', 'Java', 'Python', 'C++', 'System Design', 'Git'],
  'Data Analyst': ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics', 'Pandas', 'PowerBI'],
};

export default async function RoadmapPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  await dbConnect();
  const profile = await Profile.findOne({ userId: session.user.id }) || {
    cgpa: 0,
    skills: [],
    certifications: [],
    targetRole: '',
  };

  const userSkillsLower = (profile.skills || []).map((s: string) => s.toLowerCase().trim());
  const targetRole = profile.targetRole || '';
  const requiredSkills = ROLE_SKILLS[targetRole] || [];

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
            <Map className="h-10 w-10 text-indigo-400" />
            Learning Roadmap
          </h1>
          <p className="text-slate-400 mt-1">
            Track milestones on your journey to mastering target competencies.
          </p>
        </div>

        {!targetRole ? (
          <Card className="border border-border/10 bg-slate-900/40 p-12 text-center backdrop-blur-md space-y-4">
            <AlertCircle className="h-12 w-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Target Role Selected</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Please choose a Target Job Role in your profile to view a structured curriculum pathway.
            </p>
            <Link href="/dashboard/profile" className="inline-block mt-2">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer">
                Go to Profile
              </Button>
            </Link>
          </Card>
        ) : (
          <Card className="border border-border/10 bg-slate-900/40 p-8 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-border/10 pb-4 mb-8">
              <div>
                <h3 className="text-lg font-bold text-white">{targetRole} Path</h3>
                <p className="text-xs text-slate-400">Structured from foundation to advanced engineering principles.</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Active Roadmap
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="relative border-l border-indigo-500/20 ml-4 md:ml-6 space-y-8 pb-4">
              {requiredSkills.map((skill, index) => {
                const isAcquired = userSkillsLower.includes(skill.toLowerCase().trim());
                
                return (
                  <div key={skill} className="relative pl-8 md:pl-10">
                    {/* Visual dot indicator */}
                    <div className={`absolute -left-[13px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      isAcquired
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-slate-950 border-slate-700 text-slate-500"
                    } shadow-md`}>
                      {isAcquired ? (
                        <CheckCircle2 className="h-4.5 w-4.5" />
                      ) : (
                        <span className="text-[10px] font-bold">{index + 1}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className={`text-sm font-bold ${isAcquired ? "text-white" : "text-slate-400"}`}>
                          Step {index + 1}: {skill}
                        </h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isAcquired 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : "bg-slate-800 text-slate-500"
                        }`}>
                          {isAcquired ? "COMPLETED" : "TO DO"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
                        {isAcquired 
                          ? `Successfully acquired! This skill is in your portfolio.` 
                          : `Learn core concepts, complete tutorial projects, and add ${skill} to your portfolio to unlock the next level.`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
