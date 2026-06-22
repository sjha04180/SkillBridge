"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Mail,
  Loader2,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeletingId, setIsDeletingId] = useState(null);

  // Floating Toast State
  const [toast, setToast] = useState({
    message: "",
    type: null,
  });

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.type) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: null });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to load user accounts");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      showToast(err.message || "Error loading users list", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (user) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete user account "${user.name}"? This will wipe all their profiles, goals, and checklists from the database.`,
      )
    ) {
      return;
    }

    setIsDeletingId(user._id);
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete user");
      }

      showToast("User account successfully deleted.", "success");
      fetchUsers();
    } catch (err) {
      showToast(err.message || "Error deleting user account", "error");
    } finally {
      setIsDeletingId(null);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.college.toLowerCase().includes(query) ||
      u.branch.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
            <Users className="h-10 w-10 text-indigo-400" />
            User Account Management
          </h1>
          <p className="text-slate-400 mt-1">
            Browse registered peer directories and perform administrator account
            deletions.
          </p>
        </div>
      </div>

      {/* Search Filter Controls */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student name, college, email, or branches..."
          className="pl-10 bg-slate-950/80 border-border/20 text-white focus-visible:ring-indigo-500 py-6"
        />
      </div>

      {/* Users table */}
      {isLoading ? (
        /* Skeletons */
        <Card className="glass-panel p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 w-full bg-slate-900/60 rounded-xl skeleton-pulse"
            />
          ))}
        </Card>
      ) : filteredUsers.length > 0 ? (
        <Card className="glass-panel p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  <th className="py-3 px-4">Student Profile</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">College / branch details</th>
                  <th className="py-3 px-4">Grad Year</th>
                  <th className="py-3 px-4">User Role</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors text-xs font-semibold"
                  >
                    {/* Name */}
                    <td className="py-4 px-4 font-extrabold text-white">
                      {item.name}
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        {item.email}
                      </div>
                    </td>

                    {/* College & branch */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-slate-300">{item.college}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {item.branch}
                        </p>
                      </div>
                    </td>

                    {/* Grad year */}
                    <td className="py-4 px-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                        {item.graduationYear}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          item.role === "admin"
                            ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20"
                            : "bg-slate-900 text-slate-500"
                        }`}
                      >
                        {item.role.toUpperCase()}
                      </span>
                    </td>

                    {/* Delete Action button */}
                    <td className="py-4 px-4 text-right">
                      <Button
                        onClick={() => handleDeleteUser(item)}
                        disabled={isDeletingId === item._id}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 cursor-pointer disabled:opacity-50"
                      >
                        {isDeletingId === item._id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Empty State */
        <Card className="glass-panel p-12 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Users Found</h3>
          <p className="text-slate-400 text-sm">
            We couldn't find any registered student accounts matching your
            current search parameters.
          </p>
        </Card>
      )}

      {/* FLOATING TOASTS */}
      {toast.type && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl animate-slide-up ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
              : "bg-rose-950/90 border-rose-500/30 text-rose-300"
          } backdrop-blur-md`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
