import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Profile from '@/models/Profile';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    const {
      name,
      college,
      branch,
      cgpa,
      githubUrl,
      linkedinUrl,
      skills,
      certifications,
      projects
    } = body;

    await dbConnect();

    // 1. Update User Collection
    const userUpdate = {};
    if (name) userUpdate.name = name;
    if (college) userUpdate.college = college;
    if (branch) userUpdate.branch = branch;

    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(userId, { $set: userUpdate });
    }

    // 2. Update Profile Collection
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
    }

    if (cgpa) profile.cgpa = cgpa;
    if (githubUrl) profile.githubUrl = githubUrl;
    if (linkedinUrl) profile.linkedinUrl = linkedinUrl;

    // Merge Skills
    if (Array.isArray(skills) && skills.length > 0) {
      const currentSkillsLower = (profile.skills || []).map(s => s.toLowerCase().trim());
      const skillsToMerge = skills.filter(s => !currentSkillsLower.includes(s.toLowerCase().trim()));
      if (skillsToMerge.length > 0) {
        profile.skills = [...(profile.skills || []), ...skillsToMerge];
      }
    }

    // Merge Certifications
    if (Array.isArray(certifications) && certifications.length > 0) {
      const currentCertsLower = (profile.certifications || []).map(c => c.toLowerCase().trim());
      const certsToMerge = certifications.filter(c => !currentCertsLower.includes(c.toLowerCase().trim()));
      if (certsToMerge.length > 0) {
        profile.certifications = [...(profile.certifications || []), ...certsToMerge];
      }
    }

    // Merge Projects
    if (Array.isArray(projects) && projects.length > 0) {
      const currentProjectTitles = (profile.projects || []).map(p => p.title.toLowerCase().trim());
      const projectsToMerge = projects.filter(p => p.title && !currentProjectTitles.includes(p.title.toLowerCase().trim()));
      if (projectsToMerge.length > 0) {
        const mergedProjects = projectsToMerge.map(p => ({
          title: p.title,
          description: p.description || '',
          technologies: p.technologies || []
        }));
        profile.projects = [...(profile.projects || []), ...mergedProjects];
      }
    }

    await profile.save();

    return NextResponse.json({ message: 'Profile synced successfully.' });
  } catch (error) {
    console.error('Error syncing profile:', error);
    return NextResponse.json({ error: 'Failed to sync profile data' }, { status: 500 });
  }
}
