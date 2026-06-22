"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  FileText,
  PlayCircle,
  Globe,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const CATEGORIES = [
  "DSA",
  "Aptitude",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "OOP",
  "Web Development",
  "Interview Preparation",
];

const RESOURCE_TYPES = ["PDF", "Video", "Website", "Notes"];
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formType, setFormType] = useState(RESOURCE_TYPES[0]);
  const [formLink, setFormLink] = useState("");
  const [formDifficulty, setFormDifficulty] = useState(DIFFICULTY_LEVELS[0]);

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

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/resources");
      if (!res.ok) throw new Error("Failed to load resources");
      const data = await res.json();
      setResources(data.resources || []);
    } catch (err) {
      showToast(err.message || "Error loading resources", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormTitle("");
    setFormDesc("");
    setFormCategory(CATEGORIES[0]);
    setFormType(RESOURCE_TYPES[0]);
    setFormLink("");
    setFormDifficulty(DIFFICULTY_LEVELS[0]);
  };

  const handleAddOpen = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditOpen = (item) => {
    setEditingId(item._id);
    setFormTitle(item.title);
    setFormDesc(item.description);
    setFormCategory(item.category);
    setFormType(item.resourceType);
    setFormLink(item.resourceLink);
    setFormDifficulty(item.difficultyLevel);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formTitle.trim() || !formDesc.trim() || !formLink.trim()) {
      showToast("All text fields are required", "error");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formTitle.trim(),
        description: formDesc.trim(),
        category: formCategory,
        resourceType: formType,
        resourceLink: formLink.trim(),
        difficultyLevel: formDifficulty,
      };

      const url = editingId ? `/api/resources/${editingId}` : "/api/resources";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save resource");
      }

      showToast(
        editingId
          ? "Resource updated successfully!"
          : "Resource added successfully!",
        "success",
      );
      setIsModalOpen(false);
      resetForm();
      fetchResources();
    } catch (err) {
      showToast(err.message || "Error saving resource", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const res = await fetch(`/api/resources/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete resource");
      }

      showToast("Resource deleted successfully!", "success");
      fetchResources();
    } catch (err) {
      showToast(err.message || "Error deleting resource", "error");
    }
  };

  // Filter resources
  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Resource Type Icon mapper
  const getTypeIcon = (type) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-4 w-4 text-rose-400 shrink-0" />;
      case "Video":
        return <PlayCircle className="h-4 w-4 text-red-400 shrink-0" />;
      case "Website":
        return <Globe className="h-4 w-4 text-blue-400 shrink-0" />;
      case "Notes":
        return <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" />;
      default:
        return <HelpCircle className="h-4 w-4 text-slate-400 shrink-0" />;
    }
  };

  // Difficulty tag classes
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10";
      case "Intermediate":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/10";
      case "Advanced":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/10";
      default:
        return "bg-slate-800 text-slate-400 border border-transparent";
    }
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
            <BookOpen className="h-10 w-10 text-indigo-400" />
            Resource Management
          </h1>
          <p className="text-slate-400 mt-1">
            Configure, update, or remove placement preparation resources in the
            hub database.
          </p>
        </div>
        <Button
          onClick={handleAddOpen}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer shadow-lg shadow-indigo-600/20 hover:from-violet-500 hover:to-indigo-500 transition-all font-semibold flex items-center gap-2 py-5"
        >
          <Plus className="h-5 w-5" />
          Add Resource
        </Button>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Search bar */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study resources by title or description details..."
            className="pl-10 bg-slate-950/80 border-border/20 text-white focus-visible:ring-indigo-500 py-6"
          />
        </div>

        {/* Category selector */}
        <div className="relative md:col-span-1">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex h-12 w-full rounded-md border border-border/20 bg-slate-950/80 px-3 py-2 text-sm text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabular data view */}
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
      ) : filteredResources.length > 0 ? (
        <Card className="glass-panel p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  <th className="py-3 px-4">Resource Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors text-xs font-semibold"
                  >
                    {/* Title & Desc */}
                    <td className="py-4 px-4 font-bold text-white max-w-sm">
                      <div>
                        <p className="line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-indigo-300">
                      {item.category}
                    </td>

                    {/* Type */}
                    <td className="py-4 px-4 text-slate-400">
                      <div className="flex items-center gap-1.5 font-bold">
                        {getTypeIcon(item.resourceType)}
                        {item.resourceType}
                      </div>
                    </td>

                    {/* Difficulty */}
                    <td className="py-4 px-4">
                      <span
                        className={`text-[8px] font-black px-2 py-0.5 rounded-full ${getDifficultyBadge(item.difficultyLevel)}`}
                      >
                        {item.difficultyLevel}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={item.resourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white flex items-center justify-center rounded-lg hover:bg-slate-800/60"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <Button
                          onClick={() => handleEditOpen(item)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800/60 cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(item._id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 cursor-pointer"
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
      ) : (
        /* Empty State */
        <Card className="glass-panel p-12 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Resources Found</h3>
          <p className="text-slate-400 text-sm">
            We couldn't find any database resources matching your category or
            search queries.
          </p>
        </Card>
      )}

      {/* CRUD DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg glass-panel p-8 rounded-2xl shadow-2xl relative border border-white/10 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-border/5 pb-2">
              {editingId ? (
                <Edit className="h-5 w-5 text-indigo-400" />
              ) : (
                <Plus className="h-5 w-5 text-indigo-400" />
              )}
              {editingId ? "Edit Study Resource" : "Add Study Resource"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label
                  htmlFor="formTitle"
                  className="text-xs text-slate-300 font-semibold uppercase tracking-wider"
                >
                  Title
                </Label>
                <Input
                  id="formTitle"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Master dynamic programming methods"
                  className="bg-slate-950/80 border-border/20 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="formDesc"
                  className="text-xs text-slate-300 font-semibold uppercase tracking-wider"
                >
                  Description
                </Label>
                <textarea
                  id="formDesc"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Summarize the core topics and learnings included in this source link..."
                  className="flex min-h-24 w-full rounded-md border border-border/20 bg-slate-950/80 px-3 py-2 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
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
                    htmlFor="formType"
                    className="text-xs text-slate-300 font-semibold uppercase tracking-wider"
                  >
                    Type
                  </Label>
                  <select
                    id="formType"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border/20 bg-slate-950/80 px-3 py-2 text-sm text-slate-300 focus:outline-hidden"
                  >
                    {RESOURCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-1">
                  <Label
                    htmlFor="formDifficulty"
                    className="text-xs text-slate-300 font-semibold uppercase tracking-wider"
                  >
                    Difficulty
                  </Label>
                  <select
                    id="formDifficulty"
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border/20 bg-slate-950/80 px-3 py-2 text-sm text-slate-300 focus:outline-hidden"
                  >
                    {DIFFICULTY_LEVELS.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 col-span-1">
                  <Label
                    htmlFor="formLink"
                    className="text-xs text-slate-300 font-semibold uppercase tracking-wider"
                  >
                    URL Link
                  </Label>
                  <Input
                    id="formLink"
                    type="url"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="https://..."
                    className="bg-slate-950/80 border-border/20 text-white"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
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
                      <Loader2 className="h-4 w-4 animate-spin animate-spin-slow" />
                      Saving...
                    </>
                  ) : (
                    "Save Resource"
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
