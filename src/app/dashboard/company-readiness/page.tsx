import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building2, AlertCircle, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COMPANY_REQUIREMENTS = [
  { 
    name: 'Google', 
    skills: ['Data Structures', 'Algorithms', 'System Design', 'Python', 'Java', 'C++'],
    desc: 'Core software engineering roles prioritizing algorithmic logic and system scaling.'
  },
  { 
    name: 'Microsoft', 
    skills: ['TypeScript', 'SQL', 'Git', 'Algorithms', 'C++', 'Docker'],
    desc: 'Full-stack cloud products and enterprise application development alignment.'
  },
  { 
    name: 'Amazon', 
    skills: ['Java', 'System Design', 'REST APIs', 'Data Structures', 'SQL', 'Docker'],
    desc: 'Distributed systems backend and e-commerce infrastructure development.'
  },
  { 
    name: 'Meta', 
    skills: ['React', 'JavaScript', 'TypeScript', 'Algorithms', 'System Design', 'Git'],
    desc: 'Frontend-heavy web architecture and real-time social product development.'
  },
];

export default async function CompanyReadinessPage() {
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

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
            <Building2 className="h-10 w-10 text-indigo-400" />
            Company Readiness Matching
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time preparation match scoring against hiring criteria of tech industry partners.
          </p>
        </div>

        {!targetRole ? (
          <Card className="border border-border/10 bg-slate-900/40 p-12 text-center backdrop-blur-md space-y-4">
            <AlertCircle className="h-12 w-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Target Role Selected</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Please configure a Target Job Role in your profile to run matching analytics.
            </p>
            <Link href="/dashboard/profile" className="inline-block mt-2">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer">
                Go to Profile
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {COMPANY_REQUIREMENTS.map((company) => {
              const matchedSkills = company.skills.filter((skill) =>
                userSkillsLower.includes(skill.toLowerCase().trim())
              );
              const missingSkills = company.skills.filter((skill) =>
                !userSkillsLower.includes(skill.toLowerCase().trim())
              );
              const score = Math.round(30 + (matchedSkills.length / company.skills.length) * 70);

              return (
                <Card key={company.name} className="border border-border/10 bg-slate-900/40 p-6 backdrop-blur-md grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  
                  {/* Left: Score circle */}
                  <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border/10 pb-4 md:pb-0 md:pr-4">
                    <div className="relative flex items-center justify-center mb-2">
                      <div className={`flex flex-col items-center justify-center bg-slate-950 h-24 w-24 rounded-full border-4 ${
                        score >= 80 ? "border-emerald-500" : score >= 60 ? "border-indigo-500" : "border-slate-700"
                      }`}>
                        <span className="text-2xl font-black text-white">{score}%</span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Match</span>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white">{company.name}</h4>
                  </div>

                  {/* Mid: Description & Skills alignment */}
                  <div className="md:col-span-3 space-y-4">
                    <div>
                      <p className="text-xs text-slate-400">{company.desc}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skill Alignment</p>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {matchedSkills.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/15">
                            <CheckCircle2 className="h-3 w-3" /> {s}
                          </span>
                        ))}
                        {missingSkills.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-950/40 text-slate-500 font-medium border border-border/5">
                            <HelpCircle className="h-3 w-3 text-slate-600" /> {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress indicators */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{matchedSkills.length} of {company.skills.length} matching skills</span>
                      {score >= 85 ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <ShieldCheck className="h-4 w-4" /> Strong candidate fit
                        </span>
                      ) : (
                        <span className="text-indigo-400">Closing skill gap helps increase matching</span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
