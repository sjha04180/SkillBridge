import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Zap, CheckCircle2, AlertCircle, Sparkles, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ROLE_SKILLS: Record<string, string[]> = {
  'Frontend Developer': ['React', 'HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'TypeScript', 'Next.js'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL', 'REST APIs', 'Docker', 'Git'],
  'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'Next.js', 'SQL', 'Tailwind CSS', 'TypeScript'],
  'Software Engineer': ['Data Structures', 'Algorithms', 'Java', 'Python', 'C++', 'System Design', 'Git'],
  'Data Analyst': ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics', 'Pandas', 'PowerBI'],
};

// Mock resources for skills
const SKILL_RESOURCES: Record<string, { desc: string; linkName: string; url: string }> = {
  'React': { desc: 'Official React Documentation & Interactive Guides.', linkName: 'react.dev', url: 'https://react.dev' },
  'Next.js': { desc: 'Learn Next.js App Router through official courses.', linkName: 'nextjs.org/learn', url: 'https://nextjs.org/learn' },
  'TypeScript': { desc: 'TypeScript Deep Dive tutorial guide.', linkName: 'typescriptlang.org', url: 'https://typescriptlang.org' },
  'Tailwind CSS': { desc: 'Tailwind official utility documentation.', linkName: 'tailwindcss.com', url: 'https://tailwindcss.com' },
  'Node.js': { desc: 'Node.js official learning roadmap.', linkName: 'nodejs.dev', url: 'https://nodejs.dev' },
  'Express': { desc: 'Getting Started guide for Express framework.', linkName: 'expressjs.com', url: 'https://expressjs.com' },
  'MongoDB': { desc: 'MongoDB University free training programs.', linkName: 'learn.mongodb.com', url: 'https://learn.mongodb.com' },
  'SQL': { desc: 'Interactive SQL tutorials and syntax database.', linkName: 'sqlbolt.com', url: 'https://sqlbolt.com' },
  'Docker': { desc: 'Docker handbooks and containerization guides.', linkName: 'docker.com/play', url: 'https://docker.com' },
  'Data Structures': { desc: 'Algorithms & Data structures masterclass.', linkName: 'geeksforgeeks.org', url: 'https://geeksforgeeks.org' },
  'Algorithms': { desc: 'Visualizing algorithm logic and exercises.', linkName: 'visualgo.net', url: 'https://visualgo.net' },
  'Python': { desc: 'Learn Python coding standard program.', linkName: 'python.org', url: 'https://python.org' },
  'System Design': { desc: 'System design primer standard GitHub repository.', linkName: 'system-design-primer', url: 'https://github.com/donnemartin/system-design-primer' },
  'Tableau': { desc: 'Tableau training videos & desktop software guides.', linkName: 'tableau.com/learn', url: 'https://tableau.com' },
  'Excel': { desc: 'Excel formulas and data analytics sheets.', linkName: 'microsoft.com/learn', url: 'https://learn.microsoft.com' },
};

export default async function SkillGapPage() {
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

  const acquiredSkills = requiredSkills.filter((skill) =>
    userSkillsLower.includes(skill.toLowerCase().trim())
  );

  const missingSkills = requiredSkills.filter((skill) =>
    !userSkillsLower.includes(skill.toLowerCase().trim())
  );

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
            <Zap className="h-10 w-10 text-indigo-400" />
            Skill Gap Analysis
          </h1>
          <p className="text-slate-400 mt-1">
            Discover matching skills and identify exact learning actions needed to align with industry expectations.
          </p>
        </div>

        {!targetRole ? (
          <Card className="border border-border/10 bg-slate-900/40 p-12 text-center backdrop-blur-md space-y-4">
            <AlertCircle className="h-12 w-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Target Role Selected</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Please choose a Target Job Role in your Career Profile to map skill gaps and receive resource recommendations.
            </p>
            <Link href="/dashboard/profile" className="inline-block mt-2">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer">
                Go to Profile
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Skill Status Grid */}
            <div className="space-y-6">
              <Card className="border border-border/10 bg-slate-900/40 p-6 backdrop-blur-md">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-border/10 pb-2 mb-4">
                  Job Role: {targetRole}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Acquired ({acquiredSkills.length})
                    </h4>
                    {acquiredSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {acquiredSkills.map((skill) => (
                          <span key={skill} className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/10">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No matching skills acquired yet.</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border/5">
                    <h4 className="text-xs font-semibold text-rose-400 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" /> Missing Gap ({missingSkills.length})
                    </h4>
                    {missingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {missingSkills.map((skill) => (
                          <span key={skill} className="text-xs px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/10">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-400 font-semibold">🎉 Skill gap fully closed! Excellent preparation.</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* General recommendation advice */}
              <Card className="border border-border/10 bg-slate-900/40 p-6 backdrop-blur-md space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400" /> Professional Edge Tip
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Scouts look for validated proof of your skills. Once you complete learning paths for the missing skills, add certifications or project descriptions to verify your expertise!
                </p>
              </Card>
            </div>

            {/* Right: Learning Recommendations */}
            <Card className="border border-border/10 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-indigo-400" /> Recommended Study Paths
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Curated online references to learn missing skills quickly.
                </p>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {missingSkills.length > 0 ? (
                    missingSkills.map((skill) => {
                      const resource = SKILL_RESOURCES[skill] || {
                        desc: 'Search for courses, handbooks, and projects for ' + skill + '.',
                        linkName: 'Learn ' + skill,
                        url: 'https://google.com/search?q=learn+' + encodeURIComponent(skill),
                      };

                      return (
                        <div key={skill} className="p-3 rounded-lg bg-slate-950/60 border border-border/5 space-y-1.5">
                          <span className="text-xs font-bold text-indigo-400">{skill} Learning Path</span>
                          <p className="text-xs text-slate-400 leading-relaxed">{resource.desc}</p>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
                          >
                            <GraduationCap className="h-3.5 w-3.5" />
                            {resource.linkName}
                          </a>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center p-8 text-xs text-slate-500">
                      No missing skills. You are outstandingly prepared for {targetRole}!
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
