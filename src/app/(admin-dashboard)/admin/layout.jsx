import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SidebarLink from "./SidebarLink";
import { Share2 } from "lucide-react";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-950 text-white relative animate-fade-in">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-indigo-500/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl -z-10 pointer-events-none" />

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900/40 border-b md:border-b-0 md:border-r border-white/5 backdrop-blur-xl shrink-0">
        <div className="flex flex-col h-full py-8 justify-between px-4">
          <div className="space-y-6">
            {/* Admin Header Title */}
            <div className="px-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md">
                <Share2 className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white leading-none">
                  SkillBridge
                </span>
                <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">
                  Admin Workspace
                </span>
              </div>
            </div>

            {/* Links Stack */}
            <nav className="space-y-1.5">
              <SidebarLink
                href="/admin"
                iconName="dashboard"
                name="Dashboard"
              />
              <SidebarLink
                href="/admin/users"
                iconName="users"
                name="User Management"
              />
              <SidebarLink
                href="/admin/resources"
                iconName="resources"
                name="Resource Management"
              />
            </nav>
          </div>

          {/* Footer space */}
          <div className="mt-8 md:mt-0">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block text-center">
              SkillBridge Secure Portal
            </span>
          </div>
        </div>
      </aside>

      {/* Admin Main Content Container */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
        {children}
      </main>
    </div>
  );
}
