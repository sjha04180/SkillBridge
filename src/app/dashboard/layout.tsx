'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Award,
  Zap,
  Map,
  Building2,
  Settings,
  Menu,
  X,
} from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Readiness Score', href: '/dashboard/readiness', icon: Award },
  { name: 'Skill Gap', href: '/dashboard/skill-gap', icon: Zap },
  { name: 'Roadmap', href: '/dashboard/roadmap', icon: Map },
  { name: 'Company Readiness', href: '/dashboard/company-readiness', icon: Building2 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-1 min-h-[calc(100vh-4rem)] bg-slate-950 text-white relative">
      {/* Mobile Sidebar Toggle Header */}
      <div className="md:hidden flex items-center justify-between w-full bg-slate-900 border-b border-border/10 px-4 py-3 sticky top-0 z-40">
        <span className="text-sm font-semibold tracking-wide text-indigo-400">
          Dashboard Menu
        </span>
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-400 hover:text-white bg-slate-950/50 border border-border/10 rounded-lg"
          aria-label="Toggle Navigation"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden backdrop-blur-xs"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-16 md:top-0 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-slate-900/60 border-r border-border/10 backdrop-blur-md transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full py-6 justify-between">
          <div className="px-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent hover:border-border/5'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-300'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats Summary or Branding */}
          <div className="px-6 py-4 mx-4 rounded-xl bg-slate-950/40 border border-border/5 text-xs text-slate-500 font-medium">
            <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mb-1">
              SkillBridge Hub
            </p>
            <p className="leading-relaxed">
              Track your readiness, bridge the gap, get hired.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}
