"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Code,
  ExternalLink,
  Edit2,
  Trash2,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Flame,
  Trophy,
  Sliders,
  Globe,
  RefreshCw,
  PlusCircle,
  Info,
  TrendingUp,
} from "lucide-react";

const LinkedinIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DSA_TOPICS = [
  "Arrays",
  "Strings",
  "Searching",
  "Sorting",
  "Recursion",
  "Backtracking",
  "Linked List",
  "Stack",
  "Queue",
  "Hashing",
  "Trees",
  "Binary Search Tree",
  "Heap",
  "Graphs",
  "Greedy",
  "Dynamic Programming",
  "Trie",
  "Segment Tree",
  "Bit Manipulation",
];

const PLATFORMS = [
  "LeetCode",
  "CodeChef",
  "Codeforces",
  "HackerRank",
  "GeeksforGeeks",
  "Other",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function DsaTrackerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Loading & State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [tracker, setTracker] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTopic, setFilterTopic] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modals state
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);

  // Form fields for Profile & Achievements edit modal
  const [formData, setFormData] = useState({
    profile: {},
    platformLinks: {},
    platformAchievements: {
      leetcode: {},
      codechef: {},
      codeforces: {},
      hackerrank: {},
    },
  });

  const fetchTracker = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dsa-tracker");
      if (res.ok) {
        const data = await res.json();
        setTracker(data);
        // Initialize form data
        setFormData({
          profile: { ...data.profile },
          platformLinks: { ...data.platformLinks },
          platformAchievements: {
            leetcode: { ...data.platformAchievements.leetcode },
            codechef: { ...data.platformAchievements.codechef },
            codeforces: { ...data.platformAchievements.codeforces },
            hackerrank: { ...data.platformAchievements.hackerrank },
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch tracker:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTracker();
    }
  }, [status]);

  const handleUpdateAchievements = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/dsa-tracker", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setTracker(data.tracker);
        setShowAchievementModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTierChange = async (tier) => {
    if (!tracker) return;
    const updatedProfile = { ...tracker.profile, targetCompanyTier: tier };
    try {
      const res = await fetch("/api/dsa-tracker", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: updatedProfile }),
      });
      if (res.ok) {
        const data = await res.json();
        setTracker(data.tracker);
        setFormData((prev) => ({
          ...prev,
          profile: { ...data.tracker.profile },
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTopicStatus = async (topicName) => {
    if (!tracker) return;
    const updatedTopics = tracker.topics.map((t) => {
      if (t.name === topicName) {
        const nextStatus =
          t.status === "Not Started"
            ? "In Progress"
            : t.status === "In Progress"
              ? "Completed"
              : "Not Started";
        return { ...t, status: nextStatus };
      }
      return t;
    });

    // Optimistic UI
    setTracker({ ...tracker, topics: updatedTopics });

    try {
      await fetch("/api/dsa-tracker", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics: updatedTopics }),
      });
    } catch (err) {
      console.error("Failed to update topic status:", err);
      fetchTracker(); // Rollback
    }
  };

  const openAddProblemModal = () => {
    setCurrentProblem({
      name: "",
      topic: DSA_TOPICS[0],
      difficulty: "Easy",
      platform: "LeetCode",
      url: "",
      solvedStatus: "Solved",
      revisionNeeded: false,
      solvedAt: new Date().toISOString().split("T")[0],
    });
    setShowProblemModal(true);
  };

  const openEditProblemModal = (problem) => {
    setCurrentProblem({
      ...problem,
      solvedAt: new Date(problem.solvedAt).toISOString().split("T")[0],
    });
    setShowProblemModal(true);
  };

  const handleSaveProblem = async (e) => {
    e.preventDefault();
    if (!currentProblem || !currentProblem.name || !tracker) return;

    try {
      setSaving(true);
      const isEdit = !!currentProblem._id;
      const url = isEdit
        ? `/api/dsa-tracker/problems/${currentProblem._id}`
        : "/api/dsa-tracker";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProblem),
      });

      if (res.ok) {
        const data = await res.json();
        setTracker({ ...tracker, problems: data.problems });
        setShowProblemModal(false);
        setCurrentProblem(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (
      !tracker ||
      !confirm("Are you sure you want to delete this problem entry?")
    )
      return;
    try {
      const res = await fetch(`/api/dsa-tracker/problems/${problemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setTracker({ ...tracker, problems: data.problems });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !tracker) {
    return (
      <div className="flex-1 bg-slate-950 p-6 md:p-12 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase animate-pulse">
            Configuring DSA Tracking Profile...
          </p>
        </div>
      </div>
    );
  }

  // Calculate Overall Progress
  const totalTopicsCount = tracker.topics.length;
  const completedTopicsCount = tracker.topics.filter(
    (t) => t.status === "Completed",
  ).length;
  const inProgressTopicsCount = tracker.topics.filter(
    (t) => t.status === "In Progress",
  ).length;
  const calculatedProgressPercent = Math.round(
    ((completedTopicsCount + 0.5 * inProgressTopicsCount) / totalTopicsCount) *
      100,
  );

  // Filters logic
  const filteredProblems = tracker.problems.filter((prob) => {
    const matchesSearch = prob.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTopic = filterTopic === "All" || prob.topic === filterTopic;
    const matchesDifficulty =
      filterDifficulty === "All" || prob.difficulty === filterDifficulty;
    const matchesPlatform =
      filterPlatform === "All" || prob.platform === filterPlatform;
    const matchesStatus =
      filterStatus === "All" || prob.solvedStatus === filterStatus;
    return (
      matchesSearch &&
      matchesTopic &&
      matchesDifficulty &&
      matchesPlatform &&
      matchesStatus
    );
  });

  // Recharts calculations
  // 1. Difficulty
  const difficultyData = [
    {
      name: "Easy",
      value: tracker.profile.easyQuestions || 0,
      color: "#10b981",
    },
    {
      name: "Medium",
      value: tracker.profile.mediumQuestions || 0,
      color: "#f59e0b",
    },
    {
      name: "Hard",
      value: tracker.profile.hardQuestions || 0,
      color: "#ef4444",
    },
  ].filter((d) => d.value > 0);

  // Fallback if difficulty values are 0
  const solvedFromProblems = tracker.problems.filter(
    (p) => p.solvedStatus === "Solved",
  );
  const derivedDifficultyData = [
    {
      name: "Easy",
      value: solvedFromProblems.filter((p) => p.difficulty === "Easy").length,
      color: "#10b981",
    },
    {
      name: "Medium",
      value: solvedFromProblems.filter((p) => p.difficulty === "Medium").length,
      color: "#f59e0b",
    },
    {
      name: "Hard",
      value: solvedFromProblems.filter((p) => p.difficulty === "Hard").length,
      color: "#ef4444",
    },
  ].filter((d) => d.value > 0);

  const displayDiffData =
    difficultyData.length > 0 ? difficultyData : derivedDifficultyData;

  // 2. Topic Group
  const topicGroupMap = {};
  solvedFromProblems.forEach((p) => {
    topicGroupMap[p.topic] = (topicGroupMap[p.topic] || 0) + 1;
  });
  const topicChartData = Object.entries(topicGroupMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7); // top 7 topics

  // 3. Platform Distribution
  const platformGroupMap = {};
  solvedFromProblems.forEach((p) => {
    platformGroupMap[p.platform] = (platformGroupMap[p.platform] || 0) + 1;
  });
  // Combine manual inputs with actual logged
  const platformChartData = PLATFORMS.map((platform) => {
    let manualCount = 0;
    if (platform === "LeetCode")
      manualCount = tracker.platformAchievements.leetcode.questionsSolved;
    // For GeeksforGeeks or other, count from problems
    const problemsCount = platformGroupMap[platform] || 0;
    return {
      name: platform,
      solved: Math.max(manualCount, problemsCount),
    };
  }).filter((p) => p.solved > 0);

  // 4. Weekly Progress
  // Group problems solved in last 5 weeks
  const weeklyData = [
    { week: "Week -4", count: 0 },
    { week: "Week -3", count: 0 },
    { week: "Week -2", count: 0 },
    { week: "Last Week", count: 0 },
    { week: "This Week", count: 0 },
  ];

  const nowTime = new Date().getTime();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  solvedFromProblems.forEach((p) => {
    const solvedTime = new Date(p.solvedAt).getTime();
    const diffWeeks = Math.floor((nowTime - solvedTime) / oneWeekMs);
    if (diffWeeks === 0) weeklyData[4].count++;
    else if (diffWeeks === 1) weeklyData[3].count++;
    else if (diffWeeks === 2) weeklyData[2].count++;
    else if (diffWeeks === 3) weeklyData[1].count++;
    else if (diffWeeks === 4) weeklyData[0].count++;
  });

  // Insights generation engine based on user metrics & selected company tier
  const generateInsights = () => {
    const insights = [];
    const tier = tracker.profile.targetCompanyTier;
    const total = tracker.profile.totalQuestions || solvedFromProblems.length;
    const easy =
      tracker.profile.easyQuestions ||
      solvedFromProblems.filter((p) => p.difficulty === "Easy").length;
    const medium =
      tracker.profile.mediumQuestions ||
      solvedFromProblems.filter((p) => p.difficulty === "Medium").length;
    const hard =
      tracker.profile.hardQuestions ||
      solvedFromProblems.filter((p) => p.difficulty === "Hard").length;

    // Calculate topics statuses
    const dpStatus =
      tracker.topics.find((t) => t.name === "Dynamic Programming")?.status ||
      "Not Started";
    const graphStatus =
      tracker.topics.find((t) => t.name === "Graphs")?.status || "Not Started";
    const treeStatus =
      tracker.topics.find((t) => t.name === "Trees")?.status || "Not Started";

    const completedArray = tracker.topics
      .filter((t) => t.status === "Completed")
      .map((t) => t.name);

    if (
      completedArray.includes("Arrays") &&
      completedArray.includes("Strings")
    ) {
      insights.push("Strong foundation verified in Arrays and Strings.");
    } else {
      insights.push(
        "Focus on finishing foundational Arrays and Strings checklist topics.",
      );
    }

    if (tier === "Tier 1") {
      insights.push(
        "🎯 Target: Tier 1 (Google, Microsoft, Amazon) requires deep algorithmic coverage.",
      );
      if (total < 350) {
        insights.push(
          `Aim to solve 350+ questions (Currently: ${total}). You need ${350 - total} more.`,
        );
      }
      if (medium < 150) {
        insights.push(
          `Increase Medium problem practice to reach 150+ for Tier 1 (Currently: ${medium}).`,
        );
      }
      if (hard < 40) {
        insights.push(
          `Work on Hard problems! Target is 40+ Hards (Currently: ${hard}).`,
        );
      }
      if (dpStatus !== "Completed") {
        insights.push(
          "Priority Alert: Complete Dynamic Programming, as it is a core Tier 1 interview topic.",
        );
      }
      if (graphStatus !== "Completed") {
        insights.push(
          "Priority Alert: Graphs practice needs improvement (not yet marked completed).",
        );
      }
    } else if (tier === "Tier 2") {
      insights.push(
        "🎯 Target: Tier 2 (JPMC, Morgan Stanley, Goldman Sachs) requires solid medium difficulty mastery.",
      );
      if (total < 220) {
        insights.push(
          `Aim to solve 220+ questions (Currently: ${total}). You need ${220 - total} more.`,
        );
      }
      if (medium < 80) {
        insights.push(
          `Focus on Medium difficulty coverage. Target is 80+ Mediums (Currently: ${medium}).`,
        );
      }
      if (treeStatus !== "Completed" && treeStatus !== "In Progress") {
        insights.push(
          "Trees checklist is untouched. Ensure you finish Tree traversals & BST properties.",
        );
      }
    } else {
      insights.push(
        "🎯 Target: Tier 3 (Service-based & general entry placements) focuses on core DSA basics.",
      );
      if (total < 100) {
        insights.push(
          `Aim to solve 100+ questions (Currently: ${total}) to pass initial coding screening rounds.`,
        );
      }
      if (easy < 50) {
        insights.push(
          `Strengthen core coding speed: complete at least 50 Easy questions (Currently: ${easy}).`,
        );
      }
    }

    // Streaks feedback
    if (tracker.profile.currentStreak >= 5) {
      insights.push(
        `🔥 Impressive consistency! Active ${tracker.profile.currentStreak}-day coding streak.`,
      );
    } else if (tracker.profile.currentStreak === 0) {
      insights.push(
        "Consistency check: Solve 1 problem today to activate your daily prep streak.",
      );
    }

    return insights;
  };

  const insightsList = generateInsights();

  return (
    <div className="flex-1 bg-slate-950 p-4 md:p-8 relative overflow-hidden animate-slide-up">
      {/* Ambient background blur circles */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-violet-600/5 blur-3xl -z-10 pointer-events-none" />

      {/* Main Grid Wrapper */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
              <Code className="h-8 w-8 text-indigo-400" />
              DSA Preparation Tracker
            </h1>
            <p className="text-slate-400 text-xs font-semibold">
              Visualize prep readiness, manage problem sets, and synchronize
              platform stats.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Target Tier dropdown */}
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-extrabold">
                Target Tier:
              </span>
              <select
                value={tracker.profile.targetCompanyTier}
                onChange={(e) => handleTierChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer border-none"
              >
                <option value="Tier 1" className="bg-slate-900">
                  Tier 1 (FAANG & Elite)
                </option>
                <option value="Tier 2" className="bg-slate-900">
                  Tier 2 (Investment Banks)
                </option>
                <option value="Tier 3" className="bg-slate-900">
                  Tier 3 (Service & Mid-size)
                </option>
              </select>
            </div>

            <Button
              onClick={() => setShowAchievementModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer shadow-lg shadow-indigo-500/10 transition-all flex items-center gap-1.5"
            >
              <Sliders className="h-3.5 w-3.5" />
              Update Achievements
            </Button>
          </div>
        </div>

        {/* SECTION 1 & 2: DSA PROFILE & PLATFORM BADGES */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* STATS OVERVIEW CARDS */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Solved Card */}
            <div className="bg-slate-900/30 border border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:border-indigo-500/25 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">
                  Total Solved
                </span>
                <span className="p-1 rounded bg-indigo-500/10 text-indigo-400">
                  <Code className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-white">
                  {tracker.profile.totalQuestions || solvedFromProblems.length}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Overall coding questions
                </p>
              </div>
            </div>

            {/* Easy Card */}
            <div className="bg-slate-900/30 border border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-500/25 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">
                  Easy Solved
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mt-1.5" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-emerald-400">
                  {tracker.profile.easyQuestions}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Basics & Speed builders
                </p>
              </div>
            </div>

            {/* Medium Card */}
            <div className="bg-slate-900/30 border border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:border-amber-500/25 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">
                  Medium Solved
                </span>
                <span className="h-2 w-2 rounded-full bg-amber-50 animate-pulse mt-1.5" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-amber-400">
                  {tracker.profile.mediumQuestions}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Interview Core Core
                </p>
              </div>
            </div>

            {/* Hard Card */}
            <div className="bg-slate-900/30 border border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:border-rose-500/25 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">
                  Hard Solved
                </span>
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse mt-1.5" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-rose-400">
                  {tracker.profile.hardQuestions}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Advanced Algorithmics
                </p>
              </div>
            </div>

            {/* Streaks & overall progress bar row */}
            <div className="col-span-2 md:col-span-4 bg-slate-900/20 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Streaks */}
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                      Current Streak
                    </span>
                    <span className="text-xl font-extrabold text-orange-400">
                      {tracker.profile.currentStreak} Days
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                      Longest Streak
                    </span>
                    <span className="text-xl font-extrabold text-yellow-400">
                      {tracker.profile.longestStreak} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">
                    Topics Checklist Completion Rate
                  </span>
                  <span className="text-indigo-400">
                    {calculatedProgressPercent}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, calculatedProgressPercent))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 & 7: SOCIALS & PLATFORM LINKS */}
          <div className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-white/5 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-indigo-400" />
                Platform Links
              </h3>

              <div className="space-y-3 mt-4">
                {/* LeetCode */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">LeetCode</span>
                  {tracker.platformLinks.leetcode ? (
                    <a
                      href={tracker.platformLinks.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
                    >
                      View Profile <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-slate-600 italic">Not Added</span>
                  )}
                </div>

                {/* CodeChef */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">CodeChef</span>
                  {tracker.platformLinks.codechef ? (
                    <a
                      href={tracker.platformLinks.codechef}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
                    >
                      View Profile <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-slate-600 italic">Not Added</span>
                  )}
                </div>

                {/* Codeforces */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Codeforces</span>
                  {tracker.platformLinks.codeforces ? (
                    <a
                      href={tracker.platformLinks.codeforces}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
                    >
                      View Profile <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-slate-600 italic">Not Added</span>
                  )}
                </div>

                {/* HackerRank */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">HackerRank</span>
                  {tracker.platformLinks.hackerrank ? (
                    <a
                      href={tracker.platformLinks.hackerrank}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
                    >
                      View Profile <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-slate-600 italic">Not Added</span>
                  )}
                </div>

                {/* GeeksforGeeks */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">GeeksforGeeks</span>
                  {tracker.platformLinks.geeksforgeeks ? (
                    <a
                      href={tracker.platformLinks.geeksforgeeks}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
                    >
                      View Profile <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-slate-600 italic">Not Added</span>
                  )}
                </div>
              </div>
            </div>

            {/* LinkedIn profile */}
            <div className="pt-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                  <LinkedinIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block">
                    LinkedIn Integration
                  </span>
                  {tracker.profile.linkedinUrl ? (
                    <a
                      href={tracker.profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-300 hover:text-blue-400 truncate block flex items-center gap-1"
                    >
                      View Profile{" "}
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs italic text-slate-600">
                      No profile URL saved
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: PLATFORM ACHIEVEMENTS (STAT CARD BADGES) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* LeetCode Achievements */}
          <div className="bg-slate-900/25 border border-white/5 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-extrabold text-yellow-500 tracking-wider">
                LEETCODE
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 font-bold">
                Platform Stats
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">
                  Solved
                </span>
                <span className="text-white font-extrabold block mt-0.5">
                  {tracker.platformAchievements.leetcode.questionsSolved || 0}
                </span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">
                  Contests
                </span>
                <span className="text-white font-extrabold block mt-0.5">
                  {tracker.platformAchievements.leetcode.contestParticipated ||
                    0}
                </span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">
                  Global Rank
                </span>
                <span className="text-white font-extrabold block mt-0.5 text-[10px] truncate">
                  {tracker.platformAchievements.leetcode.globalRanking || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* CodeChef Achievements */}
          <div className="bg-slate-900/25 border border-white/5 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-extrabold text-orange-500 tracking-wider">
                CODECHEF
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-bold">
                Platform Stats
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">
                  Rating
                </span>
                <span className="text-white font-extrabold block mt-0.5">
                  {tracker.platformAchievements.codechef.rating || 0}
                </span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">
                  Stars
                </span>
                <span className="text-white font-extrabold block mt-0.5 text-orange-400">
                  {tracker.platformAchievements.codechef.starRating || "1★"}
                </span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">
                  Contests
                </span>
                <span className="text-white font-extrabold block mt-0.5">
                  {tracker.platformAchievements.codechef.contestParticipated ||
                    0}
                </span>
              </div>
            </div>
          </div>

          {/* Codeforces Achievements */}
          <div className="bg-slate-900/25 border border-white/5 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-extrabold text-cyan-400 tracking-wider">
                CODEFORCES
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold">
                Platform Stats
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">
                  Rating
                </span>
                <span className="text-white font-extrabold block mt-0.5">
                  {tracker.platformAchievements.codeforces.rating || 0}
                </span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">
                  Rank
                </span>
                <span
                  className="text-white font-bold block mt-0.5 text-[9px] truncate"
                  title={tracker.platformAchievements.codeforces.rank}
                >
                  {tracker.platformAchievements.codeforces.rank || "Newbie"}
                </span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">
                  Contests
                </span>
                <span className="text-white font-extrabold block mt-0.5">
                  {tracker.platformAchievements.codeforces
                    .contestParticipated || 0}
                </span>
              </div>
            </div>
          </div>

          {/* HackerRank Achievements */}
          <div className="bg-slate-900/25 border border-white/5 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-extrabold text-emerald-400 tracking-wider">
                HACKERRANK
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                Platform Stats
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center text-xs">
              <div className="bg-slate-950/50 p-1.5 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[8px] block uppercase font-bold">
                  Problem
                </span>
                <span className="text-white font-extrabold block mt-0.5">
                  {tracker.platformAchievements.hackerrank
                    .problemSolvingBadge || 0}
                  ⭐
                </span>
              </div>
              <div className="bg-slate-950/50 p-1.5 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[8px] block uppercase font-bold">
                  Java
                </span>
                <span className="text-white font-extrabold block mt-0.5">
                  {tracker.platformAchievements.hackerrank.javaBadge || 0}⭐
                </span>
              </div>
              <div className="bg-slate-950/50 p-1.5 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[8px] block uppercase font-bold">
                  SQL
                </span>
                <span className="text-white font-extrabold block mt-0.5">
                  {tracker.platformAchievements.hackerrank.sqlBadge || 0}⭐
                </span>
              </div>
              <div className="bg-slate-950/50 p-1.5 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[8px] block uppercase font-bold">
                  Contest
                </span>
                <span className="text-white font-extrabold block mt-0.5">
                  {tracker.platformAchievements.hackerrank
                    .contestParticipated || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6 & 8: ANALYTICS DASHBOARD & INSIGHTS PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ANALYTICS CHARTS (LEFT 2 COLS) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-panel p-6">
              <CardHeader className="p-0 pb-4 border-b border-white/5 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                    DSA Metrics Analytics
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    Visualizing question counts, topic coverage, and platform
                    distributions.
                  </CardDescription>
                </div>
                <div className="p-2 rounded bg-indigo-500/10 text-indigo-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-6">
                {isMounted ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Questions by Difficulty */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-400 block text-center">
                        Questions by Difficulty
                      </span>
                      <div className="h-56 flex items-center justify-center">
                        {displayDiffData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={displayDiffData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {displayDiffData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#0f172a",
                                  borderColor: "#334155",
                                  color: "#fff",
                                  borderRadius: "8px",
                                }}
                              />
                              <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => (
                                  <span className="text-xs text-slate-300 font-medium">
                                    {value}
                                  </span>
                                )}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-slate-600 text-xs italic flex flex-col items-center justify-center gap-1">
                            <Info className="h-4 w-4" /> No questions logged
                            yet.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Platform Distribution */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-400 block text-center">
                        Questions by Platform
                      </span>
                      <div className="h-56">
                        {platformChartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={platformChartData}>
                              <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                fontSize={9}
                                tickLine={false}
                              />
                              <YAxis
                                stroke="#94a3b8"
                                fontSize={9}
                                tickLine={false}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#0f172a",
                                  borderColor: "#334155",
                                  color: "#fff",
                                  borderRadius: "8px",
                                }}
                              />
                              <Bar
                                dataKey="solved"
                                fill="#6366f1"
                                radius={[4, 4, 0, 0]}
                              >
                                {platformChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      entry.name === "LeetCode"
                                        ? "#eab308"
                                        : entry.name === "CodeChef"
                                          ? "#f97316"
                                          : entry.name === "Codeforces"
                                            ? "#22d3ee"
                                            : entry.name === "HackerRank"
                                              ? "#34d399"
                                              : "#818cf8"
                                    }
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full text-slate-600 text-xs italic flex flex-col items-center justify-center gap-1">
                            <Info className="h-4 w-4" /> Add problems to view
                            platform details.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Questions by Topic */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-400 block text-center">
                        Top 7 Topics Solved
                      </span>
                      <div className="h-56">
                        {topicChartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topicChartData} layout="vertical">
                              <XAxis
                                type="number"
                                stroke="#94a3b8"
                                fontSize={9}
                                tickLine={false}
                              />
                              <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#94a3b8"
                                fontSize={8}
                                width={80}
                                tickLine={false}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#0f172a",
                                  borderColor: "#334155",
                                  color: "#fff",
                                  borderRadius: "8px",
                                }}
                              />
                              <Bar
                                dataKey="count"
                                fill="#818cf8"
                                radius={[0, 4, 4, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full text-slate-600 text-xs italic flex flex-col items-center justify-center gap-1">
                            <Info className="h-4 w-4" /> Grouped counts appear
                            when problems are solved.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Weekly Progress */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-400 block text-center">
                        Weekly Solve Rate (Past 5 Weeks)
                      </span>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={weeklyData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#334155"
                              opacity={0.1}
                            />
                            <XAxis
                              dataKey="week"
                              stroke="#94a3b8"
                              fontSize={9}
                              tickLine={false}
                            />
                            <YAxis
                              stroke="#94a3b8"
                              fontSize={9}
                              tickLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                color: "#fff",
                                borderRadius: "8px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke="#a78bfa"
                              strokeWidth={2}
                              dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-600 text-sm">
                    Spinning up analytics engines...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* PLACEMENT INSIGHT PANEL (RIGHT 1 COL) */}
          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl space-y-4 h-fit backdrop-blur-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-white/5 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Placement Readiness Insights
            </h3>

            <div className="bg-indigo-950/20 border border-indigo-500/10 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black block">
                Tier Strategy
              </span>
              <span className="text-base font-extrabold text-white">
                {tracker.profile.targetCompanyTier === "Tier 1"
                  ? "FAANG & High Product Focus"
                  : tracker.profile.targetCompanyTier === "Tier 2"
                    ? "Fintech & Investment Banking"
                    : "Mass & Services Companies"}
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                SkillBridge runs algorithmic comparisons against placements
                standards inside the{" "}
                <span className="text-indigo-400 font-semibold">
                  {tracker.profile.targetCompanyTier}
                </span>{" "}
                criteria.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">
                Personal Recommendations
              </span>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {insightsList.map((insight, index) => {
                  const isAlert =
                    insight.includes("Alert") || insight.includes("Target");
                  const isStreak = insight.includes("streak");
                  return (
                    <div
                      key={index}
                      className={`text-xs p-3 rounded-lg border flex items-start gap-2 ${
                        isAlert
                          ? "bg-rose-500/5 border-rose-500/10 text-rose-300"
                          : isStreak
                            ? "bg-orange-500/5 border-orange-500/10 text-orange-300"
                            : "bg-slate-950/80 border-white/5 text-slate-300"
                      }`}
                    >
                      {isAlert ? (
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                      )}
                      <span>{insight}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: DSA TOPICS TRACKER */}
        <Card className="glass-panel p-6">
          <CardHeader className="p-0 pb-4 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                DSA Topics Roadmap Checklist
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                Toggle topics between status states. (Click to shift: Not
                Started $\to$ In Progress $\to$ Completed)
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-slate-700" /> Not
                Started
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> In
                Progress
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
                Completed
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0 pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {DSA_TOPICS.map((topicName) => {
                const topicObj = tracker.topics.find(
                  (t) => t.name === topicName,
                ) || { name: topicName, status: "Not Started" };
                const status = topicObj.status;

                return (
                  <button
                    key={topicName}
                    onClick={() => toggleTopicStatus(topicName)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold text-left transition-all hover:scale-[1.02] cursor-pointer group ${
                      status === "Completed"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                        : status === "In Progress"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                          : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="truncate pr-1">{topicName}</span>
                    <span className="shrink-0 text-[10px] font-extrabold group-hover:scale-110 transition-transform">
                      {status === "Completed"
                        ? "✔"
                        : status === "In Progress"
                          ? "⏳"
                          : "❌"}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 5: PROBLEM TRACKER LOG */}
        <Card className="glass-panel p-6">
          <CardHeader className="p-0 pb-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                Question Tracker Log
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                Record details of questions you solved, mark revisions, and
                filter historical items.
              </CardDescription>
            </div>

            <Button
              onClick={openAddProblemModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer shadow-lg shadow-indigo-600/15 flex items-center gap-1.5 self-start md:self-auto"
            >
              <PlusCircle className="h-4 w-4" />
              Add Problem Entry
            </Button>
          </CardHeader>

          <CardContent className="p-0 pt-6 space-y-4">
            {/* FILTERS & SEARCH ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search problem..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500/50"
                />
              </div>

              {/* Topic Filter */}
              <div className="flex items-center gap-2 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs">
                <Filter className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value)}
                  className="bg-transparent text-slate-300 outline-none w-full border-none cursor-pointer font-medium"
                >
                  <option value="All" className="bg-slate-900">
                    All Topics
                  </option>
                  {DSA_TOPICS.map((t) => (
                    <option key={t} value={t} className="bg-slate-900">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-2 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs">
                <Sliders className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="bg-transparent text-slate-300 outline-none w-full border-none cursor-pointer font-medium"
                >
                  <option value="All" className="bg-slate-900">
                    All Difficulties
                  </option>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d} className="bg-slate-900">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform Filter */}
              <div className="flex items-center gap-2 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs">
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="bg-transparent text-slate-300 outline-none w-full border-none cursor-pointer font-medium"
                >
                  <option value="All" className="bg-slate-900">
                    All Platforms
                  </option>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p} className="bg-slate-900">
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent text-slate-300 outline-none w-full border-none cursor-pointer font-medium"
                >
                  <option value="All" className="bg-slate-900">
                    All Statuses
                  </option>
                  <option value="Solved" className="bg-slate-900">
                    Solved
                  </option>
                  <option value="Attempted" className="bg-slate-900">
                    Attempted
                  </option>
                  <option value="Todo" className="bg-slate-900">
                    Todo
                  </option>
                </select>
              </div>
            </div>

            {/* PROBLEM LOG TABLE */}
            <div className="overflow-x-auto border border-white/5 rounded-xl bg-slate-950/20">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-slate-900/40 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Problem Name</th>
                    <th className="p-4">Topic</th>
                    <th className="p-4 text-center">Difficulty</th>
                    <th className="p-4 text-center">Platform</th>
                    <th className="p-4 text-center">Solved Status</th>
                    <th className="p-4 text-center">Revision Needed</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProblems.length > 0 ? (
                    filteredProblems.map((prob) => (
                      <tr
                        key={prob._id}
                        className="hover:bg-white/2 transition-colors"
                      >
                        <td className="p-4 font-bold text-slate-200">
                          {prob.url ? (
                            <a
                              href={prob.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-indigo-400 flex items-center gap-1.5 w-fit"
                            >
                              {prob.name}
                              <ExternalLink className="h-3.5 w-3.5 opacity-50 shrink-0" />
                            </a>
                          ) : (
                            prob.name
                          )}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/5">
                            {prob.topic}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                              prob.difficulty === "Easy"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                                : prob.difficulty === "Medium"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                        </td>
                        <td className="p-4 text-center text-slate-300 font-medium">
                          {prob.platform}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                              prob.solvedStatus === "Solved"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : prob.solvedStatus === "Attempted"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-slate-800 text-slate-500"
                            }`}
                          >
                            {prob.solvedStatus}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {prob.revisionNeeded ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/10 font-bold text-[9px] uppercase">
                              <AlertCircle className="h-3.5 w-3.5 text-orange-400" />{" "}
                              Yes
                            </span>
                          ) : (
                            <span className="text-slate-600">No</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditProblemModal(prob)}
                              className="p-1.5 rounded bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 cursor-pointer"
                              title="Edit Problem"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProblem(prob._id)}
                              className="p-1.5 rounded bg-slate-900/60 border border-white/5 hover:border-rose-500/30 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                              title="Delete Problem"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-8 text-center text-slate-500 italic"
                      >
                        No problems found matching search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MODAL 1: EDIT ACHIEVEMENTS & PLATFORM DATA */}
      {showAchievementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-3xl w-full p-4 sm:p-5 space-y-4 max-h-[92vh] overflow-y-auto relative animate-fade-in shadow-2xl">
            <h2 className="text-base font-bold text-white border-b border-white/5 pb-2">
              Update Profile Achievements & Links
            </h2>

            <form
              onSubmit={handleUpdateAchievements}
              className="space-y-4 text-xs text-slate-300"
            >
              {/* SECTION 1: STREAK AND LinkedIn */}
              <div className="space-y-2">
                <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">
                  1. General DSA profile info
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-slate-400 font-bold mb-0.5">
                      Total Solved
                    </label>
                    <input
                      type="number"
                      value={formData.profile.totalQuestions || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            totalQuestions: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-1.5 px-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-400 font-bold mb-0.5">
                      Easy Solved
                    </label>
                    <input
                      type="number"
                      value={formData.profile.easyQuestions || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            easyQuestions: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-1.5 px-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 font-bold mb-0.5">
                      Medium Solved
                    </label>
                    <input
                      type="number"
                      value={formData.profile.mediumQuestions || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            mediumQuestions: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-1.5 px-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-rose-400 font-bold mb-0.5">
                      Hard Solved
                    </label>
                    <input
                      type="number"
                      value={formData.profile.hardQuestions || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            hardQuestions: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-1.5 px-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-0.5">
                      Current Streak
                    </label>
                    <input
                      type="number"
                      value={formData.profile.currentStreak || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            currentStreak: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-1.5 px-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-0.5">
                      Longest Streak
                    </label>
                    <input
                      type="number"
                      value={formData.profile.longestStreak || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            longestStreak: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-1.5 px-2.5 text-white outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 font-bold mb-0.5">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.profile.linkedinUrl || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            linkedinUrl: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-1.5 px-2.5 text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PLATFORM LINKS */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">
                  2. Platform Profile URLs
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-400 font-bold mb-0.5">
                      LeetCode URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://leetcode.com/username"
                      value={formData.platformLinks.leetcode || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          platformLinks: {
                            ...formData.platformLinks,
                            leetcode: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-1.5 px-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-0.5">
                      CodeChef URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://codechef.com/users/username"
                      value={formData.platformLinks.codechef || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          platformLinks: {
                            ...formData.platformLinks,
                            codechef: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-1.5 px-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-0.5">
                      Codeforces URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://codeforces.com/profile/username"
                      value={formData.platformLinks.codeforces || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          platformLinks: {
                            ...formData.platformLinks,
                            codeforces: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-1.5 px-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-0.5">
                      HackerRank URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://hackerrank.com/username"
                      value={formData.platformLinks.hackerrank || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          platformLinks: {
                            ...formData.platformLinks,
                            hackerrank: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-1.5 px-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-0.5">
                      GeeksforGeeks URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://auth.geeksforgeeks.org/user/username"
                      value={formData.platformLinks.geeksforgeeks || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          platformLinks: {
                            ...formData.platformLinks,
                            geeksforgeeks: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-1.5 px-2.5 text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PLATFORM ACHIEVEMENTS */}
              <div className="space-y-3 pt-2.5 border-t border-white/5">
                <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">
                  3. Platform Specific Statistics
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Leetcode */}
                  <div className="bg-slate-950/45 p-2.5 rounded-lg border border-white/5 space-y-1.5">
                    <span className="text-[9px] font-bold text-yellow-500 tracking-wider block">
                      LEETCODE STATS
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-500">
                          Solved
                        </label>
                        <input
                          type="number"
                          value={
                            formData.platformAchievements.leetcode
                              .questionsSolved || 0
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                leetcode: {
                                  ...formData.platformAchievements.leetcode,
                                  questionsSolved: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500">
                          Contests
                        </label>
                        <input
                          type="number"
                          value={
                            formData.platformAchievements.leetcode
                              .contestParticipated || 0
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                leetcode: {
                                  ...formData.platformAchievements.leetcode,
                                  contestParticipated: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500">
                          Global Rank
                        </label>
                        <input
                          type="number"
                          value={
                            formData.platformAchievements.leetcode
                              .globalRanking || 0
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                leetcode: {
                                  ...formData.platformAchievements.leetcode,
                                  globalRanking: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Codechef */}
                  <div className="bg-slate-950/45 p-2.5 rounded-lg border border-white/5 space-y-1.5">
                    <span className="text-[9px] font-bold text-orange-500 tracking-wider block">
                      CODECHEF STATS
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-500">
                          Rating
                        </label>
                        <input
                          type="number"
                          value={
                            formData.platformAchievements.codechef.rating || 0
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                codechef: {
                                  ...formData.platformAchievements.codechef,
                                  rating: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500">
                          Stars (1★-7★)
                        </label>
                        <select
                          value={
                            formData.platformAchievements.codechef.starRating ||
                            "1★"
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                codechef: {
                                  ...formData.platformAchievements.codechef,
                                  starRating: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white outline-none cursor-pointer"
                        >
                          <option value="1★">1★</option>
                          <option value="2★">2★</option>
                          <option value="3★">3★</option>
                          <option value="4★">4★</option>
                          <option value="5★">5★</option>
                          <option value="6★">6★</option>
                          <option value="7★">7★</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500">
                          Contests
                        </label>
                        <input
                          type="number"
                          value={
                            formData.platformAchievements.codechef
                              .contestParticipated || 0
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                codechef: {
                                  ...formData.platformAchievements.codechef,
                                  contestParticipated: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Codeforces */}
                  <div className="bg-slate-950/45 p-2.5 rounded-lg border border-white/5 space-y-1.5">
                    <span className="text-[9px] font-bold text-cyan-400 tracking-wider block">
                      CODEFORCES STATS
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-500">
                          Rating
                        </label>
                        <input
                          type="number"
                          value={
                            formData.platformAchievements.codeforces.rating || 0
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                codeforces: {
                                  ...formData.platformAchievements.codeforces,
                                  rating: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500">
                          Rank Badge
                        </label>
                        <select
                          value={
                            formData.platformAchievements.codeforces.rank ||
                            "Newbie"
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                codeforces: {
                                  ...formData.platformAchievements.codeforces,
                                  rank: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white outline-none cursor-pointer"
                        >
                          <option value="Newbie">Newbie</option>
                          <option value="Pupil">Pupil</option>
                          <option value="Specialist">Specialist</option>
                          <option value="Expert">Expert</option>
                          <option value="Candidate Master">
                            Candidate Master
                          </option>
                          <option value="Master">Master</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500">
                          Contests
                        </label>
                        <input
                          type="number"
                          value={
                            formData.platformAchievements.codeforces
                              .contestParticipated || 0
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                codeforces: {
                                  ...formData.platformAchievements.codeforces,
                                  contestParticipated: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hackerrank */}
                  <div className="bg-slate-950/45 p-2.5 rounded-lg border border-white/5 space-y-1.5">
                    <span className="text-[9px] font-bold text-emerald-400 tracking-wider block">
                      HACKERRANK STARS
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      <div>
                        <label className="text-[8px] text-slate-500">
                          Problem
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="6"
                          value={
                            formData.platformAchievements.hackerrank
                              .problemSolvingBadge || 0
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                hackerrank: {
                                  ...formData.platformAchievements.hackerrank,
                                  problemSolvingBadge: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] text-slate-500">
                          Java
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="6"
                          value={
                            formData.platformAchievements.hackerrank
                              .javaBadge || 0
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                hackerrank: {
                                  ...formData.platformAchievements.hackerrank,
                                  javaBadge: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] text-slate-500">SQL</label>
                        <input
                          type="number"
                          min="0"
                          max="6"
                          value={
                            formData.platformAchievements.hackerrank.sqlBadge ||
                            0
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                hackerrank: {
                                  ...formData.platformAchievements.hackerrank,
                                  sqlBadge: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] text-slate-500">
                          Contest
                        </label>
                        <input
                          type="number"
                          value={
                            formData.platformAchievements.hackerrank
                              .contestParticipated || 0
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              platformAchievements: {
                                ...formData.platformAchievements,
                                hackerrank: {
                                  ...formData.platformAchievements.hackerrank,
                                  contestParticipated: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/5 rounded p-1 mt-0.5 text-white text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SAVE / CANCEL BUTTONS */}
              <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                <Button
                  type="button"
                  onClick={() => setShowAchievementModal(false)}
                  className="bg-slate-950 text-slate-400 hover:text-white border border-white/5 cursor-pointer rounded-xl font-bold py-2 px-4 text-xs transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer rounded-xl font-bold py-2 px-4 text-xs transition-colors shadow-lg shadow-indigo-600/10"
                >
                  {saving ? "Saving..." : "Save Updates"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT PROBLEM */}
      {showProblemModal && currentProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 relative animate-fade-in shadow-2xl">
            <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">
              {currentProblem._id
                ? "Edit Problem Entry"
                : "Log New DSA Problem"}
            </h2>

            <form
              onSubmit={handleSaveProblem}
              className="space-y-4 text-xs text-slate-300"
            >
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Problem Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2Sum, Longest Path in Graph..."
                  value={currentProblem.name || ""}
                  onChange={(e) =>
                    setCurrentProblem({
                      ...currentProblem,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-white/5 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    DSA Topic *
                  </label>
                  <select
                    value={currentProblem.topic}
                    onChange={(e) =>
                      setCurrentProblem({
                        ...currentProblem,
                        topic: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-white/5 rounded-lg p-2.5 text-white outline-none cursor-pointer"
                  >
                    {DSA_TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={currentProblem.difficulty}
                    onChange={(e) =>
                      setCurrentProblem({
                        ...currentProblem,
                        difficulty: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-white/5 rounded-lg p-2.5 text-white outline-none cursor-pointer"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Platform *
                  </label>
                  <select
                    value={currentProblem.platform}
                    onChange={(e) =>
                      setCurrentProblem({
                        ...currentProblem,
                        platform: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-white/5 rounded-lg p-2.5 text-white outline-none cursor-pointer"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Solved Status
                  </label>
                  <select
                    value={currentProblem.solvedStatus}
                    onChange={(e) =>
                      setCurrentProblem({
                        ...currentProblem,
                        solvedStatus: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-white/5 rounded-lg p-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="Solved">Solved</option>
                    <option value="Attempted">Attempted</option>
                    <option value="Todo">Todo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Problem URL
                </label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={currentProblem.url || ""}
                  onChange={(e) =>
                    setCurrentProblem({
                      ...currentProblem,
                      url: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-white/5 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="revision"
                    checked={currentProblem.revisionNeeded || false}
                    onChange={(e) =>
                      setCurrentProblem({
                        ...currentProblem,
                        revisionNeeded: e.target.checked,
                      })
                    }
                    className="h-4 w-4 bg-slate-950 border-white/5 border rounded outline-none accent-indigo-500 cursor-pointer"
                  />

                  <label
                    htmlFor="revision"
                    className="text-slate-300 font-bold cursor-pointer select-none"
                  >
                    Revision Needed?
                  </label>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-0.5">
                    Date Solved
                  </label>
                  <input
                    type="date"
                    value={currentProblem.solvedAt || ""}
                    onChange={(e) =>
                      setCurrentProblem({
                        ...currentProblem,
                        solvedAt: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-white/5 rounded-lg p-2 text-white outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* SAVE / CANCEL BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button
                  type="button"
                  onClick={() => setShowProblemModal(false)}
                  className="bg-slate-950 text-slate-400 hover:text-white border border-white/5 cursor-pointer rounded-xl font-bold py-2 px-4 text-xs transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer rounded-xl font-bold py-2 px-4 text-xs transition-colors shadow-lg shadow-indigo-600/10"
                >
                  {saving
                    ? "Saving..."
                    : currentProblem._id
                      ? "Save Changes"
                      : "Add Entry"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
