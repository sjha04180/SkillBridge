import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card } from "@/components/ui/card";
import { Settings, Shield, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden animate-slide-up">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
            <Settings className="h-10 w-10 text-indigo-400" />
            Dashboard Settings
          </h1>
          <p className="text-slate-400 mt-1">
            Configure system settings and manage account preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation/Sidebar of settings (mock list) */}
          <div className="md:col-span-1 space-y-2">
            <button className="w-full text-left px-4 py-2.5 rounded-lg bg-indigo-600/10 text-indigo-300 border border-indigo-500/10 text-xs font-bold uppercase tracking-wider">
              System Settings
            </button>
            <button className="w-full text-left px-4 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 text-xs font-bold uppercase tracking-wider">
              Integrations
            </button>
            <button className="w-full text-left px-4 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 text-xs font-bold uppercase tracking-wider">
              Privacy & Security
            </button>
          </div>

          {/* Settings main panel */}
          <div className="md:col-span-2 space-y-6">
            {/* Box 1: Notifications Settings */}
            <Card className="glass-panel p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <Bell className="h-4.5 w-4.5 text-indigo-400" /> Notifications
                Configuration
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-950/60 border border-white/5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">
                      Email Skill Updates
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Receive alert recommendations for new target role courses.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/10">
                    ACTIVE
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-950/60 border border-white/5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">
                      Connection Requests
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Notify when peer graduates endorse your skills.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/10">
                    ACTIVE
                  </span>
                </div>
              </div>
            </Card>

            {/* Box 2: System Credentials */}
            <Card className="glass-panel p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <Shield className="h-4.5 w-4.5 text-indigo-400" />{" "}
                Authentication & Account Info
              </h3>

              <div className="space-y-1">
                <p className="text-xs text-slate-400">
                  Account status is secure. Standard password authentication
                  handles your login sessions.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="text-xs text-slate-400 border-white/10 hover:text-white cursor-pointer"
                    disabled
                  >
                    Change Account Password
                  </Button>
                </div>
              </div>
            </Card>

            {/* Box 3: Help Center */}
            <Card className="glass-panel p-6 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-violet-400" />{" "}
                SkillBridge Knowledge Center
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Having troubles with your profile synchronization or skill
                endorsers? Contact our peer administrator team at
                support@skillbridge.edu.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
