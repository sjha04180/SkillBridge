"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Code,
  Briefcase,
  User,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  BookOpen
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

export default function ResumeAnalyzerPage() {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  // Tabs for parsed details
  const [activeDetailsTab, setActiveDetailsTab] = useState("contact");
  const [toast, setToast] = useState({ message: "", type: null });

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

  // Fetch latest resume analysis from DB
  const fetchAnalysis = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/resume-analyzer");
      if (!res.ok) throw new Error("Failed to fetch resume details.");
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      showToast(err.message || "Failed to load resume details.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file) => {
    setErrorMsg("");
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      setErrorMsg("Invalid file type. Only PDF (.pdf) and Word (.docx) formats are supported.");
      showToast("Only PDF and DOCX files are allowed.", "error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("File size exceeds 8MB limit.");
      showToast("File size too large.", "error");
      return;
    }
    setSelectedFile(file);
  };

  // Simulate parsing steps for visual wow factor
  const uploadAndParse = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setErrorMsg("");

    // Stage 1: Uploading
    setUploadStage("Uploading Resume File...");
    setUploadProgress(15);
    await new Promise(r => setTimeout(r, 600));

    // Stage 2: Parsing PDF/Word structure
    setUploadStage("Extracting raw document text...");
    setUploadProgress(40);
    await new Promise(r => setTimeout(r, 800));

    // Stage 3: Running Heuristics
    setUploadStage("Running ATS validator & keyword matchers...");
    setUploadProgress(70);
    await new Promise(r => setTimeout(r, 700));

    // Stage 4: Sync
    setUploadStage("Synchronizing parsed credentials with SkillBridge Profile...");
    setUploadProgress(90);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/resume-analyzer", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze resume.");
      }

      const data = await res.json();
      setUploadProgress(100);
      setUploadStage("Analysis Complete!");
      await new Promise(r => setTimeout(r, 400));
      
      setAnalysis(data.analysis);
      showToast("Resume parsed and Profile synced automatically!", "success");
      setSelectedFile(null);
    } catch (err) {
      setErrorMsg(err.message || "An unexpected parser error occurred.");
      showToast(err.message || "Failed to analyze resume.", "error");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage("");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Low":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
      default:
        return "bg-slate-900 text-slate-400";
    }
  };

  const getProgressStyles = (score) => {
    if (score >= 80) return { stroke: "url(#emeraldGradient)", text: "text-emerald-400", label: "Placement Ready" };
    if (score >= 60) return { stroke: "url(#indigoGradient)", text: "text-indigo-400", label: "Good" };
    return { stroke: "url(#roseGradient)", text: "text-rose-400", label: "Needs Polish" };
  };

  const radius = 56;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden animate-slide-up">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />

      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
              <FileText className="h-10 w-10 text-indigo-400" />
              AI Resume Analyzer
            </h1>
            <p className="text-slate-400 mt-1">
              Upload your PDF/DOCX resume to receive instantaneous ATS compatibility reports, SkillBridge profile sync, and placement insights.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/profile">
              <Button variant="outline" className="border-white/5 hover:bg-white/5 font-semibold text-slate-300 flex items-center gap-2">
                Edit Career Profile
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* SECTION 1: UPLOAD WIDGET & FILE INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 glass-panel p-6 flex flex-col justify-center relative min-h-[300px]">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="relative flex items-center justify-center">
                  <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-indigo-400" />
                  <span className="absolute text-xs font-black text-white">{uploadProgress}%</span>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{uploadStage}</h3>
                  <p className="text-xs text-slate-500">Heuristics parser running offline in local container...</p>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                  dragActive ? "border-indigo-400 bg-indigo-500/5" : "border-white/10 hover:border-indigo-400/50"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <UploadCloud className="h-12 w-12 text-slate-500 mb-4 animate-pulse" />
                <h3 className="text-base font-bold text-white">Drag & Drop Resume</h3>
                <p className="text-xs text-slate-400 mt-1">Supports PDF (.pdf) and Word (.docx) files up to 8MB</p>
                
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-slate-900 text-indigo-400 border border-white/5 hover:bg-slate-800 text-xs font-semibold cursor-pointer py-2.5 px-4 rounded-lg"
                  >
                    Browse Files
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                </div>
                
                {errorMsg && (
                  <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Selected File Details / Preview Card */}
          <Card className="lg:col-span-1 glass-panel p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-indigo-400" />
                Resume File
              </h3>
              
              {selectedFile ? (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl flex items-start gap-3">
                    <FileText className="h-10 w-10 text-indigo-400 shrink-0" />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white truncate">{selectedFile.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Size: {(selectedFile.size / 1024).toFixed(1)} KB</p>
                      <p className="text-[10px] text-indigo-400 mt-1 font-semibold uppercase tracking-wider">Ready to Analyze</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-400 leading-relaxed bg-slate-900/10 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-1 text-indigo-400 font-semibold mb-1">
                      <Sparkles className="h-3 w-3" />
                      Automatic Sync Active
                    </div>
                    Parsing this file will automatically merge detected skills, certifications, projects, and contact links with your SkillBridge career profile.
                  </div>
                </div>
              ) : analysis ? (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400 shrink-0" />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-300 truncate">{analysis.fileName}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Size: {(analysis.fileSize / 1024).toFixed(1)} KB</p>
                      <p className="text-[10px] text-slate-500">Analyzed: {new Date(analysis.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-slate-500 leading-relaxed border-t border-white/5 pt-3">
                    * Uploading a new resume file will overwrite the existing analysis and perform a fresh sync of profile skills.
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 py-12">
                  <UploadCloud className="h-8 w-8 mb-2" />
                  <p className="text-xs font-medium">No resume file uploaded yet</p>
                </div>
              )}
            </div>

            {selectedFile && (
              <Button
                onClick={uploadAndParse}
                disabled={isUploading}
                className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold cursor-pointer shadow-lg hover:from-violet-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 py-5"
              >
                Analyze & Sync Resume
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </Card>
        </div>

        {analysis && (
          <div className="space-y-8 animate-slide-up">
            {/* INTERACTIVE SCORE GAUGES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* readiness score */}
              <Card className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 justify-center">
                    <Award className="h-4.5 w-4.5 text-indigo-400" />
                    Readiness Score
                  </CardTitle>
                </CardHeader>
                
                <div className="relative flex items-center justify-center my-4">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle className="text-slate-800" strokeWidth={strokeWidth} fill="transparent" r={radius} cx="72" cy="72" />
                    <circle
                      className="transition-all duration-700 ease-out"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (analysis.readinessScore / 100) * circumference}
                      strokeLinecap="round"
                      stroke={getProgressStyles(analysis.readinessScore).stroke}
                      fill="transparent"
                      r={radius}
                      cx="72"
                      cy="72"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{analysis.readinessScore}</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">/ 100 pts</span>
                  </div>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getPriorityColor(analysis.readinessScore >= 80 ? "Low" : analysis.readinessScore >= 60 ? "Medium" : "High")}`}>
                  {analysis.readinessScore >= 80 ? "Placement Ready" : analysis.readinessScore >= 60 ? "Strong Match" : "Build Profile"}
                </span>
              </Card>

              {/* ATS score */}
              <Card className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 justify-center">
                    <TrendingUp className="h-4.5 w-4.5 text-indigo-400" />
                    ATS Compatibility
                  </CardTitle>
                </CardHeader>

                <div className="relative flex items-center justify-center my-4">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle className="text-slate-800" strokeWidth={strokeWidth} fill="transparent" r={radius} cx="72" cy="72" />
                    <circle
                      className="transition-all duration-700 ease-out"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (analysis.atsScore / 100) * circumference}
                      strokeLinecap="round"
                      stroke={getProgressStyles(analysis.atsScore).stroke}
                      fill="transparent"
                      r={radius}
                      cx="72"
                      cy="72"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{analysis.atsScore}%</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Score Index</span>
                  </div>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getPriorityColor(analysis.atsScore >= 75 ? "Low" : analysis.atsScore >= 60 ? "Medium" : "High")}`}>
                  {analysis.atsScore >= 75 ? "Excellent structure" : analysis.atsScore >= 60 ? "Good formatting" : "Needs layout fix"}
                </span>
              </Card>

              {/* Project strength visual analytics */}
              <Card className="glass-panel p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
                    <Code className="h-4.5 w-4.5 text-indigo-400" />
                    Project Strength
                  </h3>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Evaluation score</span>
                      <span className="text-indigo-400 font-bold">{analysis.projectAnalysis?.strengthScore || 0} / 100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${analysis.projectAnalysis?.strengthScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3.5 space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                    {analysis.projectAnalysis?.suggestions.map((sug, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-400">
                        <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />
                        <span>{sug}</span>
                      </div>
                    ))}
                    {analysis.projectAnalysis?.suggestions.length === 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>All project checklist checks passed! Excellent.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[9px] text-slate-500 font-semibold border-t border-white/5 pt-2 mt-2 leading-relaxed">
                  * Evaluates project quantities, tech descriptions, and links.
                </div>
              </Card>
            </div>

            {/* SVG Gradients for Score Rings */}
            <svg className="absolute w-0 h-0">
              <defs>
                <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="indigoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
              </defs>
            </svg>

            {/* SECTION 5: WARNING CARDS (MISSING SECTIONS) */}
            {analysis.missingSections.length > 0 && (
              <Card className="glass-panel border-rose-500/10 bg-rose-500/5 p-6">
                <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2 border-b border-rose-500/10 pb-2.5">
                  <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
                  Detected Missing Resume Sections ({analysis.missingSections.length})
                </h3>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {analysis.missingSections.map((sec) => (
                    <div key={sec} className="p-3 bg-slate-950/60 border border-rose-500/20 rounded-xl text-xs font-semibold text-slate-300">
                      <span className="text-[10px] text-rose-400 uppercase tracking-widest block font-bold mb-0.5">Missing</span>
                      {sec}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* TWO COLUMN GRID: SUGGESTIONS & ROLE SKILLS GAP */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SECTION 8: IMPROVEMENT SUGGESTIONS WITH PRIORITY TAGS */}
              <Card className="glass-panel p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                    Improvement Suggestions
                  </h3>
                  
                  <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {analysis.suggestions.map((sug, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/60 border border-white/5 rounded-xl flex justify-between items-center text-xs gap-3">
                        <span className="text-slate-300 font-medium">{sug.text}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${getPriorityColor(sug.priority)}`}>
                          {sug.priority} Priority
                        </span>
                      </div>
                    ))}
                    {analysis.suggestions.length === 0 && (
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        Outstanding resume profile! No suggestions found.
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* SECTION 6: SKILLS ANALYSIS COMPARISON */}
              <Card className="glass-panel p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start border-b border-white/5 pb-2.5">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Layers className="h-4.5 w-4.5 text-indigo-400" />
                        Target Role Gap Analysis
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Target Role: <span className="text-indigo-400 font-bold">{analysis.targetRole || "Unset (Set in profile)"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {/* Acquired Skills */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black block">Matched Skills ({analysis.skillGap?.acquired.length || 0})</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.skillGap?.acquired.map((s) => (
                          <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/10">
                            {s}
                          </span>
                        ))}
                        {(!analysis.skillGap?.acquired || analysis.skillGap.acquired.length === 0) && (
                          <span className="text-xs text-slate-500 italic">No skills matched.</span>
                        )}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-rose-400 uppercase tracking-widest font-black block">Missing Gap Skills ({analysis.skillGap?.missing.length || 0})</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.skillGap?.missing.map((s) => (
                          <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/10 flex items-center gap-1">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-400" />
                            {s}
                          </span>
                        ))}
                        {(!analysis.skillGap?.missing || analysis.skillGap.missing.length === 0) && (
                          <span className="text-xs text-emerald-400 font-semibold">Perfect alignment! No missing competencies.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <Link href="/dashboard/skill-gap" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5">
                    View deep gap report
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>
            </div>

            {/* SECTION 9: PLACEMENT INSIGHT PANEL */}
            <Card className="glass-panel p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                Placement Insight Panel
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.placementInsights.map((insight, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 font-medium flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </div>
                ))}
                {analysis.placementInsights.length === 0 && (
                  <div className="p-4 bg-slate-900/40 border border-white/5 rounded-xl text-xs text-slate-500 italic">
                    Insights will appear once target role is configured.
                  </div>
                )}
              </div>
            </Card>

            {/* SECTION 2: STRUCTURED PARSED RESUME DETAILS */}
            <Card className="glass-panel p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Layers className="h-4.5 w-4.5 text-indigo-400" />
                    Extracted Resume Structures
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Structured details parsed out of the uploaded file.</p>
                </div>
                
                {/* details selector tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "contact", label: "Contact" },
                    { id: "skills", label: "Skills" },
                    { id: "education", label: "Education" },
                    { id: "projects", label: "Projects" },
                    { id: "experience", label: "Experience" },
                    { id: "achievements", label: "Achievements" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDetailsTab(tab.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all border ${
                        activeDetailsTab === tab.id
                          ? "bg-indigo-600 text-white border-indigo-400/20 shadow-md shadow-indigo-600/10"
                          : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                {activeDetailsTab === "contact" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-3">
                      <User className="h-5 w-5 text-indigo-400" />
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">Name</span>
                        <span className="text-xs text-white font-bold">{analysis.parsedData.name || "Not Found"}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-3">
                      <Mail className="h-5 w-5 text-indigo-400" />
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">Email</span>
                        <span className="text-xs text-white font-bold">{analysis.parsedData.email || "Not Found"}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-3">
                      <Phone className="h-5 w-5 text-indigo-400" />
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">Phone</span>
                        <span className="text-xs text-white font-bold">{analysis.parsedData.phone || "Not Found"}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-indigo-400" />
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">LinkedIn URL</span>
                        {analysis.parsedData.linkedin ? (
                          <a href={analysis.parsedData.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-bold">
                            LinkedIn Account
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Not Found</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-3 sm:col-span-2">
                      <Github className="h-5 w-5 text-indigo-400" />
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">GitHub URL</span>
                        {analysis.parsedData.github ? (
                          <a href={analysis.parsedData.github} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-bold">
                            GitHub Account
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Not Found</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeDetailsTab === "skills" && (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block mb-3">Extracted skills dictionary</span>
                    {analysis.parsedData.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.parsedData.skills.map((s) => (
                          <span key={s} className="text-xs px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/10 font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No skills extracted from text.</p>
                    )}
                  </div>
                )}

                {activeDetailsTab === "education" && (
                  <div className="space-y-3">
                    {analysis.parsedData.education.map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex gap-3 text-xs text-slate-300 leading-relaxed font-semibold">
                        <BookOpen className="h-5 w-5 text-indigo-400 shrink-0" />
                        <span>{edu}</span>
                      </div>
                    ))}
                    {analysis.parsedData.education.length === 0 && (
                      <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-slate-950/60 border border-white/5">No education records parsed.</p>
                    )}
                  </div>
                )}

                {activeDetailsTab === "projects" && (
                  <div className="space-y-4">
                    {analysis.parsedData.projects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                          <h4 className="text-xs font-bold text-white">{proj.title || `Project ${idx + 1}`}</h4>
                          
                          <div className="flex gap-2 text-[10px]">
                            {proj.githubLink && (
                              <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1 font-bold">
                                Repo
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                            {proj.liveLink && (
                              <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1 font-bold">
                                Live
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                        
                        {proj.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {proj.technologies.map(t => (
                              <span key={t} className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {analysis.parsedData.projects.length === 0 && (
                      <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-slate-950/60 border border-white/5">No project details extracted.</p>
                    )}
                  </div>
                )}

                {activeDetailsTab === "experience" && (
                  <div className="space-y-3">
                    {analysis.parsedData.experience.map((exp, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex gap-3 text-xs text-slate-300 leading-relaxed font-semibold">
                        <Briefcase className="h-5 w-5 text-indigo-400 shrink-0" />
                        <span>{exp}</span>
                      </div>
                    ))}
                    {analysis.parsedData.experience.length === 0 && (
                      <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-slate-950/60 border border-white/5">No experience details parsed.</p>
                    )}
                  </div>
                )}

                {activeDetailsTab === "achievements" && (
                  <div className="space-y-3">
                    {analysis.parsedData.achievements.map((ach, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex gap-3 text-xs text-slate-300 leading-relaxed font-semibold">
                        <Award className="h-5 w-5 text-indigo-400 shrink-0" />
                        <span>{ach}</span>
                      </div>
                    ))}
                    {analysis.parsedData.achievements.length === 0 && (
                      <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-slate-950/60 border border-white/5">No achievements details parsed.</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Floating toast */}
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
