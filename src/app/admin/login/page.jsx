"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // 1. Authenticate with NextAuth provider
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        throw new Error(res.error || "Invalid credentials");
      }

      // 2. Fetch the newly active session to verify admin privileges
      const session = await getSession();
      if (!session || !session.user || session.user.role !== "admin") {
        // Sign out immediately to clear cookies
        await signOut({ redirect: false });
        throw new Error(
          "Access denied. This workspace is reserved for administrator accounts only.",
        );
      }

      setSuccess("Access granted. Redirecting to control panel...");
      // Delay slightly for visual feedback
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(
        err.message || "Authentication failed. Please check credentials.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-radial from-slate-950 via-slate-950 to-black relative">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/5 blur-3xl -z-10 pointer-events-none" />

      <Card className="w-full max-w-md border border-red-500/10 bg-slate-950/40 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Top Restricted Alert Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-red-500" />

        <CardHeader className="space-y-1.5 flex flex-col items-center pt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg mb-2 border border-white/10">
            <ShieldCheck className="h-6 w-6 text-indigo-300" />
          </div>
          <CardTitle className="text-2xl font-black text-center bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent uppercase tracking-wider">
            Admin Workspace
          </CardTitle>
          <CardDescription className="text-slate-400 text-center text-xs font-semibold max-w-[280px]">
            Restricted access. Only authorized administrators may proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Access Warning Banner */}
          <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 flex gap-2.5 text-[11px] text-red-400 leading-normal">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
            <span>
              This computer system is for authorized users only. Unauthorized
              login attempts are strictly prohibited and subject to auditing.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs font-bold text-red-400 leading-normal">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-widest text-slate-400 font-bold"
              >
                Admin Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@skillbridge.edu"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-slate-950/60 border-white/5 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs uppercase tracking-widest text-slate-400 font-bold"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                className="bg-slate-950/60 border-white/5 focus-visible:ring-indigo-500"
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full mt-2 cursor-pointer font-bold uppercase tracking-wider text-xs py-5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
              disabled={loading || !!success}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Verifying Credentials...
                </>
              ) : (
                "Access Control Panel"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-white/5 py-4 bg-slate-950/20 font-medium">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Secured campus administrator gateway
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-radial from-slate-950 via-slate-950 to-black">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
