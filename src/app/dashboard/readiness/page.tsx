import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Award, CheckCircle2, XCircle, ShieldAlert, Sparkles, BookOpen } from "lucide-react";

export default async function ReadinessScorePage() {
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

  // Readiness calculation breakdown
  const hasCgpa = (profile.cgpa || 0) > 0;
  const hasTargetRole = !!profile.targetRole;
  const skillsCount = profile.skills?.length || 0;
  const certsCount = profile.certifications?.length || 0;

  const cgpaScore = hasCgpa ? Math.min(40, Math.round(profile.cgpa * 4)) : 0;
  const skillsScore = Math.min(25, skillsCount * 5);
  const certsScore = Math.min(10, certsCount * 5);
  const roleScore = hasTargetRole ? 10 : 0;
  const baseScore = 15;

  const totalScore = Math.min(100, baseScore + cgpaScore + skillsScore + certsScore + roleScore);

  const criteria = [
    {
      name: "Account Setup Base",
      max: 15,
      actual: baseScore,
      status: true,
      desc: "Account registered successfully.",
    },
    {
      name: "Academic Excellence (CGPA)",
      max: 40,
      actual: cgpaScore,
      status: hasCgpa && profile.cgpa >= 7.0,
      desc: hasCgpa ? `Current CGPA is ${profile.cgpa.toFixed(2)} / 10.0` : "Add CGPA on your profile.",
    },
    {
      name: "Target Career Goal Set",
      max: 10,
      actual: roleScore,
      status: hasTargetRole,
      desc: hasTargetRole ? `Targeting: ${profile.targetRole}` : "No target role set yet.",
    },
    {
      name: "Skills Inventory Setup",
      max: 25,
      actual: skillsScore,
      status: skillsCount >= 5,
      desc: `${skillsCount} skills listed (Aim for at least 5 target skills).`,
    },
    {
      name: "Industry Certifications",
      max: 10,
      actual: certsScore,
      status: certsCount > 0,
      desc: `${certsCount} certificates validated.`,
    },
  ];

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
            <Award className="h-10 w-10 text-indigo-400" />
            Placement Readiness Analysis
          </h1>
          <p className="text-slate-400 mt-1">
            Detailed evaluation breakdown scoring your readiness to connect with hiring partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Readiness Dial Card */}
          <Card className="md:col-span-1 border border-border/10 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
              <div className="flex flex-col items-center justify-center bg-slate-950 h-36 w-36 rounded-full border-4 border-indigo-500 shadow-2xl relative z-10">
                <span className="text-4xl font-black text-white">{totalScore}%</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Score</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {totalScore >= 80 ? "Highly Ready" : totalScore >= 50 ? "Moderately Ready" : "Getting Started"}
            </h3>
            <p className="text-xs text-slate-400 max-w-[200px]">
              {totalScore >= 80 
                ? "Your profile matches target indicators. Connect with company scouts!" 
                : "Complete tasks on the right to optimize your readiness score."}
            </p>
          </Card>

          {/* Breakdown checklist */}
          <Card className="md:col-span-2 border border-border/10 bg-slate-900/40 p-6 backdrop-blur-md space-y-6">
            <h3 className="text-base font-bold text-white border-b border-border/10 pb-3 flex items-center justify-between">
              <span>Readiness Breakdown</span>
              <span className="text-xs text-indigo-400 font-semibold">{totalScore} / 100 points</span>
            </h3>

            <div className="space-y-4">
              {criteria.map((item) => (
                <div key={item.name} className="flex justify-between items-start gap-4 p-3 rounded-lg bg-slate-950/60 border border-border/5">
                  <div className="flex items-start gap-3">
                    {item.status ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : item.actual > 0 ? (
                      <BookOpen className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-300">
                    <span className="text-white">{item.actual}</span> / {item.max} pts
                  </div>
                </div>
              ))}
            </div>

            {totalScore < 100 && (
              <div className="p-4 rounded-xl bg-violet-600/5 border border-violet-500/10 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-violet-400 shrink-0" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  💡 <strong className="text-slate-200">Recommendation:</strong> Add more skills, list your academic certifications, or increase your target goals to unlock full placement matching capabilities.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
