"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users,
  Calendar,
  Award,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const HACKATHONS = [
  {
    id: "sih-2026",
    name: "Smart India Hackathon (SIH) 2026",
    organizer: "Ministry of Education, Govt of India",
    description:
      "The world's largest open innovation hackathon. Solve real-world problem statements submitted by central/state ministries and departments.",
    prizePool: "₹1,00,000 per problem + startup funding support",
    timeline: "Sept 15 – Dec 18, 2026",
    tags: ["Software", "Hardware", "Open Innovation", "Web Dev", "AI/ML"],
    url: "https://sih.gov.in",
    status: "Upcoming",
  },
  {
    id: "google-hashcode-2026",
    name: "Google Hash Code 2026",
    organizer: "Google",
    description:
      "Google's signature team-based coding competition. Work in groups of 2 to 4 to solve a complex optimization problem designed by Google engineers.",
    prizePool: "Google goodies, global rankings & direct recruiter screening",
    timeline: "Oct 12, 2026",
    tags: ["Algorithms", "Coding", "Optimization", "Python", "C++"],
    url: "https://codingcompetitions.withgoogle.com",
    status: "Upcoming",
  },
  {
    id: "imagine-cup-2026",
    name: "Microsoft Imagine Cup 2026",
    organizer: "Microsoft",
    description:
      "The premier global student technology startup competition. Build a tech solution leveraging Microsoft Cloud/Azure solving key social problems.",
    prizePool: "$100,000 Cash + mentoring with Microsoft CEO",
    timeline: "Dec 1, 2026 – Feb 25, 2027",
    tags: ["AI/ML", "Cloud Architect", "SaaS", "Azure", "Social Good"],
    url: "https://imaginecup.microsoft.com",
    status: "Open",
  },
  {
    id: "tata-imagination-2026",
    name: "Tata Imagination Challenge 2026",
    organizer: "Tata Group",
    description:
      "National campus hackathon covering entrepreneurial thinking and design cases. Pitch innovative solutions to Tata executives.",
    prizePool: "₹2,00,000 per winner + Direct interview (PPI) with Tata Group",
    timeline: "Oct 20 – Nov 18, 2026",
    tags: ["Business Case", "Design Thinking", "Innovation", "Management"],
    url: "https://www.tata.com/careers/imagination-challenge",
    status: "Upcoming",
  },
  {
    id: "devpost-ai-2026",
    name: "Devpost Global AI Hackathon",
    organizer: "Devpost & Partners",
    description:
      "Create open-source generative AI tools, chatbots, or workflow engines using modern large language models, agents, and vector databases.",
    prizePool: "$50,000 Cash + API compute credits",
    timeline: "Aug 5 – Aug 25, 2026",
    tags: ["Generative AI", "LLMs", "Web Dev", "Python", "Vector DB"],
    url: "https://devpost.com",
    status: "Open",
  },
];


export default function HackathonsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  // Teammate Finder state
  const [teammatePosts, setTeammatePosts] = useState([]);
  const [isTeammateLoading, setIsTeammateLoading] = useState(false);
  const [showTeammateModal, setShowTeammateModal] = useState(false);
  const [postHackathon, setPostHackathon] = useState("");
  const [postMessage, setPostMessage] = useState("");
  const [postNeeds, setPostNeeds] = useState("");
  const [isPostingTeammate, setIsPostingTeammate] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setRegisteredIds(data.registeredHackathons || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeammates = async () => {
    try {
      setIsTeammateLoading(true);
      const res = await fetch("/api/hackathons/teammates");
      if (res.ok) {
        const data = await res.json();
        setTeammatePosts(data.posts || []);
      }
    } catch (err) {
      console.error("Failed to fetch teammate posts:", err);
    } finally {
      setIsTeammateLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfile();
      fetchTeammates();
    }
  }, [status]);

  const handlePostTeammate = async (e) => {
    e.preventDefault();
    if (!postHackathon || !postMessage.trim()) return;

    setIsPostingTeammate(true);
    try {
      const needsArray = postNeeds
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      const res = await fetch("/api/hackathons/teammates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hackathon: postHackathon,
          message: postMessage.trim(),
          needs: needsArray,
        }),
      });

      if (res.ok) {
        setShowTeammateModal(false);
        setPostMessage("");
        setPostNeeds("");
        fetchTeammates();
      }
    } catch (err) {
      console.error("Failed to post teammate requirement:", err);
    } finally {
      setIsPostingTeammate(false);
    }
  };

  const handleDeleteTeammate = async (postId) => {
    if (!confirm("Are you sure you want to remove your teammate request?")) return;
    try {
      const res = await fetch(`/api/hackathons/teammates?id=${postId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchTeammates();
      }
    } catch (err) {
      console.error("Failed to delete teammate post:", err);
    }
  };

  const handleToggleRegister = async (hackathonId) => {
    if (!profile) return;
    setSaving(hackathonId);

    const isRegistered = registeredIds.includes(hackathonId);
    const updatedIds = isRegistered
      ? registeredIds.filter((id) => id !== hackathonId)
      : [...registeredIds, hackathonId];

    // Optimistic UI
    setRegisteredIds(updatedIds);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          registeredHackathons: updatedIds,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update registrations");
      }
    } catch (err) {
      console.error(err);
      // rollback
      setRegisteredIds(registeredIds);
    } finally {
      setSaving(null);
    }
  };

  // Compile tags
  const allTags = [
    "All",
    ...Array.from(new Set(HACKATHONS.flatMap((h) => h.tags))),
  ];

  // Filtering Logic
  const filteredHackathons = HACKATHONS.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = filterTag === "All" || h.tags.includes(filterTag);
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Registered" && registeredIds.includes(h.id)) ||
      (filterStatus !== "Registered" && h.status === filterStatus);
    return matchesSearch && matchesTag && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex-1 bg-slate-950 p-6 md:p-12 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase animate-pulse">
            Configuring Hackathons Hub...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 p-4 md:p-8 relative overflow-hidden animate-slide-up">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER BAR */}
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 backdrop-blur-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
              <Trophy className="h-8 w-8 text-indigo-400 animate-bounce" />
              Hackathons Directory
            </h1>
            <p className="text-slate-400 text-xs font-semibold">
              Find upcoming national coding contests, register interest, and
              find teammates.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-white/5 self-start md:self-auto">
            <div className="text-center px-3 border-r border-white/5">
              <span className="text-[9px] text-slate-500 block font-bold uppercase">
                Total Listings
              </span>
              <span className="text-lg font-black text-white">
                {HACKATHONS.length}
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-[9px] text-indigo-400 block font-bold uppercase">
                My Registrations
              </span>
              <span className="text-lg font-black text-indigo-400">
                {registeredIds.length}
              </span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/20 p-4 rounded-2xl border border-white/5">
          {/* Search bar */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search hackathons by name or host..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* Tag Filter */}
          <div className="flex items-center gap-2 bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="bg-transparent text-slate-300 outline-none w-full border-none cursor-pointer font-medium"
            >
              {allTags.map((tag) => (
                <option key={tag} value={tag} className="bg-slate-900">
                  {tag === "All" ? "All Focus Areas" : tag}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-xs">
            <Trophy className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-slate-300 outline-none w-full border-none cursor-pointer font-medium"
            >
              <option value="All" className="bg-slate-900">
                All Timelines
              </option>
              <option value="Open" className="bg-slate-900">
                Registration Open
              </option>
              <option value="Upcoming" className="bg-slate-900">
                Upcoming Contests
              </option>
              <option value="Registered" className="bg-slate-900">
                My Registered Hackathons
              </option>
            </select>
          </div>
        </div>

        {/* HACKATHON DIRECTORY CARDS GRID & SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* HACKATHON LIST (LEFT 2 COLS) */}
          <div className="lg:col-span-2 space-y-4">
            {filteredHackathons.length > 0 ? (
              filteredHackathons.map((h) => {
                const isRegistered = registeredIds.includes(h.id);
                return (
                  <div
                    key={h.id}
                    className="bg-slate-900/30 border border-white/5 hover:border-indigo-500/20 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 transition-all hover:scale-[1.005] relative overflow-hidden group"
                  >
                    {/* Glowing status border top corner */}
                    <div
                      className={`absolute top-0 right-0 h-1.5 w-24 rounded-bl-lg ${
                        h.status === "Open" ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />

                    <div className="space-y-3 flex-1">
                      <div className="space-y-1">
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-950 text-indigo-400 border border-white/5">
                          {h.organizer}
                        </span>
                        <h3 className="text-base font-extrabold text-white group-hover:text-indigo-400 transition-colors">
                          {h.name}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                        {h.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{h.prizePool}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="h-4 w-4 text-slate-600" />
                          <span>{h.timeline}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {h.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-500 border border-white/5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-end gap-3 self-start md:self-center shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                      <Button
                        onClick={() => handleToggleRegister(h.id)}
                        disabled={saving === h.id}
                        className={`text-xs font-bold py-2 px-4 rounded-xl cursor-pointer transition-all w-full md:w-44 flex items-center justify-center gap-1 ${
                          isRegistered
                            ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15"
                        }`}
                      >
                        {saving === h.id ? (
                          "Updating..."
                        ) : isRegistered ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Registered
                          </>
                        ) : (
                          "Mark as Registered"
                        )}
                      </Button>

                      <a
                        href={h.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full md:w-auto"
                      >
                        <Button className="bg-slate-950 text-slate-400 hover:text-white border border-white/5 hover:border-slate-800 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer w-full md:w-44 flex items-center justify-center gap-1">
                          Visit Site <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-slate-900/10 border border-dashed border-white/5 p-12 text-center rounded-2xl">
                <AlertCircle className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-xs italic">
                  No hackathons match the selected filters.
                </p>
              </div>
            )}
          </div>

          {/* TEAM FINDER DIRECTORY (RIGHT 1 COL) */}
          <div className="space-y-6">
            {/* Team Finder Widget */}
            <div className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl space-y-4 backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-white/5 flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-400" />
                Class Team Recruitment
              </h3>

              <p className="text-[10px] text-slate-500 leading-relaxed">
                Connect with classmates looking to form teams and register for
                upcoming coding events.
              </p>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {isTeammateLoading ? (
                  <div className="space-y-2">
                    <div className="h-20 bg-slate-950/60 rounded-xl animate-pulse" />
                    <div className="h-20 bg-slate-950/60 rounded-xl animate-pulse" />
                  </div>
                ) : teammatePosts.length > 0 ? (
                  teammatePosts.map((post) => {
                    const isOwner = session?.user?.id === post.userId;
                    return (
                      <div
                        key={post._id}
                        className="bg-slate-950/70 border border-white/5 p-4.5 rounded-xl space-y-2 relative"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="overflow-hidden">
                            <span className="text-xs font-bold text-white block truncate">
                              {post.name}
                            </span>
                            <span className="text-[8px] text-slate-500 font-semibold block truncate">
                              {post.college} • {post.branch}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-extrabold truncate max-w-20 uppercase">
                              {post.hackathon.split(" ")[0]}
                            </span>
                            {isOwner && (
                              <button
                                onClick={() => handleDeleteTeammate(post._id)}
                                className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                                title="Remove Post"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed italic break-words">
                          &ldquo;{post.message}&rdquo;
                        </p>

                        {/* Tech stack requested */}
                        {post.needs && post.needs.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1.5 border-t border-white/2">
                            {post.needs.map((n) => (
                              <span
                                key={n}
                                className="text-[8px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/5 font-extrabold uppercase"
                              >
                                {n}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[10px] text-slate-600 text-center italic py-4">
                    No active teammate recruitments.
                  </p>
                )}
              </div>

              {/* Add a team request help */}
              <div className="pt-2">
                <Button
                  onClick={() => {
                    setPostHackathon(HACKATHONS[0].name);
                    setShowTeammateModal(true);
                  }}
                  className="w-full bg-slate-950 text-indigo-400 border border-indigo-500/10 hover:bg-slate-900 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-1"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Post Team Recruitment
                </Button>
              </div>
            </div>

            {/* Hackathon guide */}
            <div className="bg-indigo-950/10 border border-indigo-500/5 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                <Sparkles className="h-4 w-4" />
                <span>Why participate?</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Hackathons contribute directly to your **Placement Readiness
                Score**. Solving problem statements yields points under
                "Technical Projects" and highlights your ability to build
                functional code prototypes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 3: POST TEAM RECRUITMENT */}
      {showTeammateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-5 space-y-4 relative animate-fade-in shadow-2xl">
            <h2 className="text-base font-bold text-white border-b border-white/5 pb-2">
              Post Team Recruitment
            </h2>

            <form
              onSubmit={handlePostTeammate}
              className="space-y-4 text-xs text-slate-300"
            >
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Target Hackathon *
                </label>
                <select
                  value={postHackathon}
                  onChange={(e) => setPostHackathon(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-lg p-2.5 text-white outline-none cursor-pointer"
                >
                  {HACKATHONS.map((h) => (
                    <option key={h.id} value={h.name}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Requested Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Python, Figma"
                  value={postNeeds}
                  onChange={(e) => setPostNeeds(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Recruitment Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your project idea and what kind of teammate you are looking for..."
                  value={postMessage}
                  onChange={(e) => setPostMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500/50 resize-none"
                />
              </div>

              {/* SAVE / CANCEL BUTTONS */}
              <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                <Button
                  type="button"
                  onClick={() => setShowTeammateModal(false)}
                  className="bg-slate-950 text-slate-400 hover:text-white border border-white/5 cursor-pointer rounded-xl font-bold py-2 px-4 text-xs transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPostingTeammate}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer rounded-xl font-bold py-2 px-4 text-xs transition-colors shadow-lg shadow-indigo-600/10"
                >
                  {isPostingTeammate ? "Posting..." : "Post Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
