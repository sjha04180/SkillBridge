import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  GraduationCap, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  MessageSquareCode, 
  ArrowRight,
  Code,
  Share2
} from 'lucide-react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;

    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background glowing blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-full max-w-7xl rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute top-[800px] left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[100px]" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/5 px-3 py-1 text-sm text-violet-300 backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            <span>Connect. Share. Excel.</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Bridging Student Talents <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Across Campus Networks
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-400 md:text-xl font-medium">
            SkillBridge connects college students to share skills, collaborate on technical projects, and help peers master new tools in real time.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" variant="gradient" className="w-full sm:w-auto font-semibold cursor-pointer">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 inline" />
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-slate-300 border-border/40 font-semibold cursor-pointer">
                    View My Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" variant="gradient" className="w-full sm:w-auto font-semibold cursor-pointer">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 inline" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-slate-300 border-border/40 font-semibold cursor-pointer">
                    Learn More
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 border-t border-border/10 bg-slate-950/40 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Built for Modern Student Networks
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400 font-medium">
              Empower your college community with features built to highlight student competencies and foster peer tutoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-border/10 bg-slate-950/20 p-8 hover:bg-slate-900/30 hover:border-violet-500/20 transition-all duration-300 backdrop-blur-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 text-violet-400 group-hover:bg-violet-600/20 transition-colors">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Skill Filter</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Filter students by precise technical disciplines, frameworks, or languages to find the exact peer you need.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-border/10 bg-slate-950/20 p-8 hover:bg-slate-900/30 hover:border-indigo-500/20 transition-all duration-300 backdrop-blur-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600/20 transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Verified Campus Peers</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Interact exclusively with students from your college or across trusted academic systems for collaboration.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-border/10 bg-slate-950/20 p-8 hover:bg-slate-900/30 hover:border-blue-500/20 transition-all duration-300 backdrop-blur-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 group-hover:bg-blue-600/20 transition-colors">
                <MessageSquareCode className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Direct Collaboration</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Build study groups, initiate chat connections, and launch hackathon teams based on complementary skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 border-t border-border/10 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-3 py-1 text-sm text-indigo-300">
                <GraduationCap className="h-4 w-4" />
                <span>Academic Bridging</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                About SkillBridge
              </h2>
              <p className="text-slate-400 leading-relaxed font-medium">
                Traditional education teaches theories, but real growth happens through collaboration. SkillBridge was built by engineers who saw a disconnect between college branches.
              </p>
              <p className="text-slate-400 leading-relaxed font-medium">
                By enabling students from computer science, electronics, business, and arts to index their capabilities, SkillBridge acts as a secure campus directory for skill trading, homework help, and hackathon matches.
              </p>
              <div className="flex gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" />
                  <span className="text-sm font-semibold text-slate-300">Verified emails</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-indigo-400" />
                  <span className="text-sm font-semibold text-slate-300">Project-focused</span>
                </div>
              </div>
            </div>

            {/* Graphic Illustration */}
            <div className="relative flex justify-center items-center rounded-2xl border border-border/10 bg-slate-950/60 p-8 overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-72 w-72 rounded-full bg-violet-600/10 blur-2xl" />
              <div className="space-y-6 w-full max-w-md">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-border/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-600/30 flex items-center justify-center font-bold text-indigo-400">
                      SJ
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Sachin Jha</h4>
                      <p className="text-xs text-slate-400">TCET Mumbai • Computer Science</p>
                    </div>
                  </div>
                  
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-border/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-600/30 flex items-center justify-center font-bold text-emerald-400">
                      PJ
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Prince Jha</h4>
                      <p className="text-xs text-slate-400">TCET Mumbai • Computer Science</p>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 border-t border-border/10 bg-radial from-slate-900 to-slate-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-border/10 bg-slate-950/60 p-8 md:p-12 overflow-hidden shadow-2xl backdrop-blur-md text-center space-y-6">
            <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Ready to Upgrade Your Campus Connection?
            </h2>
            <p className="mx-auto max-w-xl text-slate-400 font-medium">
              Create your SkillBridge account in seconds, highlight your competencies, and search for potential project collaborators.
            </p>
            <div className="pt-2">
              <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg" variant="gradient" className="font-semibold cursor-pointer">
                  {isAuthenticated ? "Go to Dashboard" : "Join SkillBridge Now"}
                  <ArrowRight className="ml-2 h-5 w-5 inline" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-border/10 bg-black/40 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border/5 pb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md">
                <Share2 className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg text-white">SkillBridge</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-medium">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
            <p>Designed for university peer-to-peer collaboration.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
