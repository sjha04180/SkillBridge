import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, Mail, User, Shield, Star, Users, MessageSquare } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-slate-400">
            Manage your academic profile and connect with peers.
          </p>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details Card */}
          <Card className="lg:col-span-1 border border-border/10 bg-slate-950/40 shadow-xl backdrop-blur-md">
            <CardHeader className="border-b border-border/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">{user.name}</CardTitle>
                  <CardDescription className="text-slate-400">Registered Student</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="h-5 w-5 text-indigo-400 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs text-slate-500 font-medium">EMAIL ADDRESS</p>
                  <p className="text-sm truncate font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <GraduationCap className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">COLLEGE / UNIVERSITY</p>
                  <p className="text-sm font-semibold">{user.college}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <BookOpen className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">BRANCH / DISCIPLINE</p>
                  <p className="text-sm font-semibold">{user.branch}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Shield className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">GRADUATION YEAR</p>
                  <p className="text-sm font-semibold">{user.graduationYear}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connect stats and quick tasks */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card className="border border-border/10 bg-slate-950/40 p-6 backdrop-blur-md flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">12</p>
                  <p className="text-xs text-slate-400 font-medium">Peer Connections</p>
                </div>
              </Card>

              <Card className="border border-border/10 bg-slate-950/40 p-6 backdrop-blur-md flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">5</p>
                  <p className="text-xs text-slate-400 font-medium">Endorsed Skills</p>
                </div>
              </Card>

              <Card className="border border-border/10 bg-slate-950/40 p-6 backdrop-blur-md flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">3</p>
                  <p className="text-xs text-slate-400 font-medium">Active Chats</p>
                </div>
              </Card>
            </div>

            {/* Quick Actions / Recommendations */}
            <Card className="border border-border/10 bg-slate-950/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Connect with Students from {user.college}</CardTitle>
                <CardDescription className="text-slate-400">Expand your local network and share skills.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-border/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                      RD
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Rohan Deshmukh</h4>
                      <p className="text-xs text-slate-400">{user.branch} • Graduating {user.graduationYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 font-semibold">
                      React Native
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold">
                      Tailwind
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-border/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                      PS
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Pooja Sharma</h4>
                      <p className="text-xs text-slate-400">{user.branch} • Graduating {Number(user.graduationYear) + 1}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-semibold">
                      Next.js
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold">
                      MongoDB
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
