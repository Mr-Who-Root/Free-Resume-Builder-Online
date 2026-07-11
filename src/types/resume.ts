export type SocialPlatform = 'linkedin' | 'github' | 'instagram' | 'youtube' | 'facebook' | 'twitter' | 'tiktok' | 'behance' | 'dribbble' | 'medium' | 'stackoverflow' | 'other';

export interface SocialLink {
  platform: SocialPlatform;
  username: string;
  url?: string; // optional custom URL; if absent, auto-generated from username
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  summary: string;
  photo?: string;
  socialLinks?: SocialLink[];
  customFields?: Array<{ name: string; value: string }>;
}


export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string; // supports markdown
  customFields?: Array<{ name: string; value: string }>;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  customFields?: Array<{ name: string; value: string }>;
}

export interface SkillCategory {
  id: string;
  category: string; // e.g. "Languages", "Frameworks"
  skills: string; // comma-separated e.g. "React, Node.js"
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
  customFields?: Array<{ name: string; value: string }>;
}

export interface CustomFieldSchema {
  id: string;
  name: string; // the key in the item object, e.g. "title", "date", "description"
  label: string; // e.g. "Role/Title", "Date", "Details"
  type: 'text' | 'textarea' | 'date' | 'title';
}

export interface CustomSection {
  id: string;
  title: string;
  fields: CustomFieldSchema[];
  items: Array<{
    id: string;
    [key: string]: string; // key-value map for dynamic values
  }>;
}

export interface TemplateStyles {
  templateId: string; // 12 variations
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: 'xs' | 'sm' | 'md' | 'lg';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  spacing: 'compact' | 'normal' | 'spacious';
  margin: 'small' | 'medium' | 'large';
  colorTheme: 'navy' | 'slate' | 'emerald' | 'indigo' | 'crimson' | 'charcoal';
  hiddenSections?: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  customSections: CustomSection[];
  sectionOrder: string[]; // e.g. ["experience", "education", "skills", "projects", "custom_xxx"]
  styles: TemplateStyles;
}
