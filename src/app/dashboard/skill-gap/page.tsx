import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Bookmark,
} from "lucide-react";
import Link from "next/link";

const ROLE_SKILLS: Record<string, string[]> = {
  'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL', 'DBMS', 'Docker', 'Git'],
  'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'DBMS', 'SQL', 'Git', 'Tailwind CSS'],
  'Software Engineer': ['Data Structures', 'Algorithms', 'DBMS', 'Java', 'Python', 'System Design', 'Git'],
  'Data Analyst': ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics', 'Pandas', 'Git'],
};

const SKILL_RESOURCES: Record<string, { desc: string; linkName: string; url: string }> = {
  'HTML': { desc: 'Learn structure of modern HTML5 documents.', linkName: 'MDN HTML Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  'CSS': { desc: 'Styling layout, flexbox, grid, responsive styles.', linkName: 'CSS Tricks Complete Guide', url: 'https://css-tricks.com' },
  'JavaScript': { desc: 'Modern ES6+ fundamentals, DOM, and async promises.', linkName: 'javascript.info', url: 'https://javascript.info' },
  'React': { desc: 'Official React Documentation & Interactive Guides.', linkName: 'react.dev', url: 'https://react.dev' },
  'Git': { desc: 'Git branching models and command references.', linkName: 'Atlassian Git Guides', url: 'https://www.atlassian.com/git' },
  'Node.js': { desc: 'Node.js official learning roadmap.', linkName: 'nodejs.dev', url: 'https://nodejs.dev' },
  'Express': { desc: 'Express framework routing guides.', linkName: 'expressjs.com', url: 'https://expressjs.com' },
  'MongoDB': { desc: 'MongoDB University free training modules.', linkName: 'learn.mongodb.com', url: 'https://learn.mongodb.com' },
  'SQL': { desc: 'Interactive SQL query playground database.', linkName: 'sqlbolt.com', url: 'https://sqlbolt.com' },
  'DBMS': { desc: 'Relational database management schema principles.', linkName: 'DBMS Tutorial', url: 'https://www.javatpoint.com/dbms-tutorial' },
  'Docker': { desc: 'Containerization, volumes, and deployment workflows.', linkName: 'Docker Guides', url: 'https://docs.docker.com' },
  'Tailwind CSS': { desc: 'Utility classes and component styling references.', linkName: 'tailwindcss.com Docs', url: 'https://tailwindcss.com' },
  'Data Structures': { desc: 'Arrays, Lists, Trees, and Graph implementations.', linkName: 'GeeksforGeeks DS', url: 'https://www.geeksforgeeks.org/data-structures/' },
  'Algorithms': { desc: 'Sorting, searching, and DP problem solutions.', linkName: 'VisuAlgo tool', url: 'https://visualgo.net' },
  'Java': { desc: 'Object-oriented programming constructs & Java SE.', linkName: 'Java Programming Guide', url: 'https://dev.java' },
  'Python': { desc: 'Data modeling, scripts, and libraries.', linkName: 'realpython.com', url: 'https://realpython.com' },
  'System Design': { desc: 'Learn scaling, load balancers, caching logic.', linkName: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
  'Excel': { desc: 'Lookup functions, macro sheets, pivot tables.', linkName: 'Excel Training Center', url: 'https://support.microsoft.com/en-us/excel' },
  'Tableau': { desc: 'Data modeling visualization and dashboards.', linkName: 'Tableau training video path', url: 'https://www.tableau.com/learn' },
  'Statistics': { desc: 'Probability models, hypotheses testing logic.', linkName: 'Khan Academy Statistics', url: 'https://www.khanacademy.org/math/statistics-probability' },
  'Pandas': { desc: 'Dataframes, clean filters, analytical workflows.', linkName: 'Pandas user handbook', url: 'https://pandas.pydata.org/docs/' },
};

export default async function SkillGapPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  await dbConnect();
  const profileDoc = await Profile.findOne({ userId: session.user.id });
  const profile = profileDoc || {
    skills: [],
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

  const totalCount = requiredSkills.length;
  const acquiredCount = acquiredSkills.length;
  const completionPercent = totalCount > 0 ? Math.round((acquiredCount / totalCount) * 100) : 0;

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
              <Zap className="h-10 w-10 text-indigo-400" />
              Skill Gap Assessment
            </h1>
            <p className="text-slate-400 mt-1">
              Verify your skills alignment and track missing requirements for target roles.
            </p>
          </div>
          <Link href="/dashboard/profile">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer shadow-lg shadow-indigo-600/20">
              Edit Skills Profile
            </Button>
          </Link>
        </div>

        {!targetRole ? (
          <Card className="glass-panel p-12 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Target Role Selected</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Please configure a Target Job Role in your profile to analyze skill alignment.
            </p>
            <Link href="/dashboard/profile" className="inline-block mt-2">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer">
                Go to Profile
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-8">
            
            {/* Completion Percentage Progress Card */}
            <Card className="glass-panel p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Target Role: <span className="text-indigo-400">{targetRole}</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Match ratio: {acquiredCount} of {totalCount} core technical competencies met.
                    </p>
                  </div>
                  <span className="text-2xl font-black text-white">{completionPercent}% Aligned</span>
                </div>
                
                {/* Horizontal Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Existing & Missing Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Existing Skills */}
              <Card className="glass-panel p-6 flex flex-col justify-between h-[300px]">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Existing Skills ({acquiredCount})
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Competencies present on your profile that match criteria:</p>
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                  {acquiredCount > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {acquiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/10 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                      <AlertCircle className="h-8 w-8 mb-2 text-slate-600" />
                      <p className="text-xs">No matching target skills added to your profile yet.</p>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-slate-500 mt-2">Verified core technical strengths.</p>
              </Card>

              {/* Missing Skills */}
              <Card className="glass-panel p-6 flex flex-col justify-between h-[300px]">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-rose-400" />
                    Missing Skills ({totalCount - acquiredCount})
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Competencies you need to acquire to close the gap:</p>
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                  {missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-3 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/10 flex items-center gap-1.5"
                        >
                          <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-emerald-400 font-semibold">
                      <CheckCircle2 className="h-8 w-8 mb-2" />
                      <p className="text-xs">Congratulations! No missing skills. Ready for review.</p>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-slate-500 mt-2">Target priority skill areas.</p>
              </Card>

            </div>

            {/* Recommended Learning Courses / Detailed List */}
            <Card className="glass-panel p-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-border/10 pb-3 mb-4">
                <BookOpen className="h-5 w-5 text-indigo-400" /> Curriculum Study References
              </h3>

              <div className="space-y-4">
                {requiredSkills.map((skill) => {
                  const isAcquired = userSkillsLower.includes(skill.toLowerCase().trim());
                  const resource = SKILL_RESOURCES[skill] || {
                    desc: `General guides, syntax handbooks, and documentation for ${skill}.`,
                    linkName: `Search for ${skill}`,
                    url: `https://google.com/search?q=learn+${encodeURIComponent(skill)}`,
                  };

                  return (
                    <div
                      key={skill}
                      className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl bg-slate-950/60 border border-border/5 gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{skill}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isAcquired 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                          }`}>
                            {isAcquired ? 'ACQUIRED' : 'MISSING'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{resource.desc}</p>
                      </div>

                      <div className="shrink-0 flex items-center">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
                        >
                          <GraduationCap className="h-4 w-4" />
                          {resource.linkName}
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}
