"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckSquare,
  Plus,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Kanban,
  List,
  Target,
  Circle,
  Clock,
  ArrowRight,
} from "lucide-react";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Pending", "In Progress", "Completed"];
const CATEGORIES = [
  "DSA",
  "Aptitude",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "OOP",
  "Web Development",
  "Interview Preparation",
  "Other",
];

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("kanban");

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formDeadline, setFormDeadline] = useState("");
  const [formPriority, setFormPriority] = useState(PRIORITIES[1]);
  const [formStatus, setFormStatus] = useState(STATUSES[0]);

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

  // Fetch user goals
  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/goals");
      if (!res.ok) throw new Error("Failed to load goals");
      const data = await res.json();
      setGoals(data.goals || []);
    } catch (err) {
      showToast(err.message || "Error loading weekly goals", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Form reset
  const resetForm = () => {
    setEditingId(null);
    setFormTitle("");
    setFormDesc("");
    setFormCategory(CATEGORIES[0]);
    setFormDeadline("");
    setFormPriority(PRIORITIES[1]);
    setFormStatus(STATUSES[0]);
  };

  // Open add modal
  const handleAddOpen = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEditOpen = (item) => {
    setEditingId(item._id);
    setFormTitle(item.title);
    setFormDesc(item.description || "");
    setFormCategory(item.category);
    // Format date string to YYYY-MM-DD for standard html date picker
    const formattedDate = item.deadline
      ? new Date(item.deadline).toISOString().split("T")[0]
      : "";
    setFormDeadline(formattedDate);
    setFormPriority(item.priority);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  // Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formTitle.trim() || !formDeadline || !formCategory) {
      showToast("Title, Category, and Deadline are required fields", "error");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formTitle.trim(),
        description: formDesc.trim(),
        category: formCategory,
        deadline: formDeadline,
        priority: formPriority,
        status: formStatus,
      };

      const url = editingId ? `/api/goals/${editingId}` : "/api/goals";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save goal");
      }

      showToast(
        editingId
          ? "Weekly goal updated successfully!"
          : "Weekly goal created successfully!",
        "success",
      );
      setIsModalOpen(false);
      resetForm();
      fetchGoals();
    } catch (err) {
      showToast(err.message || "Error saving weekly goal", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick mark status change
  const handleUpdateStatus = async (item, nextStatus) => {
    try {
      const res = await fetch(`/api/goals/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update goal status");
      }

      showToast(`Goal status marked as ${nextStatus}`, "success");
      fetchGoals();
    } catch (err) {
      showToast(err.message || "Error updating status", "error");
    }
  };

  // Delete Goal
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this weekly goal?")) return;

    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete goal");
      }

      showToast("Weekly goal deleted successfully!", "success");
      fetchGoals();
    } catch (err) {
      showToast(err.message || "Error deleting goal", "error");
    }
  };

  // Stats calculations
  const totalCount = goals.length;
  const completedCount = goals.filter((g) => g.status === "Completed").length;
  const inProgressCount = goals.filter(
    (g) => g.status === "In Progress",
  ).length;
  const pendingCount = goals.filter((g) => g.status === "Pending").length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Format date readable
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Priority color tags
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/10";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/10";
      case "High":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/10";
      default:
        return "bg-slate-800 text-slate-400 border border-transparent";
    }
  };

  // Status icon mapper
  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-amber-400 animate-spin-slow" />;
      default:
        return <Circle className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden animate-slide-up">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />

      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
              <CheckSquare className="h-10 w-10 text-indigo-400" />
              Weekly Goal Tracker
            </h1>
            <p className="text-slate-400 mt-1">
              Structure, manage, and complete your weekly placement study
              milestones.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View togglers */}
            <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-white/5 backdrop-blur-xs">
              <Button
                onClick={() => setViewMode("kanban")}
                variant="ghost"
                size="sm"
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs font-semibold transition-all ${
                  viewMode === "kanban"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Kanban className="h-4 w-4" />
                Kanban
              </Button>
              <Button
                onClick={() => setViewMode("list")}
                variant="ghost"
                size="sm"
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs font-semibold transition-all ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <List className="h-4 w-4" />
                List View
              </Button>
            </div>

            <Button
              onClick={handleAddOpen}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer shadow-lg shadow-indigo-600/20 hover:from-violet-500 hover:to-indigo-500 transition-all font-semibold flex items-center gap-2 py-5"
            >
              <Plus className="h-5 w-5" />
              Add Weekly Goal
            </Button>
          </div>
        </div>

        {/* Dashboard Progress Stats Banner */}
        <Card className="glass-panel p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {/* Total Goals */}
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Total goals
              </span>
              <h3 className="text-3xl font-black text-white">{totalCount}</h3>
            </div>

            {/* Completed */}
            <div className="space-y-1 text-center md:text-left border-l border-white/5 pl-0 md:pl-6">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-center md:justify-start gap-1">
                <CheckCircle2 className="h-3 w-3" /> Completed
              </span>
              <h3 className="text-3xl font-black text-white">
                {completedCount}
              </h3>
            </div>

            {/* In Progress & Pending */}
            <div className="space-y-1 text-center md:text-left border-l border-white/5 pl-0 md:pl-6">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Remaining / In progress
              </span>
              <h3 className="text-3xl font-black text-white">
                {pendingCount + inProgressCount}
              </h3>
            </div>

            {/* Percentage Slider */}
            <div className="space-y-2 col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 pl-0 md:pl-6">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span className="uppercase tracking-wider">
                  Completion Index
                </span>
                <span className="text-indigo-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Goals Main Content Layout */}
        {isLoading ? (
          /* Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((col) => (
              <div key={col} className="space-y-4">
                <div className="h-6 w-32 bg-slate-800 rounded-lg skeleton-pulse" />
                <Card className="glass-panel p-6 h-40 skeleton-pulse" />
                <Card className="glass-panel p-6 h-40 skeleton-pulse" />
              </div>
            ))}
          </div>
        ) : goals.length === 0 ? (
          /* Empty state */
          <Card className="glass-panel p-12 text-center space-y-4 max-w-md mx-auto">
            <Target className="h-12 w-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">
              Wipe the slate clean
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              No weekly study goals configured yet. Set milestones for data
              structures, aptitude, and databases to lock in placements.
            </p>
            <Button
              onClick={handleAddOpen}
              className="bg-indigo-600 text-white cursor-pointer hover:bg-indigo-500 font-semibold"
            >
              Set First Goal
            </Button>
          </Card>
        ) : viewMode === "kanban" ? (
          /* KANBAN BOARD VIEW */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Pending */}
            <div className="space-y-4 bg-slate-900/10 p-4 rounded-2xl border border-white/5 backdrop-blur-xs flex flex-col min-h-[450px]">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Circle className="h-3.5 w-3.5 text-slate-500" /> Pending (
                  {goals.filter((g) => g.status === "Pending").length})
                </span>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {goals
                  .filter((g) => g.status === "Pending")
                  .map((item) => (
                    <GoalCard
                      key={item._id}
                      item={item}
                      onEdit={handleEditOpen}
                      onDelete={handleDelete}
                      onUpdateStatus={handleUpdateStatus}
                      formatDate={formatDate}
                      getPriorityClass={getPriorityClass}
                    />
                  ))}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="space-y-4 bg-slate-900/10 p-4 rounded-2xl border border-white/5 backdrop-blur-xs flex flex-col min-h-[450px]">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" /> In
                  Progress (
                  {goals.filter((g) => g.status === "In Progress").length})
                </span>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {goals
                  .filter((g) => g.status === "In Progress")
                  .map((item) => (
                    <GoalCard
                      key={item._id}
                      item={item}
                      onEdit={handleEditOpen}
                      onDelete={handleDelete}
                      onUpdateStatus={handleUpdateStatus}
                      formatDate={formatDate}
                      getPriorityClass={getPriorityClass}
                    />
                  ))}
              </div>
            </div>

            {/* Column 3: Completed */}
            <div className="space-y-4 bg-slate-900/10 p-4 rounded-2xl border border-white/5 backdrop-blur-xs flex flex-col min-h-[450px]">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{" "}
                  Completed (
                  {goals.filter((g) => g.status === "Completed").length})
                </span>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {goals
                  .filter((g) => g.status === "Completed")
                  .map((item) => (
                    <GoalCard
                      key={item._id}
                      item={item}
                      onEdit={handleEditOpen}
                      onDelete={handleDelete}
                      onUpdateStatus={handleUpdateStatus}
                      formatDate={formatDate}
                      getPriorityClass={getPriorityClass}
                    />
                  ))}
              </div>
            </div>
          </div>
        ) : (
          /* LIST VIEW */
          <Card className="glass-panel p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    <th className="py-3 px-4">Goal Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {goals.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-white/5 hover:bg-white/2 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-4 font-semibold text-white">
                        <div>
                          <p>{item.title}</p>
                          {item.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-indigo-300">
                        {item.category}
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {formatDate(item.deadline)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getPriorityClass(item.priority)}`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          {getStatusIcon(item.status)}
                          <span
                            className={
                              item.status === "Completed"
                                ? "text-emerald-400"
                                : item.status === "In Progress"
                                  ? "text-amber-400"
                                  : "text-slate-400"
                            }
                          >
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleUpdateStatus(item, e.target.value)
                            }
                            className="bg-slate-900 border border-white/5 rounded px-2 py-1 text-xs text-slate-300"
                          >
                            {STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          <Button
                            onClick={() => handleEditOpen(item)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(item._id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* CREATE & EDIT GOAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg glass-panel p-8 rounded-2xl shadow-2xl relative border border-white/10 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-border/5 pb-2">
              <Target className="h-5 w-5 text-indigo-400" />
              {editingId ? "Edit Weekly Goal" : "Create Weekly Goal"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label
                  htmlFor="formTitle"
                  className="text-xs text-slate-300 font-semibold uppercase tracking-wider"
                >
                  Goal Title
                </Label>
                <Input
                  id="formTitle"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Complete 15 LeetCode DP questions"
                  className="bg-slate-950/80 border-border/20 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="formDesc"
                  className="text-xs text-slate-300 font-semibold uppercase tracking-wider"
                >
                  Description (optional)
                </Label>
                <textarea
                  id="formDesc"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Focus points, links, or sub-milestones..."
                  className="flex min-h-20 w-full rounded-md border border-border/20 bg-slate-950/80 px-3 py-2 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="formCategory"
                    className="text-xs text-slate-300 font-semibold uppercase tracking-wider"
                  >
                    Category
                  </Label>
                  <select
                    id="formCategory"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border/20 bg-slate-950/80 px-3 py-2 text-sm text-slate-300 focus:outline-hidden"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="formDeadline"
                    className="text-xs text-slate-300 font-semibold uppercase tracking-wider"
                  >
                    Deadline Date
                  </Label>
                  <Input
                    id="formDeadline"
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="bg-slate-950/80 border-border/20 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="formPriority"
                    className="text-xs text-slate-300 font-semibold uppercase tracking-wider"
                  >
                    Priority Level
                  </Label>
                  <select
                    id="formPriority"
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border/20 bg-slate-950/80 px-3 py-2 text-sm text-slate-300 focus:outline-hidden"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="formStatus"
                    className="text-xs text-slate-300 font-semibold uppercase tracking-wider"
                  >
                    Status
                  </Label>
                  <select
                    id="formStatus"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border/20 bg-slate-950/80 px-3 py-2 text-sm text-slate-300 focus:outline-hidden"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="border-white/10 hover:text-white cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Goal"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
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

// Internal Kanban Goal Card Component
function GoalCard({
  item,
  onEdit,
  onDelete,
  onUpdateStatus,
  formatDate,
  getPriorityClass,
}) {
  return (
    <Card className="glass-panel p-4 flex flex-col justify-between hover:border-indigo-500/10 group/card transition-all duration-300 min-h-[140px]">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[9px] font-extrabold text-indigo-300 uppercase tracking-wider">
            {item.category}
          </span>
          <span
            className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${getPriorityClass(item.priority)}`}
          >
            {item.priority}
          </span>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white group-hover/card:text-indigo-400 transition-colors leading-snug">
            {item.title}
          </h4>
          {item.description && (
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-3 text-[10px] text-slate-500 font-medium">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-slate-600" />
          <span>{formatDate(item.deadline)}</span>
        </div>

        {/* Quick action icons */}
        <div className="flex items-center gap-1.5 opacity-80 md:opacity-0 group-hover/card:opacity-100 transition-opacity">
          {item.status !== "Completed" && (
            <Button
              onClick={() =>
                onUpdateStatus(
                  item,
                  item.status === "Pending" ? "In Progress" : "Completed",
                )
              }
              variant="ghost"
              size="sm"
              className="h-6 px-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/60 cursor-pointer flex items-center gap-0.5 text-[9px] font-bold"
            >
              <span>{item.status === "Pending" ? "Start" : "Done"}</span>
              <ArrowRight className="h-2.5 w-2.5" />
            </Button>
          )}
          <Button
            onClick={() => onEdit(item)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-800/60 cursor-pointer"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            onClick={() => onDelete(item._id)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
