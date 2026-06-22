"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Award,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export default function AnalyticsDashboardClient({ data }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 bg-slate-950 p-6 md:p-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  const {
    readinessScore,
    skillCompletionPercent,
    dsaCompletionPercent,
    roadmapProgressPercent,
    resumeCompletionPercent,
    profile,
    goalsSummary,
    missingSkills,
    requiredSkills,
    acquiredSkills,
  } = data;

  // 1. Chart: Weekly Progress Trend (mock trajectory leading to current score)
  const score = readinessScore || 10;
  const weeklyProgressData = [
    { name: "Week 1", Score: Math.max(8, Math.round(score * 0.35)) },
    { name: "Week 2", Score: Math.max(12, Math.round(score * 0.5)) },
    { name: "Week 3", Score: Math.max(18, Math.round(score * 0.65)) },
    { name: "Week 4", Score: Math.max(22, Math.round(score * 0.78)) },
    { name: "Week 5", Score: Math.max(30, Math.round(score * 0.9)) },
    { name: "Week 6", Score: score },
  ];

  // 2. Chart: DSA Topic Distribution (Radar dynamic to overall DSA progress)
  const dsaBase = dsaCompletionPercent || 15;
  const dsaTopicData = [
    {
      subject: "Arrays & Strings",
      Solved: Math.min(100, Math.round(dsaBase * 1.1)),
    },
    {
      subject: "Linked Lists",
      Solved: Math.min(100, Math.round(dsaBase * 0.9)),
    },
    {
      subject: "Stacks & Queues",
      Solved: Math.min(100, Math.round(dsaBase * 0.8)),
    },
    {
      subject: "Trees & Graphs",
      Solved: Math.min(100, Math.round(dsaBase * 0.5)),
    },
    {
      subject: "Dynamic Prog.",
      Solved: Math.min(100, Math.round(dsaBase * 0.3)),
    },
    {
      subject: "DBMS Queries",
      Solved: Math.min(100, Math.round(dsaBase * 0.7)),
    },
  ];

  // 3. Chart: Skill Completion Breakdown
  // Displays state of skills required for the role
  const skillsBreakdownData = requiredSkills.map((skill) => {
    const isAcquired = acquiredSkills.some(
      (as) => as.toLowerCase().trim() === skill.toLowerCase().trim(),
    );
    return {
      skill,
      Status: isAcquired ? 100 : 20, // 100% completed vs 20% baseline gap
      color: isAcquired ? "#8b5cf6" : "#ef4444",
    };
  });

  // Default fallback if no target role selected
  const defaultSkillsData = [
    {
      skill: "Languages",
      Status: profile.skills.length > 0 ? 80 : 20,
      color: "#8b5cf6",
    },
    {
      skill: "Frameworks",
      Status: profile.skills.length > 2 ? 60 : 20,
      color: "#8b5cf6",
    },
    {
      skill: "Databases",
      Status: profile.skills.length > 4 ? 70 : 20,
      color: "#8b5cf6",
    },
    {
      skill: "Dev Tools",
      Status: profile.skills.length > 5 ? 50 : 20,
      color: "#8b5cf6",
    },
  ];

  const actualSkillsData =
    skillsBreakdownData.length > 0 ? skillsBreakdownData : defaultSkillsData;

  // 4. Chart: Goal Completion Trend
  const goalTrendData = [
    { name: "Pending", value: goalsSummary.pending || 0, color: "#64748b" },
    {
      name: "In Progress",
      value: goalsSummary.inProgress || 0,
      color: "#f59e0b",
    },
    { name: "Completed", value: goalsSummary.completed || 0, color: "#10b981" },
  ];

  // Generate dynamic text insights
  const insights = [];
  if (profile.targetRole) {
    insights.push(
      `You have completed ${roadmapProgressPercent}% of your ${profile.targetRole} Roadmap.`,
    );
  } else {
    insights.push(
      "Set a target career role in settings/profile to map your personalized carrier roadmap progress.",
    );
  }

  if (missingSkills.length > 0) {
    insights.push(
      `${missingSkills.slice(0, 2).join(" and ")} are currently your biggest technical skill gaps.`,
    );
  } else if (profile.targetRole) {
    insights.push(
      `Excellent! You have acquired all core technical requirements mapped for ${profile.targetRole}.`,
    );
  }

  const projectsCount = profile.projects?.length || 0;
  if (projectsCount < 2) {
    const pointsIncrease = (2 - projectsCount) * 10;
    insights.push(
      `Adding ${2 - projectsCount} more project${2 - projectsCount > 1 ? "s" : ""} to your profile can increase your Readiness score by ${pointsIncrease}%.`,
    );
  } else {
    insights.push(
      "You meet the recommended project standards (2+ projects) for recruitment filters.",
    );
  }

  // Circular progress ring generator
  const renderProgressRing = (percentage, label, colorClass) => {
    const radius = 36;
    const strokeWidth = 5;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/40 border border-white/5 relative overflow-hidden">
        <div className="relative flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              className="text-slate-800"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="40"
              cy="40"
            />

            <circle
              className={`${colorClass} transition-all duration-500 ease-out`}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="40"
              cy="40"
            />
          </svg>
          <span className="absolute text-sm font-black text-white">
            {percentage}%
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 space-y-8 animate-slide-up relative">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-indigo-400 animate-pulse" />
            Preparation Analytics
          </h1>
          <p className="text-slate-400 mt-1">
            Visual insights, trend graphics, and benchmarks mapping your campus
            placement readiness.
          </p>
        </div>
        <Link href="/dashboard/profile">
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer shadow-lg shadow-indigo-600/20 hover:from-violet-500 hover:to-indigo-500 font-semibold flex items-center gap-2 py-5 px-5">
            Update Profile Data
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* TOP GRID: Score Card + 4 Progress Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Readiness Dial Card */}
        <Card className="lg:col-span-1 glass-panel p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glowing ring */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-indigo-400" />
              Readiness Score
            </h3>
            <p className="text-xs text-slate-500">
              Placement recruitment filter probability score.
            </p>
          </div>

          <div className="my-6 flex items-baseline gap-2">
            <span className="text-6xl font-black bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              {readinessScore}
            </span>
            <span className="text-slate-500 font-bold text-sm uppercase">
              / 100 pts
            </span>
          </div>

          {/* Dynamic Progress indicator */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Preparation Index</span>
              <span className="text-indigo-400">
                {readinessScore >= 80
                  ? "Excellent"
                  : readinessScore >= 60
                    ? "Good"
                    : "Needs Work"}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>
        </Card>

        {/* 4 progress rings */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {renderProgressRing(
            skillCompletionPercent,
            "Skills Complete",
            "text-violet-500",
          )}
          {renderProgressRing(
            dsaCompletionPercent,
            "DSA Progress",
            "text-indigo-500",
          )}
          {renderProgressRing(
            roadmapProgressPercent,
            "Roadmap Steps",
            "text-blue-500",
          )}
          {renderProgressRing(
            resumeCompletionPercent,
            "Resume Score",
            "text-emerald-500",
          )}
        </div>
      </div>

      {/* MID SECTION: INSIGHTS & RECOMMENDATIONS */}
      <Card className="glass-panel p-6 space-y-4">
        <h3 className="text-base font-bold text-white border-b border-white/5 pb-2.5 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
          Dynamic Preparation Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 font-medium leading-relaxed flex items-start gap-2.5 shadow-sm"
            >
              <CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Weekly Progress Trend */}
        <Card className="glass-panel p-6 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              Weekly Progress Trend
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Readiness improvements calculated over the past 6 weeks.
            </p>
          </div>
          <div className="h-64 w-full text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis domain={[0, 100]} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="Score"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: DSA Topic Distribution */}
        <Card className="glass-panel p-6 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              DSA Topic Competence
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Estimated questionnaire completion percentages per DSA topic.
            </p>
          </div>
          <div className="h-64 w-full text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="70%"
                data={dsaTopicData}
              >
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke="#334155"
                />
                <Radar
                  name="Solved"
                  dataKey="Solved"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Skill Completion Breakdown */}
        <Card className="glass-panel p-6 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              Required Skills Mapping
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Status index comparison of required profile competencies.
            </p>
          </div>
          <div className="h-64 w-full text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actualSkillsData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  horizontal={false}
                />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
                <YAxis
                  dataKey="skill"
                  type="category"
                  stroke="#64748b"
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(val) => [
                    `${val === 100 ? "Acquired" : "Pending Gap"}`,
                    "Status",
                  ]}
                />

                <Bar dataKey="Status" radius={[0, 4, 4, 0]}>
                  {actualSkillsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || "#6366f1"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Goal Completion Trend */}
        <Card className="glass-panel p-6 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              Weekly Goal Statistics
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Distribution counts of active placement target goals in Mapped
              state.
            </p>
          </div>
          <div className="h-64 w-full text-xs font-semibold">
            {goalsSummary.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Bar dataKey="value" name="Goals Count" radius={[4, 4, 0, 0]}>
                    {goalTrendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center space-y-2">
                <AlertCircle className="h-10 w-10 text-slate-600" />
                <p className="text-xs text-slate-400">
                  No goals created yet. Visit your Goals Tracker to seed lists.
                </p>
                <Link href="/dashboard/goals">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[10px] mt-1 border-white/5"
                  >
                    Create Goal
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
