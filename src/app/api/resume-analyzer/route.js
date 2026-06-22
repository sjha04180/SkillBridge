import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Profile from '@/models/Profile';
import ResumeAnalysis from '@/models/ResumeAnalysis';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

const ROLE_SKILLS = {
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git", "TypeScript"],
  "Backend Developer": ["Node.js", "Express", "MongoDB", "SQL", "DBMS", "Docker", "Git"],
  "Full Stack Developer": ["React", "Node.js", "MongoDB", "DBMS", "SQL", "Git", "Tailwind CSS"],
  "Software Engineer": ["Data Structures", "Algorithms", "DBMS", "Java", "Python", "System Design", "Git"],
  "Data Analyst": ["Python", "SQL", "Excel", "Tableau", "Statistics", "Pandas", "Git"],
  "Machine Learning Engineer": ["Python", "Machine Learning", "Deep Learning", "SQL", "Statistics", "Git"],
  "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "Linux", "AWS", "Git", "Shell Scripting"],
  "Cloud Architect": ["AWS", "Cloud Computing", "System Design", "Networking", "Security", "Git"],
  "Cybersecurity Analyst": ["Networking", "Linux", "Security", "Python", "Cryptography", "Penetration Testing"],
  "Mobile Developer": ["React Native", "Swift", "Kotlin", "JavaScript", "Git"],
};

const SKILL_MAP = {
  'html': 'HTML',
  'css': 'CSS',
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'react': 'React',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'vue': 'Vue.js',
  'angular': 'Angular',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'express': 'Express',
  'expressjs': 'Express',
  'mongodb': 'MongoDB',
  'mongoose': 'Mongoose',
  'sql': 'SQL',
  'mysql': 'MySQL',
  'postgresql': 'PostgreSQL',
  'sqlite': 'SQLite',
  'dbms': 'DBMS',
  'rdbms': 'RDBMS',
  'java': 'Java',
  'python': 'Python',
  'c++': 'C++',
  'cpp': 'C++',
  'c#': 'C#',
  'ruby': 'Ruby',
  'rails': 'Ruby on Rails',
  'php': 'PHP',
  'laravel': 'Laravel',
  'git': 'Git',
  'github': 'GitHub',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'aws': 'AWS',
  'gcp': 'GCP',
  'azure': 'Azure',
  'cloud': 'Cloud Computing',
  'devops': 'DevOps',
  'ci/cd': 'CI/CD',
  'linux': 'Linux',
  'shell scripting': 'Shell Scripting',
  'bash': 'Bash',
  'c': 'C',
  'rust': 'Rust',
  'go': 'Go',
  'golang': 'Go',
  'machine learning': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'statistics': 'Statistics',
  'tableau': 'Tableau',
  'excel': 'Excel',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scikit-learn': 'Scikit-Learn',
  'tensorflow': 'TensorFlow',
  'keras': 'Keras',
  'pytorch': 'PyTorch',
  'networking': 'Networking',
  'security': 'Security',
  'cryptography': 'Cryptography',
  'penetration testing': 'Penetration Testing',
  'cybersecurity': 'Cybersecurity',
  'react native': 'React Native',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'flutter': 'Flutter',
  'dart': 'Dart',
  'algorithms': 'Algorithms',
  'data structures': 'Data Structures',
  'dsa': 'Data Structures & Algorithms',
  'oop': 'OOP',
  'system design': 'System Design'
};

// Section extraction helper
function extractSections(text) {
  const lines = text.split('\n');
  const sections = {
    contact: [],
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: [],
    achievements: []
  };

  let currentSection = 'contact';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const lower = trimmed.toLowerCase();
    
    if (lower.match(/^(education|academic background|academics|qualifications|academic details)/i)) {
      currentSection = 'education';
      continue;
    } else if (lower.match(/^(technical skills|skills|core competencies|expertise|skills & tools|technologies)/i)) {
      currentSection = 'skills';
      continue;
    } else if (lower.match(/^(projects|academic projects|personal projects|key projects|technical projects)/i)) {
      currentSection = 'projects';
      continue;
    } else if (lower.match(/^(experience|work experience|professional experience|employment|internships|work history|career history)/i)) {
      currentSection = 'experience';
      continue;
    } else if (lower.match(/^(certifications|licenses|certifications & courses|credentials|courses)/i)) {
      currentSection = 'certifications';
      continue;
    } else if (lower.match(/^(achievements|awards|co-curricular achievements|honors|extracurricular)/i)) {
      currentSection = 'achievements';
      continue;
    }

    sections[currentSection].push(trimmed);
  }

  return sections;
}

// Phone number clean regex helper
const PHONE_REGEX = /\+?\d[\d\-\(\)\s]{7,15}\d/;

// Parse Contact details helper
function parseContactDetails(text, userDoc) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-\u00C0-\u00FF]+/i;
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_\-]+/i;

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(PHONE_REGEX);
  const linkedinMatch = text.match(linkedinRegex);
  const githubMatch = text.match(githubRegex);

  // Extract Name from first 5 non-empty lines
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let parsedName = '';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (
      !line.includes('@') &&
      !line.match(PHONE_REGEX) &&
      !line.toLowerCase().includes('github') &&
      !line.toLowerCase().includes('linkedin') &&
      !line.toLowerCase().includes('resume') &&
      line.length > 2 &&
      line.length < 35 &&
      /^[a-zA-Z\s]+$/.test(line)
    ) {
      parsedName = line;
      break;
    }
  }

  return {
    name: parsedName || userDoc.name || '',
    email: emailMatch ? emailMatch[0] : (userDoc.email || ''),
    phone: phoneMatch ? phoneMatch[0] : '',
    linkedin: linkedinMatch ? linkedinMatch[0] : '',
    github: githubMatch ? githubMatch[0] : ''
  };
}

// Parse Skills helper
function parseSkills(text) {
  const detectedSkills = [];
  for (const skillKey in SKILL_MAP) {
    const escaped = skillKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let regex;
    if (skillKey.includes('+') || skillKey.includes('.') || skillKey.includes('#')) {
      regex = new RegExp(escaped, 'i');
    } else {
      regex = new RegExp('\\b' + escaped + '\\b', 'i');
    }
    
    if (regex.test(text)) {
      const skillName = SKILL_MAP[skillKey];
      if (!detectedSkills.includes(skillName)) {
        detectedSkills.push(skillName);
      }
    }
  }
  return detectedSkills;
}

// Parse Projects helper
function parseProjects(projectLines, rawText) {
  const githubUrls = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)/g) || [];
  const projects = [];
  
  if (projectLines.length === 0) {
    const uniqueRepos = [...new Set(githubUrls)];
    uniqueRepos.forEach((repo, idx) => {
      const parts = repo.split('/');
      const title = parts[parts.length - 1] || `Project ${idx + 1}`;
      projects.push({
        title: title.replace(/[-_]/g, ' '),
        description: `Source repository code for ${title}.`,
        technologies: [],
        githubLink: repo,
        liveLink: ''
      });
    });
    
    // Look for generic project descriptions in raw text if none found
    if (projects.length === 0) {
      const lines = rawText.split('\n');
      let pCount = 1;
      for (const line of lines) {
        if (line.match(/(developed|built|designed|implemented)\s+a?\s*([a-zA-Z0-9_\-\s]{3,30})/i) && line.length > 20) {
          projects.push({
            title: `Project ${pCount++}`,
            description: line.trim(),
            technologies: [],
            githubLink: '',
            liveLink: ''
          });
          if (pCount > 3) break;
        }
      }
    }
    return projects;
  }

  let currentProject = null;
  
  for (let i = 0; i < projectLines.length; i++) {
    const line = projectLines[i].trim();
    if (!line) continue;
    
    const isTitle = line.length > 3 && line.length < 50 && !line.startsWith('-') && !line.startsWith('•') && !line.startsWith('*') && (currentProject === null || line.match(/^(?:project|built|designed|developed|e-commerce|portfolio|tracker|api|system|app|web)/i) || i === 0);
    
    if (isTitle) {
      if (currentProject) {
        projects.push(currentProject);
      }
      
      const githubMatch = line.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_\-\/]+/i);
      
      currentProject = {
        title: line.replace(/[:|()\-+]/g, ' ').trim(),
        description: '',
        technologies: [],
        githubLink: githubMatch ? githubMatch[0] : '',
        liveLink: ''
      };
    } else {
      if (currentProject) {
        currentProject.description += (currentProject.description ? ' ' : '') + line;
        
        const githubMatch = line.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_\-\/]+/i);
        if (githubMatch && !currentProject.githubLink) {
          currentProject.githubLink = githubMatch[0];
        }
        
        const liveMatch = line.match(/(?:https?:\/\/)?(?:www\.)?(?!github|linkedin)[a-zA-Z0-9_\-]+\.[a-zA-Z]{2,}(?:\/[a-zA-Z0-9_\-\?=&]+)*/i);
        if (liveMatch && !currentProject.liveLink) {
          currentProject.liveLink = liveMatch[0];
        }
        
        for (const skillKey in SKILL_MAP) {
          const escaped = skillKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp('\\b' + escaped + '\\b', 'i');
          if (regex.test(line)) {
            const tech = SKILL_MAP[skillKey];
            if (!currentProject.technologies.includes(tech)) {
              currentProject.technologies.push(tech);
            }
          }
        }
      } else {
        currentProject = {
          title: 'Project 1',
          description: line,
          technologies: [],
          githubLink: '',
          liveLink: ''
        };
      }
    }
  }
  
  if (currentProject) {
    projects.push(currentProject);
  }
  
  projects.forEach(p => {
    p.description = p.description.replace(/^[\s-•*]+/g, '').trim();
  });
  
  return projects;
}

// Parse Certifications helper
function parseCertifications(certLines, rawText) {
  if (certLines.length > 0) {
    return certLines.map(l => l.replace(/^[\s-•*]+/g, '').trim()).filter(l => l.length > 0);
  }
  
  const certs = [];
  const lines = rawText.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/(certified|certification|credential|course|udemy|coursera|google cloud|aws|microsoft)/i) && trimmed.length > 5 && trimmed.length < 100) {
      certs.push(trimmed.replace(/^[\s-•*]+/g, '').trim());
    }
  }
  return certs;
}

// Parse Achievements helper
function parseAchievements(achLines, rawText) {
  if (achLines.length > 0) {
    return achLines.map(l => l.replace(/^[\s-•*]+/g, '').trim()).filter(l => l.length > 0);
  }
  
  const achs = [];
  const lines = rawText.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/(hackathon|contest|ranked|winner|solved|accomplished|first place|second place|secured)/i) && trimmed.length > 5 && trimmed.length < 100) {
      achs.push(trimmed.replace(/^[\s-•*]+/g, '').trim());
    }
  }
  return achs;
}

// API Routes
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    await dbConnect();
    const latestAnalysis = await ResumeAnalysis.findOne({ userId }).select('-fileData');

    return NextResponse.json({ analysis: latestAnalysis });
  } catch (error) {
    console.error('Error fetching resume analysis:', error);
    return NextResponse.json({ error: 'Failed to retrieve resume analysis' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const contentType = req.headers.get('content-type') || '';

    await dbConnect();
    const userDoc = await User.findById(userId);
    const profileDoc = await Profile.findOne({ userId });

    if (!userDoc) {
      return NextResponse.json({ error: 'User session invalid' }, { status: 404 });
    }

    const targetRole = profileDoc?.targetRole || '';

    // Variables for parsing outcomes
    let isManual = false;
    let fileName = '';
    let fileSize = 0;
    let fileType = '';
    let fileData = '';
    let extractedText = '';
    let parsedData = {};
    let sections = { contact: [], education: [], skills: [], projects: [], experience: [], certifications: [], achievements: [] };

    if (contentType.includes('application/json')) {
      isManual = true;
      const body = await req.json();
      const {
        name,
        college,
        branch,
        cgpa,
        skills,
        certifications,
        projects,
        githubUrl,
        linkedinUrl,
        experience
      } = body;

      parsedData = {
        name: name || userDoc.name || '',
        email: userDoc.email || '',
        phone: body.phone || '',
        linkedin: linkedinUrl || '',
        github: githubUrl || '',
        education: [`${college || userDoc.college || 'Engineering College'}, ${branch || userDoc.branch || 'Engineering Branch'}${cgpa ? ` • CGPA: ${cgpa}` : ''}`],
        skills: Array.isArray(skills) ? skills : [],
        projects: Array.isArray(projects) ? projects.map(p => ({
          title: p.title || '',
          description: p.description || '',
          technologies: Array.isArray(p.technologies) ? p.technologies : typeof p.technologies === 'string' ? p.technologies.split(',').map(t => t.trim()) : [],
          githubLink: p.githubLink || '',
          liveLink: p.liveLink || ''
        })) : [],
        certifications: Array.isArray(certifications) ? certifications : [],
        experience: typeof experience === 'string' ? experience.split('\n').filter(Boolean) : Array.isArray(experience) ? experience : [],
        achievements: Array.isArray(body.achievements) ? body.achievements : []
      };

      // Construct dummy text for score evaluations
      extractedText = `
        ${parsedData.name}
        ${parsedData.email}
        ${parsedData.phone}
        GitHub: ${parsedData.github}
        LinkedIn: ${parsedData.linkedin}
        
        EDUCATION
        ${parsedData.education.join('\n')}
        
        SKILLS
        ${parsedData.skills.join(', ')}
        
        PROJECTS
        ${parsedData.projects.map(p => `${p.title}: ${p.description} Tech: ${p.technologies.join(', ')} GitHub: ${p.githubLink} Live: ${p.liveLink}`).join('\n')}
        
        EXPERIENCE
        ${parsedData.experience.join('\n')}
        
        CERTIFICATIONS
        ${parsedData.certifications.join('\n')}
        
        ACHIEVEMENTS
        ${parsedData.achievements.join('\n')}
      `;

      sections = {
        contact: [parsedData.name, parsedData.email, parsedData.phone, parsedData.linkedin, parsedData.github].filter(Boolean),
        education: parsedData.education,
        skills: parsedData.skills,
        projects: parsedData.projects.map(p => p.title),
        experience: parsedData.experience,
        certifications: parsedData.certifications,
        achievements: parsedData.achievements
      };
    } else {
      // Multipart/Form-data File upload processing
      const formData = await req.formData();
      const file = formData.get('file');

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      fileName = file.name;
      fileSize = file.size;
      fileType = file.type;

      const ext = fileName.split('.').pop().toLowerCase();
      if (ext !== 'pdf' && ext !== 'docx') {
        return NextResponse.json({ error: 'Only PDF (.pdf) and Word (.docx) files are allowed.' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      try {
        if (ext === 'pdf') {
          const uint8 = new Uint8Array(buffer);
          const parser = new PDFParse(uint8, { verbosity: 0 });
          await parser.load();
          extractedText = await parser.getText();
        } else {
          const docxResult = await mammoth.extractRawText({ buffer });
          extractedText = docxResult.value;
        }
      } catch (parseError) {
        console.error('Text extraction failed:', parseError);
        extractedText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, '');
        if (extractedText.length < 50) {
          throw new Error('Could not extract text. File might be corrupted or empty.');
        }
      }

      fileData = buffer.toString('base64');
      
      sections = extractSections(extractedText);
      const parsedContact = parseContactDetails(extractedText, userDoc);
      const parsedSkills = parseSkills(extractedText);
      const parsedProjects = parseProjects(sections.projects, extractedText);
      const parsedCerts = parseCertifications(sections.certifications, extractedText);
      const parsedAchs = parseAchievements(sections.achievements, extractedText);
      const parsedExp = sections.experience.length > 0 ? sections.experience : sections.contact.filter(line => line.toLowerCase().includes('experience') || line.toLowerCase().includes('intern'));

      parsedData = {
        name: parsedContact.name,
        email: parsedContact.email,
        phone: parsedContact.phone,
        linkedin: parsedContact.linkedin,
        github: parsedContact.github,
        education: sections.education.length > 0 ? sections.education.slice(0, 5) : [`${userDoc.college || 'Engineering College'}, ${userDoc.branch || 'Engineering Branch'}`],
        skills: parsedSkills,
        projects: parsedProjects,
        certifications: parsedCerts,
        experience: parsedExp.slice(0, 8),
        achievements: parsedAchs.slice(0, 6)
      };
    }

    // --- IMPROVED SCORING ENGINE (SCORING IMPROVEMENTS - PHASE 13.1) ---
    // Do not assign 0 score simply because a section heading is not detected. Use fallback detection rules.
    const hasEducationInText = extractedText.toLowerCase().match(/(education|college|university|btech|degree|cgpa|gpa)/i);
    const hasSkillsInText = parsedData.skills.length > 0 || extractedText.toLowerCase().match(/(html|css|js|javascript|react|node|mongodb|python|java|git|sql|dbms)/i);
    const hasProjectsInText = parsedData.projects.length > 0 || extractedText.toLowerCase().match(/(project|developed|built|designed|implemented|github\.com\/)/i);
    const hasCertificationsInText = parsedData.certifications.length > 0 || extractedText.toLowerCase().match(/(certified|certification|credential|course|udemy|coursera)/i);
    const hasExperienceInText = parsedData.experience.length > 0 || extractedText.toLowerCase().match(/(experience|internship|intern|volunteer|employment|work)/i);

    // 1. Contact Information Points (10 pts)
    let contactPoints = 0;
    if (parsedData.phone) contactPoints += 4;
    if (parsedData.email) contactPoints += 4;
    if (parsedData.name) contactPoints += 2;

    // 2. Education (10 pts)
    let educationPoints = 0;
    if (parsedData.education.length > 0 || hasEducationInText) educationPoints += 5;
    if (extractedText.toLowerCase().match(/(cgpa|gpa|percentage|b\.tech|btech|bachelor|master|cgpa:\s*\d|gpa:\s*\d)/)) educationPoints += 5;

    // 3. Skills Section (15 pts)
    let skillsPoints = 0;
    const skillsCount = parsedData.skills.length;
    if (skillsCount >= 6) skillsPoints = 15;
    else if (skillsCount >= 3) skillsPoints = 10;
    else if (skillsCount >= 1 || hasSkillsInText) skillsPoints = 5;

    // 4. Projects Section (25 pts)
    let projectsPoints = 0;
    const projectsCount = parsedData.projects.length;
    if (projectsCount >= 2) projectsPoints = 25;
    else if (projectsCount === 1) projectsPoints = 12;
    else if (hasProjectsInText) projectsPoints = 8; // fallback points for project context found

    // 5. Certifications (10 pts)
    let certsPoints = (parsedData.certifications.length > 0 || hasCertificationsInText) ? 10 : 0;

    // 6. Experience (10 pts)
    let expPoints = (parsedData.experience.length > 0 || hasExperienceInText) ? 10 : 0;

    // 7. GitHub & LinkedIn Links (10 pts)
    let socialLinksPoints = 0;
    const hasGithub = parsedData.github || extractedText.toLowerCase().includes('github.com');
    const hasLinkedin = parsedData.linkedin || extractedText.toLowerCase().includes('linkedin.com');
    if (hasGithub) socialLinksPoints += 5;
    if (hasLinkedin) socialLinksPoints += 5;

    // 8. Formatting Heuristics (10 pts)
    let formattingPoints = 0;
    if (parsedData.education.length > 0 || hasEducationInText) formattingPoints += 2;
    if (parsedData.skills.length > 0 || hasSkillsInText) formattingPoints += 2;
    if (parsedData.projects.length > 0 || hasProjectsInText) formattingPoints += 2;
    if (parsedData.experience.length > 0 || hasExperienceInText) formattingPoints += 2;
    if (extractedText.length > 100) formattingPoints += 2;

    const readinessScore = contactPoints + educationPoints + skillsPoints + projectsPoints + certsPoints + expPoints + socialLinksPoints + formattingPoints;

    // ATS score (100 pts max)
    let atsStructurePoints = 0;
    if (parsedData.education.length > 0 || hasEducationInText) atsStructurePoints += 5;
    if (parsedData.skills.length > 0 || hasSkillsInText) atsStructurePoints += 5;
    if (parsedData.projects.length > 0 || hasProjectsInText) atsStructurePoints += 5;
    if (parsedData.experience.length > 0 || hasExperienceInText) atsStructurePoints += 5;
    if (parsedData.certifications.length > 0 || parsedData.achievements.length > 0 || hasCertificationsInText) atsStructurePoints += 5;

    let atsHeadingsPoints = 0;
    const headings = ['education', 'skills', 'experience', 'projects'];
    headings.forEach(h => {
      const headingFound = extractedText.toLowerCase().includes(h);
      let contentFound = false;
      if (h === 'education' && (parsedData.education.length > 0 || hasEducationInText)) contentFound = true;
      if (h === 'skills' && (parsedData.skills.length > 0 || hasSkillsInText)) contentFound = true;
      if (h === 'experience' && (parsedData.experience.length > 0 || hasExperienceInText)) contentFound = true;
      if (h === 'projects' && (parsedData.projects.length > 0 || hasProjectsInText)) contentFound = true;
      
      if (headingFound || contentFound) atsHeadingsPoints += 6.25;
    });

    let atsContactPoints = 0;
    if (parsedData.email) atsContactPoints += 5;
    if (parsedData.phone) atsContactPoints += 5;
    if (hasLinkedin || hasGithub) atsContactPoints += 5;

    let atsKeywordPoints = 0;
    const coreKeywords = ['development', 'system', 'software', 'management', 'database', 'cloud', 'design', 'testing', 'programming', 'engineering'];
    let matchesCount = 0;
    coreKeywords.forEach(kw => {
      if (extractedText.toLowerCase().includes(kw)) matchesCount++;
    });
    atsKeywordPoints = Math.min(25, matchesCount * 2.5);

    let atsReadabilityPoints = 10;
    if (extractedText.includes('???') || extractedText.includes('NaN')) atsReadabilityPoints -= 5;
    if (extractedText.length < 150) atsReadabilityPoints -= 5;

    const atsScore = atsStructurePoints + atsHeadingsPoints + atsContactPoints + atsKeywordPoints + atsReadabilityPoints;

    // Check Missing Sections
    const missingSections = [];
    if (parsedData.education.length === 0 && !hasEducationInText) missingSections.push('Education');
    if (parsedData.skills.length === 0 && !hasSkillsInText) missingSections.push('Skills');
    if (parsedData.projects.length === 0 && !hasProjectsInText) missingSections.push('Projects');
    if (parsedData.experience.length === 0 && !hasExperienceInText) missingSections.push('Experience');
    if (parsedData.certifications.length === 0 && !hasCertificationsInText) missingSections.push('Certifications');
    if (parsedData.achievements.length === 0) missingSections.push('Achievements');
    if (!hasLinkedin) missingSections.push('LinkedIn Profile');
    if (!hasGithub) missingSections.push('GitHub Profile');

    // Skill Gap Comparison
    const requiredSkills = ROLE_SKILLS[targetRole] || [];
    const userSkillsLower = parsedData.skills.map(s => s.toLowerCase().trim());
    const acquiredSkills = requiredSkills.filter(s => userSkillsLower.includes(s.toLowerCase().trim()));
    const missingSkills = requiredSkills.filter(s => !userSkillsLower.includes(s.toLowerCase().trim()));

    // Project Quality Analysis (rule-based checks - Section 7)
    let projectStrengthScore = 0;
    const projSuggestions = [];
    if (projectsCount > 0) {
      projectStrengthScore += Math.min(30, projectsCount * 15);
      
      const hasTech = parsedData.projects.every(p => p.technologies.length > 0);
      if (hasTech) projectStrengthScore += 20;
      else projSuggestions.push('Add technology stack details to all projects.');

      const hasGit = parsedData.projects.some(p => p.githubLink);
      if (hasGit) projectStrengthScore += 20;
      else projSuggestions.push('Add GitHub links to projects.');

      const hasLive = parsedData.projects.some(p => p.liveLink);
      if (hasLive) projectStrengthScore += 15;
      else projSuggestions.push('Include live deployment links.');

      const hasOutcomes = parsedData.projects.some(p => p.description && p.description.match(/(%|\d+x|\d+ms|improved|increased|reduced|saved|users)/i));
      if (hasOutcomes) projectStrengthScore += 15;
      else projSuggestions.push('Add quantified achievements and measurable outcomes.');

      const shortDesc = parsedData.projects.some(p => !p.description || p.description.length < 35);
      if (shortDesc) {
        projSuggestions.push('Improve project descriptions (add more context).');
      }
    } else {
      projSuggestions.push('Add more role-relevant projects (at least 2).');
    }

    // Recommendation Cards with Priority Levels (Section 8)
    const suggestions = [];
    if (!hasGithub) {
      suggestions.push({ text: 'Add GitHub profile URL.', priority: 'High', category: 'Links' });
    }
    if (!hasLinkedin) {
      suggestions.push({ text: 'Add LinkedIn profile URL.', priority: 'High', category: 'Links' });
    }
    if (projectsCount < 2) {
      suggestions.push({ text: 'Add more projects (minimum 2 recommended).', priority: 'High', category: 'Projects' });
    }
    if (parsedData.skills.length < 5) {
      suggestions.push({ text: 'Add more technical skills and frameworks.', priority: 'High', category: 'Skills' });
    }
    if (parsedData.certifications.length === 0 && !hasCertificationsInText) {
      suggestions.push({ text: 'Add professional certifications section.', priority: 'Medium', category: 'Certifications' });
    }
    if (missingSkills.length > 0) {
      suggestions.push({ text: `Acquire missing gap skills: ${missingSkills.slice(0, 3).join(', ')}.`, priority: 'Medium', category: 'Skills' });
    }

    // Placement Insights (Section 9)
    const placementInsights = [];
    if (targetRole) {
      if (missingSkills.length === 0) {
        placementInsights.push(`Resume is strong for ${targetRole} roles.`);
      } else {
        placementInsights.push(`${missingSkills.slice(0, 2).join(' and ')} are missing for ${targetRole} roles.`);
      }
    }
    if (projectStrengthScore >= 75) {
      placementInsights.push('Projects section is excellent.');
    } else {
      placementInsights.push('Adding project github or deployment links will boost score.');
    }
    if (parsedData.certifications.length === 0 && !hasCertificationsInText) {
      placementInsights.push('Certifications section is weak.');
    }
    if (!hasGithub) {
      placementInsights.push('GitHub profile should be added.');
    }
    if (projectsCount < 2) {
      placementInsights.push('Adding one major project may increase readiness score.');
    }

    // Save Resume Analysis to MongoDB
    const updatePayload = {
      isManual,
      extractedText,
      parsedData,
      readinessScore: Math.round(readinessScore),
      atsScore: Math.round(atsScore),
      missingSections,
      targetRole,
      skillGap: {
        acquired: acquiredSkills,
        missing: missingSkills
      },
      projectAnalysis: {
        strengthScore: Math.round(projectStrengthScore),
        suggestions: projSuggestions
      },
      suggestions,
      placementInsights
    };

    if (!isManual) {
      updatePayload.fileName = fileName;
      updatePayload.fileSize = fileSize;
      updatePayload.fileType = fileType;
      updatePayload.fileData = fileData;
    } else {
      // Clear legacy file records if manually completed
      updatePayload.fileName = 'manual_entry';
      updatePayload.fileSize = 0;
      updatePayload.fileType = 'application/json';
      updatePayload.fileData = 'manual';
    }

    const resumeAnalysisDoc = await ResumeAnalysis.findOneAndUpdate(
      { userId },
      updatePayload,
      { new: true, upsert: true }
    );

    // PROFILE INTEGRATION & AUTO-SYNC (SECTION 11)
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
    }

    // 1. Sync Skills
    const currentSkillsLower = (profile.skills || []).map(s => s.toLowerCase().trim());
    const skillsToMerge = parsedData.skills.filter(s => !currentSkillsLower.includes(s.toLowerCase().trim()));
    if (skillsToMerge.length > 0) {
      profile.skills = [...(profile.skills || []), ...skillsToMerge];
    }

    // 2. Sync Certifications
    const currentCertsLower = (profile.certifications || []).map(c => c.toLowerCase().trim());
    const certsToMerge = parsedData.certifications.filter(c => !currentCertsLower.includes(c.toLowerCase().trim()));
    if (certsToMerge.length > 0) {
      profile.certifications = [...(profile.certifications || []), ...certsToMerge];
    }

    // 3. Sync Projects
    const currentProjectTitles = (profile.projects || []).map(p => p.title.toLowerCase().trim());
    const projectsToMerge = parsedData.projects.filter(p => p.title && !currentProjectTitles.includes(p.title.toLowerCase().trim()));
    if (projectsToMerge.length > 0) {
      const mergedProjects = projectsToMerge.map(p => ({
        title: p.title,
        description: p.description || '',
        technologies: p.technologies || []
      }));
      profile.projects = [...(profile.projects || []), ...mergedProjects];
    }

    // 4. Sync URLs
    if (hasGithub && !profile.githubUrl) {
      profile.githubUrl = parsedData.github || 'https://github.com';
    }
    if (hasLinkedin && !profile.linkedinUrl) {
      profile.linkedinUrl = parsedData.linkedin || 'https://linkedin.com';
    }

    await profile.save();

    return NextResponse.json({
      message: 'Resume analysis and profile sync complete.',
      analysis: {
        _id: resumeAnalysisDoc._id,
        fileName: resumeAnalysisDoc.fileName,
        fileSize: resumeAnalysisDoc.fileSize,
        fileType: resumeAnalysisDoc.fileType,
        readinessScore: resumeAnalysisDoc.readinessScore,
        atsScore: resumeAnalysisDoc.atsScore,
        missingSections: resumeAnalysisDoc.missingSections,
        parsedData: resumeAnalysisDoc.parsedData,
        skillGap: resumeAnalysisDoc.skillGap,
        projectAnalysis: resumeAnalysisDoc.projectAnalysis,
        suggestions: resumeAnalysisDoc.suggestions,
        placementInsights: resumeAnalysisDoc.placementInsights,
        isManual: resumeAnalysisDoc.isManual
      }
    });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during resume analysis.' }, { status: 500 });
  }
}
