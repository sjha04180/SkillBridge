'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
} from 'lucide-react';

const TARGET_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Engineer',
  'Data Analyst',
];

interface ProfileData {
  name: string;
  email: string;
  college: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  skills: string[];
  certifications: string[];
  targetRole: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    college: '',
    branch: '',
    graduationYear: new Date().getFullYear(),
    cgpa: 0,
    skills: [],
    certifications: [],
    targetRole: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Local helper states for adding tags
  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) {
          throw new Error('Failed to load profile');
        }
        const data = await res.json();
        setProfile({
          name: data.name || '',
          email: data.email || '',
          college: data.college || '',
          branch: data.branch || '',
          graduationYear: data.graduationYear || new Date().getFullYear(),
          cgpa: data.cgpa || 0,
          skills: data.skills || [],
          certifications: data.certifications || [],
          targetRole: data.targetRole || '',
        });
      } catch (err: any) {
        setErrorMsg(err.message || 'Error loading profile data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === 'graduationYear' || name === 'cgpa' ? Number(value) : value,
    }));
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = skillInput.trim();
    if (cleanInput && !profile.skills.some((s) => s.toLowerCase() === cleanInput.toLowerCase())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, cleanInput],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (indexToRemove: number) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const addCertification = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = certInput.trim();
    if (cleanInput && !profile.certifications.some((c) => c.toLowerCase() === cleanInput.toLowerCase())) {
      setProfile((prev) => ({
        ...prev,
        certifications: [...prev.certifications, cleanInput],
      }));
      setCertInput('');
    }
  };

  const removeCertification = (indexToRemove: number) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validation
    if (!profile.name.trim()) return setErrorMsg('Name is required');
    if (!profile.college.trim()) return setErrorMsg('College name is required');
    if (!profile.branch.trim()) return setErrorMsg('Branch name is required');
    if (profile.cgpa < 0 || profile.cgpa > 10) return setErrorMsg('CGPA must be between 0 and 10');
    if (profile.graduationYear < 1980 || profile.graduationYear > 2040) {
      return setErrorMsg('Please enter a valid graduation year');
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      setSuccessMsg('Profile updated successfully!');
      router.refresh(); // refresh server side caches
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating profile');
    } finally {
      setIsSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-6">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading your profile details...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />

      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            My Professional Profile
          </h1>
          <p className="text-slate-400 mt-1">
            Keep your details up to date to matching target roles and unlock customized learning roadmaps.
          </p>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 animate-pulse">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Card 1: Personal Details */}
          <Card className="border border-border/10 bg-slate-900/40 shadow-xl backdrop-blur-md">
            <CardHeader className="border-b border-border/5">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-400" />
                Personal Details
              </CardTitle>
              <CardDescription className="text-slate-400">Your basic contact information.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Name</Label>
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
                <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Email Address</Label>
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
                <p className="text-[10px] text-slate-500 italic">Email is tied to your account credentials and cannot be edited.</p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Academic Details */}
          <Card className="border border-border/10 bg-slate-900/40 shadow-xl backdrop-blur-md">
            <CardHeader className="border-b border-border/5">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-400" />
                Academic Details
              </CardTitle>
              <CardDescription className="text-slate-400">Current degree, college, and scoring.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="college" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">College/University</Label>
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
                <Label htmlFor="branch" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Branch/Discipline</Label>
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
                  <Label htmlFor="graduationYear" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Grad Year</Label>
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
                  <Label htmlFor="cgpa" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">CGPA (Out of 10)</Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="cgpa"
                      name="cgpa"
                      type="number"
                      step="0.01"
                      value={profile.cgpa || ''}
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
          <Card className="border border-border/10 bg-slate-900/40 shadow-xl backdrop-blur-md">
            <CardHeader className="border-b border-border/5">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-400" />
                Career Target & Skills
              </CardTitle>
              <CardDescription className="text-slate-400">Specify your career alignment and set tags.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Target Role Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="targetRole" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Target Job Role</Label>
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
                <Label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Professional Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(e))}
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
                  <p className="text-xs text-slate-500 italic">No skills added yet.</p>
                )}
              </div>

              {/* Tag Input for Certifications */}
              <div className="space-y-3">
                <Label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Certifications</Label>
                <div className="flex gap-2">
                  <Input
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification(e))}
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
                  <p className="text-xs text-slate-500 italic">No certifications listed yet.</p>
                )}
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
                'Save Career Profile'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
