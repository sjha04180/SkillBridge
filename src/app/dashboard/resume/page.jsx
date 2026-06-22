"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyResumeChecklistPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/dashboard/resume-analyzer");
  }, [router]);

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 flex items-center justify-center min-h-[calc(100vh-4rem)] text-slate-400">
      Redirecting to AI Resume Analyzer...
    </div>
  );
}
