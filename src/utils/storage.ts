import type { ResumeData } from '../types/resume';

const STORAGE_KEY = 'free_resume_builder_data';

export const SAMPLE_RESUME_DATA: ResumeData = {
  personalInfo: {
    name: "Alex Mercer",
    title: "Senior Full-Stack Engineer",
    email: "alex.mercer@devmail.com",
    phone: "+1 (555) 123-4567",
    website: "github.com/alexmercer",
    location: "San Francisco, CA",
    summary: "Passionate engineer with 6+ years of experience designing and optimizing high-performance web applications. Specialized in **React**, **TypeScript**, and **Go**. Proven track record of improving application latency by *35%* and leading cross-functional teams to launch scalable platforms.",
    photo: "",
    customFields: [
      { name: "LinkedIn", value: "linkedin.com/in/alexmercer" }
    ]
  },
  experience: [
    {
      id: "exp-1",
      company: "TechNova Solutions",
      position: "Lead Software Engineer",
      startDate: "Oct 2023",
      endDate: "Present",
      location: "San Francisco, CA",
      description: "• Led a team of 6 engineers to rewrite the core real-time streaming pipeline, reducing server costs by **30%**\n• Orchestrated migration to React 18 and Vite, improving LCP speed by *45%* and developer build times\n• Implemented robust Redis caching mechanisms, decreasing database query loads by **40%**"
    },
    {
      id: "exp-2",
      company: "DevStream Inc.",
      position: "Senior Frontend Engineer",
      startDate: "Jul 2021",
      endDate: "Sep 2023",
      location: "Remote",
      description: "• Engineered and maintained customer-facing billing dashboards serving **5M+** monthly active users\n• Introduced TypeScript and standard ESLint rules, reducing runtime defects in production by **25%**\n• Mentored 4 junior engineers and built a custom reusable component library using Tailwind CSS"
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      fieldOfStudy: "Software Engineering",
      startDate: "2017",
      endDate: "2021",
      location: "Berkeley, CA",
      description: "Graduated with Honors. Coursework in Data Structures, Algorithms, Distributed Systems, and UI Design."
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: "Languages",
      skills: "TypeScript, JavaScript, Go, Python, SQL, HTML5/CSS3"
    },
    {
      id: "skill-2",
      category: "Frameworks & Libraries",
      skills: "React, Next.js, Node.js, Express, Tailwind CSS, Redux Toolkit"
    },
    {
      id: "skill-3",
      category: "Tools & Infrastructure",
      skills: "Docker, AWS (S3/EC2), Git, PostgreSQL, Redis, CI/CD (GitHub Actions)"
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "AntiGravity Editor",
      description: "A premium open-source Markdown writing platform featuring high-fidelity live preview and split-screen layouts. Reached **#3 on Product Hunt**.",
      technologies: "React, Vite, Tailwind CSS, LocalStorage",
      link: "github.com/alexmercer/antigravity"
    },
    {
      id: "proj-2",
      name: "FastAPI Rate Limiter",
      description: "Distributed token-bucket rate limiter middleware for Python APIs. Supports Redis backend with zero-overhead configuration.",
      technologies: "Python, Redis, Docker, GitHub Actions",
      link: "github.com/alexmercer/fastapi-limiter"
    }
  ],
  customSections: [
    {
      id: "custom-awards",
      title: "Honors & Hackathons",
      fields: [
        { id: "f-title", name: "title", label: "Title / Award", type: "text" },
        { id: "f-date", name: "date", label: "Date", type: "text" },
        { id: "f-org", name: "org", label: "Organization", type: "text" },
        { id: "f-desc", name: "desc", label: "Description", type: "textarea" }
      ],
      items: [
        {
          id: "item-1",
          title: "1st Place Winner",
          date: "Nov 2025",
          org: "Silicon Valley AI Hackathon",
          desc: "Built a fully local model running voice agent that runs entirely offline inside a Chrome Extension."
        }
      ]
    }
  ],
  sectionOrder: ["personalInfo", "experience", "education", "skills", "projects", "custom-awards"],
  styles: {
    templateId: "tech-classic",
    fontFamily: "sans",
    fontSize: "sm",
    lineHeight: "normal",
    spacing: "normal",
    margin: "medium",
    colorTheme: "navy"
  }
};

export const loadResumeData = (): ResumeData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return SAMPLE_RESUME_DATA;
  }
  try {
    const parsed = JSON.parse(stored);
    // basic sanity checks
    if (parsed && parsed.personalInfo && parsed.styles) {
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse stored resume data:", e);
  }
  return SAMPLE_RESUME_DATA;
};

export const saveResumeData = (data: ResumeData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
