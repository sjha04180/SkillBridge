"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, HelpCircle } from "lucide-react";

const ICON_MAP = {
  dashboard: LayoutDashboard,
  users: Users,
  resources: BookOpen,
};

export default function SidebarLink({ href, name, iconName }) {
  const pathname = usePathname();
  // Check if pathname equals href, or starts with href for subpaths (e.g. /admin/users matches /admin/users/[id] but not /admin/resources)
  const isActive =
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  const Icon = ICON_MAP[iconName] || HelpCircle;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group border ${
        isActive
          ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-indigo-400/20 text-white shadow-lg shadow-indigo-600/10"
          : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:border-white/5"
      }`}
    >
      <Icon
        className={`h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 ${
          isActive
            ? "text-white"
            : "text-indigo-400 group-hover:text-indigo-300"
        }`}
      />

      <span>{name}</span>
    </Link>
  );
}
