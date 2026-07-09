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
  // Basic verbs & descriptors
  'develop', 'developer', 'developing', 'management', 'manage', 'manager', 'managing', 'lead', 'leader', 'leading',
  'work', 'worked', 'working', 'build', 'building', 'built', 'create', 'creating', 'created', 'design', 'designing',
  'designed', 'responsibilities', 'responsible', 'project', 'projects', 'experience', 'experiences', 'team', 'teams',
  'skill', 'skills', 'role', 'roles', 'ability', 'abilities', 'strong', 'excellent', 'good', 'years', 'highly', 'motivated',
  'engineering', 'engineer', 'engineers', 'application', 'applications', 'software', 'system', 'systems', 'platform',
  'platforms', 'process', 'processes', 'solution', 'solutions', 'product', 'products', 'new', 'tools', 'using', 'used',
  'technology', 'technologies', 'environment', 'high', 'quality', 'technical', 'basic', 'advanced', 'expert',
  
  // Job posting terms & sections
  'bachelor', 'bachelor\'s', 'master', 'master\'s', 'phd', 'degree', 'education', 'field', 'study', 'science',
  'minimum', 'required', 'preferred', 'qualification', 'qualifications', 'requirements', 'duties', 'tasks',
  'assigned', 'related', 'focus', 'focused', 'deliver', 'deliverables', 'drive', 'driven', 'implement', 'implementation',
  'provide', 'providing', 'support', 'operational', 'supportive', 'continuity',
  
  // Action verbs (general)
  'apply', 'applied', 'analyzing', 'analyze', 'analyzed', 'configure', 'configuration', 'configurations', 'maintain',
  'optimization', 'optimizing', 'optimize', 'continuously', 'continuous', 'refine', 'refinement', 'improve',
  'improvement', 'improvements', 'reduce', 'reducing', 'enhanced', 'enhance', 'enhancing', 'ensure', 'ensuring',
  'evaluate', 'evaluation', 'evaluating', 'recommend', 'recommending', 'recommendations', 'investigate', 'investigation',
  'investigating', 'determine', 'determining', 'distinguish', 'distinguishing', 'perform', 'performing', 'triage',
  'escalate', 'escalating', 'escalated', 'contribute', 'contribution', 'contributions', 'support', 'supporting',
  'troubleshoot', 'troubleshooting', 'resolve', 'resolving', 'resolution', 'adjust', 'adjusting', 'balance',
  'balancing', 'collaborate', 'collaboration', 'collaborating', 'collaborative', 'diagnose', 'diagnosing',
  'serve', 'serving', 'identify', 'identifying', 'communicate', 'communication', 'communicating', 'translate',
  'translating', 'demonstrate', 'demonstrating', 'incorporate', 'incorporating', 'participate', 'participating',
  'respond', 'responding', 'response', 'responses', 'meet', 'meeting', 'deliver', 'delivering', 'prepare', 'preparing',
  'present', 'presenting', 'write', 'writing', 'execute', 'executing', 'execution',
  
  // General business / corporate vocabulary
  'alert', 'alerts', 'analysis', 'visibility', 'capabilities', 'coverage', 'health', 'telemetry', 'integrity',
  'environments', 'enhancements', 'action', 'actions', 'context', 'risk', 'risks', 'activity', 'activities',
  'data', 'source', 'sources', 'log', 'logs', 'traffic', 'behavior', 'behaviors', 'judgment', 'cause', 'coordination',
  'incident', 'incidents', 'control', 'controls', 'access', 'disruptions', 'disruption', 'positives', 'positive',
  'false', 'conflict', 'conflicts', 'decision', 'decisions', 'need', 'needs', 'knowledge', 'multiple', 'resiliency',
  'resource', 'resources', 'peer', 'peers', 'point', 'points', 'failure', 'failures', 'gap', 'gaps', 'effectiveness',
  'noise', 'playbook', 'playbooks', 'situation', 'situations', 'guidance', 'incomplete', 'findings', 'clearly',
  'stakeholder', 'stakeholders', 'observation', 'observations', 'impact', 'listening', 'perspective', 'perspectives',
  'solutions-oriented', 'approach', 'approaches', 'direction', 'directions', 'rotation', 'rotations', 'hour', 'hours',
  'production-impacting', 'after-hours', 'on-call', 'related', 'various', 'other', 'others', 'etc', 'across', 'within',
  'best', 'practice', 'practices', 'success', 'successful', 'detail', 'detail-oriented', 'written', 'verbal',
  'time', 'timely', 'structured', 'manner', 'efficient', 'efficiently', 'efficiency', 'resilient',
  'call', 'calls', 'eg', 'e.g', 'information', 'issue', 'issues', 'anomalous', 'appropriate', 'available', 'based', 
  'business', 'clear', 'effective', 'email', 'existing', 'five', 'eight', 'generated', 'impacting', 'including', 
  'independent'
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
    const extractKeywords = (text: string): string[] => {
      // Clean punctuation except for symbols like +, #, ., -
      const cleanText = text.replace(/[,\/#!$%\^&\*;:{}=\_`~()]/g, ' ');
      const tokens = cleanText.split(/\s+/).map(t => t.trim().replace(/\.+$/, '')).filter(Boolean);

      const list: string[] = [];

      const isStopOrGeneral = (w: string) => {
        const lower = w.toLowerCase();
        return COMMON_STOP_WORDS.has(lower) || GENERAL_WORDS.has(lower);
      };

      // Specific core technical keywords to always check
      const TECH_KEYWORDS_DICTIONARY = new Set([
        'react', 'typescript', 'javascript', 'node.js', 'nodejs', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
        'go', 'golang', 'rust', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'cloud', 'linux', 'unix', 'git', 'github',
        'sql', 'nosql', 'postgresql', 'mysql', 'mongodb', 'redis', 'graphql', 'rest', 'api', 'apis', 'microservices',
        'ci/cd', 'jenkins', 'terraform', 'ansible', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'jquery', 'redux',
        'next.js', 'nextjs', 'vue', 'angular', 'svelte', 'express', 'flask', 'django', 'spring', 'laravel', 'security',
        'cybersecurity', 'network', 'telemetry', 'endpoint', 'identity', 'vulnerability', 'incident', 'response', 'triage',
        'automation', 'scripting', 'compliance', 'audit', 'auditing', 'iam', 'sso', 'saml', 'oauth', 'firewall', 'siem', 'soc',
        'ids', 'ips', 'splunk', 'wireshark', 'owasp', 'pen', 'penetration', 'forensics', 'cryptography', 'encryption',
        'detection', 'ioa', 'ioc', 'mttd', 'mttr'
      ]);

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const lowerToken = token.toLowerCase();

        // Technical word or Capitalized noun (non-general)
        if (
          TECH_KEYWORDS_DICTIONARY.has(lowerToken) ||
          (/^[A-Z][a-zA-Z\d+#.-]*$/.test(token) && !isStopOrGeneral(token) && token.length >= 2)
        ) {
          list.push(token);
        }

        // Years of experience (e.g. "8 years" or "8 year")
        if (i < tokens.length - 1) {
          const nextToken = tokens[i + 1];
          if (/^\d+$/.test(token) && /^years?$/i.test(nextToken)) {
            list.push(`${token} years experience`);
          }
        }

        // Two-word phrases (bigrams)
        if (i < tokens.length - 1) {
          const next = tokens[i + 1];
          if (!isStopOrGeneral(token) && !isStopOrGeneral(next) && isNaN(Number(token)) && isNaN(Number(next))) {
            const phrase = `${token} ${next}`;
            if (
              phrase.match(/[A-Z]/) ||
              TECH_KEYWORDS_DICTIONARY.has(token.toLowerCase()) ||
              TECH_KEYWORDS_DICTIONARY.has(next.toLowerCase())
            ) {
              list.push(phrase);
            }
          }
        }

        // Three-word phrases (trigrams)
        if (i < tokens.length - 2) {
          const next1 = tokens[i + 1];
          const next2 = tokens[i + 2];
          if (
            !isStopOrGeneral(token) &&
            !isStopOrGeneral(next1) &&
            !isStopOrGeneral(next2) &&
            isNaN(Number(token)) &&
            isNaN(Number(next1)) &&
            isNaN(Number(next2))
          ) {
            const phrase = `${token} ${next1} ${next2}`;
            if (phrase.match(/[A-Z]/)) {
              list.push(phrase);
            }
          }
        }
      }

      return list;
    };

    // Extract unique keywords from the job description (case-insensitive deduplication)
    const rawKeywords = extractKeywords(jobDescription);
    const seen = new Set<string>();
    const jdKeywords: string[] = [];
    rawKeywords.forEach(w => {
      const lower = w.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        jdKeywords.push(w);
      }
    });

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
      const escaped = lowerKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      let regex: RegExp;
      if (lowerKeyword.endsWith('years experience')) {
        const yearsNum = lowerKeyword.split(' ')[0];
        // Match numbers, plurals, abbreviations, and "+": e.g., "8 years", "8+ years", "8 yrs", "8+ yrs"
        regex = new RegExp(`\\b${yearsNum}\\+?\\s*(years?|yrs?)\\b`, 'i');
      } else {
        // Standard check
        regex = /^[a-z]+$/i.test(lowerKeyword)
          ? new RegExp(`\\b${escaped}\\b`, 'i')
          : new RegExp(escaped, 'i');
      }

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
