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
    <div className="flex flex-1 min-h-[calc(100vh-4rem)] bg-slate-950 text-white relative animate-fade-in">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-indigo-500/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl -z-10 pointer-events-none" />

      {/* Mobile Sidebar Toggle Header */}
      <div className="md:hidden flex items-center justify-between w-full bg-slate-950/80 border-b border-white/5 px-4 py-3 sticky top-0 z-40 backdrop-blur-md">
        <span className="text-sm font-extrabold tracking-wider bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          SKILLBRIDGE MENU
        </span>
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-400 hover:text-white bg-slate-900/60 border border-white/5 rounded-xl transition-all"
          aria-label="Toggle Navigation"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-16 md:top-0 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-slate-900/40 border-r border-white/5 backdrop-blur-xl transition-all duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full py-8 justify-between">
          <div className="px-4 space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group border ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-indigo-400/20 text-white shadow-lg shadow-indigo-600/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:border-white/5'
                  }`}
                >
                  <Icon
                    className={`h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-300'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Hub Details */}
          <div className="px-6 py-4 mx-4 rounded-2xl bg-slate-950/50 border border-white/5 text-[11px] text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">
                Placement Sync
              </p>
            </div>
            <p className="leading-relaxed">
              Target role benchmarks synchronized with top corporate requirements.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
