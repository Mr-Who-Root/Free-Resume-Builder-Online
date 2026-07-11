import type { ResumeData } from '../types/resume';

const STORAGE_KEY = 'free_resume_builder_data';

export const SAMPLE_RESUME_DATA: ResumeData = {
  "personalInfo": {
    "name": "Govind S R",
    "title": "Cyber Security Engineer",
    "email": "letter2govind@gmail.com",
    "phone": "+919999999999",
    "website": "",
    "location": "Keralam, India",
    "summary": "Experienced Cyber Security Engineer with a proven track record of identifying and resolving complex network and system security issues. Skilled at developing secure infrastructure solutions and security protocols.",
    "photo": "",
    "customFields": [],
    "socialLinks": [
      {
        "platform": "linkedin",
        "username": "govind-s-r-"
      },
      {
        "platform": "github",
        "username": "Mr-Who-Root"
      }
    ]
  },
  "experience": [
    {
      "id": "exp-1",
      "company": "Activebytes Innovations",
      "position": "Senior Security Engineer",
      "startDate": "Aug 2022",
      "endDate": "Present",
      "location": "UAE / Remote",
      "description": "- Worked on FortiSOAR and created **50+** playbooks.\n- Developed a SOC solution that automatically detects alerts and performs the required investigations.\n- Developed a Hunter module for creating different attack scenarios and generating alerts when suspicious activity is detected.\n- Developed a Compliance module containing **5+** security standards along with their associated alerts.\n- Developed **SOAR** modules with capabilities such as scheduled execution, pre-built and custom playbooks to automate repetitive manual tasks like alert triage, IP blocking, and user suspension. The platform also integrates multiple security tools (*firewalls, EDR, SIEM*, etc.) into a centralized console, enabling unified data sharing and coordinated response actions.\n- Created **100+** Compliance alerts and **300+** SOAR connectors and playbooks for various security solutions.\n- Developed a Threat Intelligence (TI) platform with capabilities including Threat Monitoring, Vulnerability Watcher, EASM, and Custom TI Reporting modules.\n- Developed an **AI Agent** to assist with the implementation of different log sources and support Detection Engineering by reviewing and optimizing alert playbooks."
    },
    {
      "id": "exp-2",
      "company": "ActivBytes Technologies",
      "position": "Cyber Security Analyst (Internship)",
      "startDate": "May 2022",
      "endDate": "Aug 2022",
      "location": "Remote",
      "description": "-Implemented security controls to identify and mitigate potential threats.\n-Investigated and analyzed security incidents, and tracked down their source and scope.\n-Created more than 50 playbooks in Python for various alerts and their investigations."
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "Anna University",
      "degree": "Bachelor of Engineering",
      "fieldOfStudy": "Computer Science and Engineering",
      "startDate": "2017",
      "endDate": "2021",
      "location": "Tamil Nadu, India",
      "description": "7.5 CGPA"
    }
  ],
  "skills": [
    {
      "id": "skill-1",
      "category": "Languages",
      "skills": "Python, JavaScript, SQL, HTML/CSS"
    },
    {
      "id": "skill-2",
      "category": "Frameworks & Libraries",
      "skills": "React, Next.js, Django, Fast API"
    },
    {
      "id": "skill-3",
      "category": "Tools & Infrastructure",
      "skills": "Docker, AWS (S3/EC2), Elastic Search, FortiSOAR, Nmap, Burp Suite, Wireshark, Nuclei, Metasploit, Git, PostgreSQL, Redis, CI/CD (GitHub Actions),"
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "name": "UnityFlux",
      "description": "AI-driven Extended Operations & Response tool integrating Red/Blue teaming automation, RAG knowledge, and ML-based log analysis at scale.",
      "technologies": "React, Python, Django, Rust",
      "link": ""
    },
    {
      "id": "proj-1783761977041",
      "name": "Atomix",
      "description": "Atomix is a multi-tenant SaaS and on-premises log management platform that provides an OpenSearch-like search experience with high-compression log storage, achieving up to **20×–90×** better compression than Elasticsearch while offering real-time alerting, dashboards, SOAR automation, firewall orchestration, and a unified cross-platform agent.",
      "technologies": "Python, Next.js, Django, GO, Docker",
      "link": ""
    },
    {
      "id": "proj-2",
      "name": "Cyber Threat Intelligence Platform",
      "description": "Designed CTI platform with OpenSearch backend, STIX ingestion pipeline, and graph-based frontend for intel correlation and visualization.",
      "technologies": "React, Python, Django, Amazon RDS, Nmap, Nuclei",
      "link": ""
    },
    {
      "id": "proj-1783761851933",
      "name": "Custom SOAR Platform",
      "description": "Developed SOAR modules with scheduled execution, customizable playbooks, and multi-tool integration to automate security workflows, including alert triage, IP blocking, user suspension, and coordinated incident response.",
      "technologies": "Python, Django, React, Docker",
      "link": ""
    }
  ],
  "customSections": [
    {
      "id": "custom-1783761483581",
      "title": "Certifications",
      "fields": [
        {
          "id": "f-1783761580149",
          "name": "field_1783761580149",
          "label": "Title",
          "type": "text"
        },
        {
          "id": "f-1783761586418",
          "name": "field_1783761586418",
          "label": "Date",
          "type": "date"
        }
      ],
      "items": [
        {
          "id": "item-1783761521335",
          "field_1783761580149": "Certified Ethical Hacker (CEH), EC-Council",
          "field_1783761586418": "April 2022"
        },
        {
          "id": "item-1783761613174",
          "field_1783761580149": "Certified Penetration Tester, RedTeam Hacker Academy",
          "field_1783761586418": "Jan 2022"
        },
        {
          "id": "item-1783761623124",
          "field_1783761580149": "Splunk 7.x Fundamentals Part 1 , Splunk",
          "field_1783761586418": "Oct 2021"
        }
      ]
    }
  ],
  "sectionOrder": [
    "personalInfo",
    "experience",
    "education",
    "skills",
    "projects",
    "custom-1783761483581"
  ],
  "styles": {
    "templateId": "tech-classic",
    "fontFamily": "outfit",
    "fontSize": "sm",
    "lineHeight": "normal",
    "spacing": "normal",
    "margin": "medium",
    "colorTheme": "navy"
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
