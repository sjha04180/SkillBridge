import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const COMPANIES = [
  {
    name: "Google",
    skills: ["Data Structures", "Algorithms", "System Design"],
    requiresProjects: true,
    desc: "Focuses heavily on core algorithms, deep data structure concepts, and system architecture design.",
  },
  {
    name: "Amazon",
    skills: ["Data Structures", "Algorithms", "DBMS", "OOP"],
    requiresProjects: true,
    desc: "Prioritizes database management principles, object-oriented designs, and problem-solving.",
  },
  {
    name: "Microsoft",
    skills: ["TypeScript", "SQL", "Git", "Algorithms"],
    requiresProjects: true,
    desc: "Targeted at web engineering workflows, database queries, source control, and algorithms.",
  },
  {
    name: "JPMC",
    skills: ["Java", "SQL", "Algorithms", "Git"],
    requiresProjects: true,
    desc: "Focuses on financial system applications, database controls, and reliable OOP programming.",
  },
  {
    name: "TCS",
    skills: ["SQL", "HTML", "CSS", "Git"],
    requiresProjects: true,
    desc: "Enterprise services mapping, general software lifecycle, and frontend foundations.",
  },
  {
    name: "Infosys",
    skills: ["SQL", "HTML", "CSS"],
    requiresProjects: true,
    desc: "Focuses on client application integration, basic database commands, and markup stylesheets.",
  },
];

export default async function CompanyReadinessPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  await dbConnect();
  const profileDoc = await Profile.findOne({ userId: session.user.id });
  const profile = profileDoc || {
    skills: [],
    projects: [],
  };

  const userSkillsLower = (profile.skills || []).map((s) =>
    s.toLowerCase().trim(),
  );
  const projectsCount = profile.projects?.length || 0;
  const hasProjects = projectsCount >= 1;

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
              <Building2 className="h-10 w-10 text-indigo-400" />
              Company Readiness Checker
            </h1>
            <p className="text-slate-400 mt-1">
              Analyze your readiness percentage and check matching expectations
              for major tech hiring partners.
            </p>
          </div>
          <Link href="/dashboard/profile">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer shadow-lg shadow-indigo-600/20">
              Update Profile details
            </Button>
          </Link>
        </div>

        {/* Company Readiness Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COMPANIES.map((company) => {
            // Evaluate criteria matching
            const matchedSkills = [];
            const missingSkills = [];

            // Check core skills
            company.skills.forEach((skill) => {
              const skillKey = skill.toLowerCase().trim();
              // Handle OOP alias matching
              if (skillKey === "oop") {
                const hasOOP =
                  userSkillsLower.includes("oop") ||
                  userSkillsLower.includes("java") ||
                  userSkillsLower.includes("python") ||
                  userSkillsLower.includes("c++") ||
                  userSkillsLower.includes("c#");
                if (hasOOP) {
                  matchedSkills.push(skill);
                } else {
                  missingSkills.push(skill);
                }
              } else {
                if (userSkillsLower.includes(skillKey)) {
                  matchedSkills.push(skill);
                } else {
                  missingSkills.push(skill);
                }
              }
            });

            // Check projects
            if (company.requiresProjects) {
              if (hasProjects) {
                matchedSkills.push("Projects");
              } else {
                missingSkills.push("Projects");
              }
            }

            // Calculate matching percentage
            const totalCriteria =
              company.skills.length + (company.requiresProjects ? 1 : 0);
            const matchedCount = matchedSkills.length;
            const readinessPercent =
              totalCriteria > 0
                ? Math.round((matchedCount / totalCriteria) * 100)
                : 0;

            return (
              <Card
                key={company.name}
                className="glass-panel p-6 flex flex-col justify-between h-[360px] transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Top section: Name & percentage */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-indigo-400 shrink-0" />
                        {company.name} Readiness
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {company.desc}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-black text-white">
                        {readinessPercent}%
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                        Matched
                      </span>
                    </div>
                  </div>

                  {/* Horizontal progress bar */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          readinessPercent >= 80
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : readinessPercent >= 50
                              ? "bg-gradient-to-r from-violet-600 to-indigo-600"
                              : "bg-slate-700"
                        }`}
                        style={{ width: `${readinessPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Skill matching split */}
                  <div className="space-y-3 pt-2">
                    {/* Matched skills tags */}
                    {matchedCount > 0 && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">
                          Matched Requirements
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {matchedSkills.map((s) => (
                            <span
                              key={s}
                              className="text-[9px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing skills tags */}
                    {missingSkills.length > 0 ? (
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest block">
                          Missing Requirements
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {missingSkills.map((s) => (
                            <span
                              key={s}
                              className="text-[9px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/10"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                        <ShieldCheck className="h-4.5 w-4.5" /> Full alignment
                        met! Ready to apply.
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct action suggestions */}
                <div className="pt-4 border-t border-border/5 flex items-center justify-between text-[10px] text-slate-500 font-medium mt-2">
                  <span>Match index is updated dynamically</span>
                  {readinessPercent < 100 ? (
                    <Link
                      href="/dashboard/skill-gap"
                      className="text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-0.5 hover:underline"
                    >
                      Close skill gaps
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="text-emerald-400 font-bold">
                      Recommended for scouting
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Info card */}
        <Card className="glass-panel p-6 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">
              Scouting & Interview Invitations
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When your readiness index for a hiring partner hits 80% or higher,
              your profile is marked as a candidate match. Keep updating your
              portfolio skills and project completions to boost visibility for
              top corporate scouts.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
