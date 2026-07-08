import type { ResumeData } from '../types/resume';

export interface AtsWarning {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  suggestion: string;
}

export interface KeywordMatchReport {
  score: number;
  matched: string[];
  missing: string[];
}

export interface AtsReport {
  score: number; // Overall formatting score out of 100
  warnings: AtsWarning[];
  keywordMatch?: KeywordMatchReport;
}

// Stop words to filter out before running keyword frequency scans
const COMMON_STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up', 'about', 'into', 'over', 'after',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their', 'our', 'us', 'your', 'my',
  'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
  'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'done',
  'as', 'if', 'when', 'while', 'because', 'how', 'why', 'where', 'who', 'which', 'this', 'that', 'these', 'those',
  'with', 'about', 'against', 'between', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from',
  'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
]);

// Common action verbs and general words that aren't specific technical keywords
const GENERAL_WORDS = new Set([
  'develop', 'developer', 'developing', 'management', 'manage', 'manager', 'managing', 'lead', 'leader', 'leading',
  'work', 'worked', 'working', 'build', 'building', 'built', 'create', 'creating', 'created', 'design', 'designing',
  'designed', 'responsibilities', 'responsible', 'project', 'projects', 'experience', 'experiences', 'team', 'teams',
  'skill', 'skills', 'role', 'roles', 'ability', 'abilities', 'strong', 'excellent', 'good', 'years', 'highly', 'motivated',
  'engineering', 'engineer', 'engineers', 'application', 'applications', 'software', 'system', 'systems', 'platform',
  'platforms', 'process', 'processes', 'solution', 'solutions', 'product', 'products', 'new', 'tools', 'using', 'used',
  'technology', 'technologies', 'environment', 'high', 'quality', 'technical'
]);

/**
 * Scans the resume structure for layout issues, warnings, and missing details,
 * and performs client-side keyword matching against a pasted Job Description.
 */
export const scanAts = (data: ResumeData, jobDescription: string = ''): AtsReport => {
  const warnings: AtsWarning[] = [];

  // 1. Layout & Column Checks
  if (data.styles.templateId.startsWith('split-')) {
    warnings.push({
      id: 'two-column',
      type: 'warning',
      message: 'Two-column layout is active.',
      suggestion: 'Some older ATS parsers read across columns left-to-right rather than reading each column vertically, which can jumble your experience. Consider standard single-column templates for cold applications at large MNCs.'
    });
  }

  // 2. Profile Details Checks
  if (!data.personalInfo.name.trim()) {
    warnings.push({
      id: 'missing-name',
      type: 'error',
      message: 'Name is empty.',
      suggestion: 'Your full name should be clearly visible at the top of the resume.'
    });
  }

  if (!data.personalInfo.email.trim()) {
    warnings.push({
      id: 'missing-email',
      type: 'error',
      message: 'Email address is missing.',
      suggestion: 'Recruiters and automated systems require an email address to contact you. Please specify a valid email.'
    });
  }

  if (!data.personalInfo.phone.trim()) {
    warnings.push({
      id: 'missing-phone',
      type: 'warning',
      message: 'Phone number is missing.',
      suggestion: 'Adding a phone number is standard practice to help hiring managers schedule quick screening calls.'
    });
  }

  if (!data.personalInfo.location.trim()) {
    warnings.push({
      id: 'missing-location',
      type: 'warning',
      message: 'Location is missing.',
      suggestion: 'Specify your City/State (or Country/Remote) to help filters verify time zone alignments and work authorization.'
    });
  }

  if (!data.personalInfo.summary.trim() || data.personalInfo.summary.length < 40) {
    warnings.push({
      id: 'missing-summary',
      type: 'info',
      message: 'Professional summary is too short or missing.',
      suggestion: 'Include a 2-3 sentence overview that highlights your primary stack, years of experience, and key accomplishments.'
    });
  }

  // 3. Section specific checks
  if (data.experience.length === 0) {
    warnings.push({
      id: 'no-experience',
      type: 'error',
      message: 'Work Experience section is empty.',
      suggestion: 'Recruiters prioritize professional experience above all else. Add at least one previous or current role.'
    });
  }

  data.experience.forEach(exp => {
    const lines = exp.description.split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2) {
      warnings.push({
        id: `short-exp-${exp.id}`,
        type: 'info',
        message: `Minimal descriptions for "${exp.position || 'Role'}" at ${exp.company || 'Company'}.`,
        suggestion: 'Write at least 2-3 descriptive bullet points explaining your impact, projects, and technologies used in this role.'
      });
    }
  });

  if (data.skills.length === 0) {
    warnings.push({
      id: 'no-skills',
      type: 'warning',
      message: 'Skills list is empty.',
      suggestion: 'ATS software relies heavily on skill matching. Add a core skills section categorizing your technical profile (e.g. Frontend, Backend).'
    });
  }

  // Calculate score (out of 100)
  let formattingScore = 100;
  warnings.forEach(w => {
    if (w.type === 'error') formattingScore -= 15;
    if (w.type === 'warning') formattingScore -= 8;
    if (w.type === 'info') formattingScore -= 3;
  });
  formattingScore = Math.max(10, formattingScore);

  let keywordMatch: KeywordMatchReport | undefined = undefined;

  // 4. Keyword Matcher Logic
  if (jobDescription.trim()) {
    // Helper to tokenize text and extract potential keywords
    const extractKeywords = (text: string): string[] => {
      // Extract words including tech terms containing symbols, like C++, C#, .NET, Node.js
      const rawWords = text.match(/[a-zA-Z\d+#.]+/g) || [];
      return rawWords
        .map(w => w.trim())
        .filter(w => {
          const lower = w.toLowerCase();
          // Filter out stop words, general words, numbers, and short noise
          return (
            lower.length >= 2 &&
            !COMMON_STOP_WORDS.has(lower) &&
            !GENERAL_WORDS.has(lower) &&
            isNaN(Number(lower))
          );
        });
    };

    // Extract unique keywords from the job description
    const jdKeywords = Array.from(new Set(extractKeywords(jobDescription)));

    // Aggregate entire resume text into a single searchable pool
    let resumePool = [
      data.personalInfo.title,
      data.personalInfo.summary,
      ...data.experience.map(e => `${e.position} ${e.company} ${e.description}`),
      ...data.education.map(e => `${e.degree} ${e.fieldOfStudy} ${e.description}`),
      ...data.skills.map(s => `${s.category} ${s.skills}`),
      ...data.projects.map(p => `${p.name} ${p.description} ${p.technologies}`),
      ...data.customSections.flatMap(cs => [
        cs.title,
        ...cs.items.flatMap(item => Object.values(item))
      ])
    ].join(' ').toLowerCase();

    const matched: string[] = [];
    const missing: string[] = [];

    // Score checks
    jdKeywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      // Escape special regex characters
      const escaped = lowerKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      // Use boundaries if it's a letters-only word, otherwise use literal search
      const regex = /^[a-z]+$/i.test(lowerKeyword)
        ? new RegExp(`\\b${escaped}\\b`, 'i')
        : new RegExp(escaped, 'i');

      if (regex.test(resumePool)) {
        matched.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    const totalKeywords = jdKeywords.length;
    const matchScore = totalKeywords > 0 ? Math.round((matched.length / totalKeywords) * 100) : 100;

    // Sort to keep display tidy
    matched.sort();
    missing.sort();

    keywordMatch = {
      score: matchScore,
      matched,
      missing
    };
  }

  return {
    score: formattingScore,
    warnings,
    keywordMatch
  };
};
