"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  Plus,
  X,
  Loader2,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Compass,
} from "lucide-react";

const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const TARGET_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Architect",
  "Cybersecurity Analyst",
  "Mobile Developer",
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    graduationYear: new Date().getFullYear(),
    cgpa: 0,
    skills: [],
    certifications: [],
    targetRole: "",
    projects: [],
    dsaProgress: 0,
    githubUrl: "",
    linkedinUrl: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Floating Toast State
  const [toast, setToast] = useState({
    message: "",
    type: null,
  });

  // Local helper states for adding tags
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectTech, setProjectTech] = useState("");

  // Toast automatic dismiss effect
  useEffect(() => {
    if (toast.type) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: null });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          throw new Error("Failed to load profile");
        }
        const data = await res.json();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          college: data.college || "",
          branch: data.branch || "",
          graduationYear: data.graduationYear || new Date().getFullYear(),
          cgpa: data.cgpa || 0,
          skills: data.skills || [],
          certifications: data.certifications || [],
          targetRole: data.targetRole || "",
          projects: data.projects || [],
          dsaProgress: data.dsaProgress || 0,
          githubUrl: data.githubUrl || "",
          linkedinUrl: data.linkedinUrl || "",
        });
      } catch (err) {
        setErrorMsg(err.message || "Error loading profile data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]:
        name === "graduationYear" || name === "cgpa" ? Number(value) : value,
    }));
  };

  const addSkill = (e) => {
    e.preventDefault();
    const cleanInput = skillInput.trim();
    if (
      cleanInput &&
      !profile.skills.some((s) => s.toLowerCase() === cleanInput.toLowerCase())
    ) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, cleanInput],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (indexToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const addCertification = (e) => {
    e.preventDefault();
    const cleanInput = certInput.trim();
    if (
      cleanInput &&
      !profile.certifications.some(
        (c) => c.toLowerCase() === cleanInput.toLowerCase(),
      )
    ) {
      setProfile((prev) => ({
        ...prev,
        certifications: [...prev.certifications, cleanInput],
      }));
      setCertInput("");
    }
  };

  const removeCertification = (indexToRemove) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter(
        (_, idx) => idx !== indexToRemove,
      ),
    }));
  };

  const addProject = (e) => {
    e.preventDefault();
    const title = projectTitle.trim();
    if (!title) return;
    const techArray = projectTech
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const newProject = {
      title,
      description: projectDesc.trim(),
      technologies: techArray,
    };

    setProfile((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));

    setProjectTitle("");
    setProjectDesc("");
    setProjectTech("");
  };

  const removeProject = (indexToRemove) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validation
    if (!profile.name.trim()) {
      setToast({ message: "Name is required", type: "error" });
      return;
    }
    if (!profile.college.trim()) {
      setToast({ message: "College name is required", type: "error" });
      return;
    }
    if (!profile.branch.trim()) {
      setToast({ message: "Branch name is required", type: "error" });
      return;
    }
    if (profile.cgpa < 0 || profile.cgpa > 10) {
      setToast({ message: "CGPA must be between 0 and 10", type: "error" });
      return;
    }
    if (profile.graduationYear < 1980 || profile.graduationYear > 2040) {
      setToast({
        message: "Please enter a valid graduation year",
        type: "error",
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      setToast({
        message: "Career profile updated successfully!",
        type: "success",
      });
      router.refresh(); // refresh server side caches
    } catch (err) {
      setToast({
        message: err.message || "Error updating profile",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-950 p-6 md:p-12 space-y-8 animate-pulse-slow">
        <div>
          <div className="h-10 w-64 bg-slate-800 rounded-lg mb-2 skeleton-pulse" />
          <div className="h-4 w-96 bg-slate-800 rounded-lg mb-2 skeleton-pulse" />
        </div>
        <div className="space-y-6">
          <div className="h-44 w-full bg-slate-900/60 rounded-xl p-6 border border-white/5 space-y-4 skeleton-pulse" />
          <div className="h-44 w-full bg-slate-900/60 rounded-xl p-6 border border-white/5 space-y-4 skeleton-pulse" />
          <div className="h-44 w-full bg-slate-900/60 rounded-xl p-6 border border-white/5 space-y-4 skeleton-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden animate-slide-up">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />

      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            My Professional Profile
          </h1>
          <p className="text-slate-400 mt-1">
            Keep your details up to date to matching target roles and unlock
            customized learning roadmaps.
          </p>
        </div>

        {/* Toast alerts now handle updates notification */}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card 1: Personal Details */}
          <Card className="glass-panel">
            <CardHeader className="border-b border-border/5">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-400" />
                Personal Details
              </CardTitle>
              <CardDescription className="text-slate-400">
                Your basic contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-slate-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="pl-10 bg-slate-950/80 border-border/20 text-white focus-visible:ring-indigo-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-slate-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                  <Input
                    id="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="pl-10 bg-slate-950/40 border-border/10 text-slate-500 cursor-not-allowed"
                    placeholder="john.doe@college.edu"
                  />
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  Email is tied to your account credentials and cannot be edited.
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="githubUrl"
                  className="text-slate-300 text-xs font-semibold uppercase tracking-wider"
                >
                  GitHub URL
                </Label>
                <div className="relative">
                  <Github className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="githubUrl"
                    name="githubUrl"
                    value={profile.githubUrl}
                    onChange={handleChange}
                    className="pl-10 bg-slate-950/80 border-border/20 text-white focus-visible:ring-indigo-500"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="linkedinUrl"
                  className="text-slate-300 text-xs font-semibold uppercase tracking-wider"
                >
                  LinkedIn URL
                </Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    value={profile.linkedinUrl}
                    onChange={handleChange}
                    className="pl-10 bg-slate-950/80 border-border/20 text-white focus-visible:ring-indigo-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Academic Details */}
          <Card className="glass-panel">
            <CardHeader className="border-b border-border/5">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-400" />
                Academic Details
              </CardTitle>
              <CardDescription className="text-slate-400">
                Current degree, college, and scoring.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="college"
                  className="text-slate-300 text-xs font-semibold uppercase tracking-wider"
                >
                  College/University
                </Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="college"
                    name="college"
                    value={profile.college}
                    onChange={handleChange}
                    className="pl-10 bg-slate-950/80 border-border/20 text-white focus-visible:ring-indigo-500"
                    placeholder="University Name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="branch"
                  className="text-slate-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Branch/Discipline
                </Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="branch"
                    name="branch"
                    value={profile.branch}
                    onChange={handleChange}
                    className="pl-10 bg-slate-950/80 border-border/20 text-white focus-visible:ring-indigo-500"
                    placeholder="Computer Science, ECE, etc."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="graduationYear"
                    className="text-slate-300 text-xs font-semibold uppercase tracking-wider"
                  >
                    Grad Year
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="graduationYear"
                      name="graduationYear"
                      type="number"
                      value={profile.graduationYear}
                      onChange={handleChange}
                      className="pl-10 bg-slate-950/80 border-border/20 text-white focus-visible:ring-indigo-500"
                      min="1980"
                      max="2040"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="cgpa"
                    className="text-slate-300 text-xs font-semibold uppercase tracking-wider"
                  >
                    CGPA (Out of 10)
                  </Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="cgpa"
                      name="cgpa"
                      type="number"
                      step="0.01"
                      value={profile.cgpa || ""}
                      onChange={handleChange}
                      className="pl-10 bg-slate-950/80 border-border/20 text-white focus-visible:ring-indigo-500"
                      placeholder="e.g. 8.5"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Career & Skills Details */}
          <Card className="glass-panel">
            <CardHeader className="border-b border-border/5">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-400" />
                Career Target & Skills
              </CardTitle>
              <CardDescription className="text-slate-400">
                Specify your career alignment and set tags.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Target Role Dropdown */}
              <div className="space-y-2">
                <Label
                  htmlFor="targetRole"
                  className="text-slate-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Target Job Role
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <select
                    id="targetRole"
                    name="targetRole"
                    value={profile.targetRole}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-md border border-border/20 bg-slate-950/80 pl-10 pr-3 py-2 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Select Target Role --</option>
                    {TARGET_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tag Input for Skills */}
              <div className="space-y-3">
                <Label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Professional Skills
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill(e))
                    }
                    placeholder="Add a skill (e.g. React, Python) and press Enter"
                    className="bg-slate-950/80 border-border/20 text-white"
                  />

                  <Button
                    type="button"
                    onClick={addSkill}
                    className="bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-border/10 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-slate-950/40 border border-border/5">
                    {profile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/20"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(idx)}
                          className="hover:text-rose-400 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No skills added yet.
                  </p>
                )}
              </div>

              {/* Tag Input for Certifications */}
              <div className="space-y-3">
                <Label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Certifications
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addCertification(e))
                    }
                    placeholder="Add a certificate (e.g. AWS Solutions Architect) and press Enter"
                    className="bg-slate-950/80 border-border/20 text-white"
                  />

                  <Button
                    type="button"
                    onClick={addCertification}
                    className="bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-border/10 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {profile.certifications.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-slate-950/40 border border-border/5">
                    {profile.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/20"
                      >
                        {cert}
                        <button
                          type="button"
                          onClick={() => removeCertification(idx)}
                          className="hover:text-rose-400 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No certifications listed yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Placement Prep (DSA & Projects) */}
          <Card className="glass-panel">
            <CardHeader className="border-b border-border/5">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="h-5 w-5 text-indigo-400" />
                Placement Prep (DSA & Projects)
              </CardTitle>
              <CardDescription className="text-slate-400">
                Add your engineering projects and track your DSA coding practice
                progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* DSA Progress Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="dsaProgress"
                    className="text-slate-300 text-xs font-semibold uppercase tracking-wider"
                  >
                    DSA Progress (%)
                  </Label>
                  <span className="text-sm font-bold text-indigo-400">
                    {profile.dsaProgress}% completed
                  </span>
                </div>
                <input
                  id="dsaProgress"
                  name="dsaProgress"
                  type="range"
                  min="0"
                  max="100"
                  value={profile.dsaProgress}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      dsaProgress: Number(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />

                <p className="text-[10px] text-slate-500 italic">
                  Estimate your general DSA preparation level (e.g. key topics
                  completed like Trees, Graphs, DP).
                </p>
              </div>

              {/* Dynamic Projects Builder */}
              <div className="space-y-4 pt-4 border-t border-border/5">
                <Label className="text-slate-300 text-xs font-semibold uppercase tracking-wider block">
                  My Technical Projects
                </Label>

                {/* List current projects */}
                {profile.projects && profile.projects.length > 0 ? (
                  <div className="space-y-3">
                    {profile.projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-start p-4 rounded-xl bg-slate-950/60 border border-border/5"
                      >
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-bold text-white">
                            {proj.title}
                          </h4>
                          {proj.description && (
                            <p className="text-xs text-slate-400">
                              {proj.description}
                            </p>
                          )}
                          {proj.technologies &&
                            proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {proj.technologies.map((t) => (
                                  <span
                                    key={t}
                                    className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeProject(idx)}
                          variant="ghost"
                          size="sm"
                          className="text-slate-500 hover:text-rose-400 hover:bg-transparent"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No projects listed. Add projects below to earn readiness
                    score points.
                  </p>
                )}

                {/* Add new project subform */}
                <div className="p-4 rounded-xl bg-slate-950/30 border border-border/5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-300">
                    Add Technical Project
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="projTitle"
                        className="text-xs text-slate-400"
                      >
                        Project Title
                      </Label>
                      <Input
                        id="projTitle"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. E-Commerce Backend API"
                        className="bg-slate-950/80 border-border/20 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="projTech"
                        className="text-xs text-slate-400"
                      >
                        Technologies (comma-separated)
                      </Label>
                      <Input
                        id="projTech"
                        value={projectTech}
                        onChange={(e) => setProjectTech(e.target.value)}
                        placeholder="e.g. Node.js, Express, MongoDB"
                        className="bg-slate-950/80 border-border/20 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="projDesc"
                      className="text-xs text-slate-400"
                    >
                      Project Description (optional)
                    </Label>
                    <Input
                      id="projDesc"
                      value={projectDesc}
                      onChange={(e) => setProjectDesc(e.target.value)}
                      placeholder="e.g. Built fully functional catalog microservice using Express and MongoDB."
                      className="bg-slate-950/80 border-border/20 text-white"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={addProject}
                      className="bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-border/10 cursor-pointer text-xs"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Project to Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:from-violet-500 hover:to-indigo-500 px-8 py-6 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Save Career Profile"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Floatable Toast System */}
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
