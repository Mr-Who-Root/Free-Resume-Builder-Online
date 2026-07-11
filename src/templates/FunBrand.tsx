import React from 'react';
import type { ResumeData } from '../types/resume';
import { MarkdownText } from '../components/MarkdownText';

interface TemplateProps {
  data: ResumeData;
  styleUtils: {
    fontClass: string;
    sizeClass: string;
    leadingClass: string;
    spacingClass: string;
    marginClass: string;
    accentColor: string;
    accentText: string;
    accentBorder: string;
    accentBg: string;
    accentBgLight: string;
  };
}

// ---- GOOGLE TEMPLATE ----
const GoogleTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects, customSections, sectionOrder, styles } = data;

  const contacts = [
    { icon: '📍', val: personalInfo.location },
    { icon: '📧', val: personalInfo.email },
    { icon: '📞', val: personalInfo.phone },
    { icon: '🌐', val: personalInfo.website },
    ...(personalInfo.customFields || []).map(f => ({ icon: '🔗', val: f.value })),
  ].filter(c => c.val);

  const renderResults = (id: string) => {
    if ((styles.hiddenSections || []).includes(id)) return null;

    if (id === 'experience') {
      return experience.map((exp) => (
        <div key={exp.id} className="mb-5 print:break-inside-avoid experience-item">
          <div className="text-xs text-emerald-700 mb-0.5">Experience · {exp.company}</div>
          <a className="text-lg text-blue-700 font-normal leading-tight hover:underline cursor-pointer block">
            {exp.company} | {exp.location} | {exp.position} | {exp.startDate}–{exp.endDate}
          </a>
          {exp.description && (
            <div className="mt-1 text-sm text-gray-700 leading-relaxed">
              <MarkdownText text={exp.description} />
            </div>
          )}
        </div>
      ));
    }

    if (id === 'projects') {
      return projects.map((proj) => (
        <div key={proj.id} className="mb-5 print:break-inside-avoid project-item">
          <div className="text-xs text-emerald-700 mb-0.5">Project · {proj.link || 'www.projectsite.com'}</div>
          <a className="text-lg text-blue-700 font-normal leading-tight hover:underline cursor-pointer block">
            {proj.name} | {proj.technologies} | {proj.link}
          </a>
          {proj.description && (
            <div className="mt-1 text-sm text-gray-700 leading-relaxed">
              <MarkdownText text={proj.description} />
            </div>
          )}
        </div>
      ));
    }

    if (id === 'education') {
      return education.map((edu) => (
        <div key={edu.id} className="mb-5 print:break-inside-avoid education-item">
          <div className="text-xs text-emerald-700 mb-0.5">Education · {edu.institution}</div>
          <a className="text-lg text-blue-700 font-normal leading-tight hover:underline cursor-pointer block">
            {edu.degree} | {edu.institution} | {edu.startDate}–{edu.endDate}
          </a>
          {edu.description && (
            <div className="mt-1 text-sm text-gray-700 leading-relaxed">{edu.description}</div>
          )}
        </div>
      ));
    }

    const cs = customSections.find(s => s.id === id);
    if (cs) {
      return cs.items.map((item) => {
        const titleField = cs.fields.find(f => f.type === 'title') || cs.fields[0];
        const descFields = cs.fields.filter(f => f.type === 'textarea');
        const titleVal = titleField ? item[titleField.name] : '';
        return (
          <div key={item.id} className="mb-5 print:break-inside-avoid">
            <div className="text-xs text-emerald-700 mb-0.5">{cs.title}</div>
            <a className="text-lg text-blue-700 font-normal leading-tight hover:underline cursor-pointer block">{titleVal}</a>
            {descFields.map(f => item[f.name] && (
              <div key={f.id} className="mt-1 text-sm text-gray-700">
                <MarkdownText text={item[f.name]} />
              </div>
            ))}
          </div>
        );
      });
    }
    return null;
  };

  return (
    <div className="resume-paper w-full bg-white font-sans" style={{ fontSize: '13px' }}>
      {/* Google Header */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-3">
          {/* Google Logo */}
          <svg viewBox="0 0 272 92" className="h-9 shrink-0" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
            <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
            <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
            <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
            <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
            <path fill="#4285F4" d="M35.29 41.41V32h31.91c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
          </svg>
          {/* Search bar acting as name */}
          <div className="flex-1 border border-gray-300 rounded-full px-5 py-2.5 flex items-center justify-between shadow-sm text-base text-gray-800 font-medium max-w-md">
            <span>{personalInfo.name}</span>
            <div className="flex items-center gap-2 text-gray-400">
            <span className="text-blue-500">🎤</span>
              <span className="text-blue-500">🔍</span>
            </div>
          </div>
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-yellow-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
            {personalInfo.name.charAt(0)}
          </div>
        </div>
        {/* Contacts as breadcrumb tabs */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-blue-600 border-b border-gray-200 pb-0">
          {personalInfo.title && (
            <div className="flex items-center gap-1 font-medium border-b-2 border-blue-600 pb-2">
              <span className="text-blue-500">🔍</span>
              <span>{personalInfo.title}</span>
            </div>
          )}
          {contacts.slice(0, 4).map((c, i) => (
            <div key={i} className="flex items-center gap-1 text-gray-700 pb-2">
              <span className="text-xs">{c.icon}</span>
              <span className="text-xs">{c.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search results + sidebar */}
      <div className="flex gap-6 px-6 pt-4">
        {/* Main results column */}
        <div className="flex-1 min-w-0">
          {/* Summary as top snippet */}
          {personalInfo.summary && (
            <div className="mb-5 text-sm text-gray-700 leading-relaxed border-l-2 border-blue-400 pl-3">
              <MarkdownText text={personalInfo.summary} />
            </div>
          )}
          {sectionOrder
            .filter(id => id !== 'personalInfo' && id !== 'skills' && !(styles.hiddenSections || []).includes(id))
            .map(id => (
              <div key={id}>{renderResults(id)}</div>
            ))}
        </div>

        {/* Right sidebar: Skills as Knowledge Panel */}
        {!(styles.hiddenSections || []).includes('skills') && skills.length > 0 && (
          <div className="w-52 shrink-0 border border-gray-200 rounded-xl overflow-hidden text-sm">
            <div className="px-4 py-3 font-semibold text-gray-800 text-base border-b border-gray-100">Skills:</div>
            {skills.map((skill) => (
              <div key={skill.id} className="px-4 py-2.5 border-b border-gray-100 last:border-b-0">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-medium text-sm">{skill.category}</span>
                  <span className="text-gray-400 text-xs">∨</span>
                </div>
                <div className="text-xs text-gray-600 mt-0.5 space-y-0.5">
                  {skill.skills.split(',').map((s, i) => (
                    <div key={i}>{s.trim()}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Google Footer pagination */}
      <div className="text-center py-4 pb-5 border-t border-gray-200 mt-4">
        <span className="text-blue-600 font-normal text-2xl tracking-wide">G</span>
        <span className="text-red-500 font-normal text-2xl">o</span>
        <span className="text-yellow-500 font-normal text-2xl">o</span>
        <span className="text-blue-600 font-normal text-2xl">g</span>
        <span className="text-green-600 font-normal text-2xl">l</span>
        <span className="text-red-500 font-normal text-2xl">e</span>
        <span className="text-gray-500 text-xs ml-2 tracking-widest">›</span>
        <div className="flex justify-center gap-4 mt-1 text-blue-600 text-sm">
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <span key={n} className={n === 1 ? 'font-bold text-base text-slate-900' : 'cursor-pointer hover:underline'}>{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---- FACEBOOK TEMPLATE ----
const FacebookTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects, customSections, sectionOrder, styles } = data;

  const contacts = [
    { icon: '📍', val: personalInfo.location },
    { icon: '📱', val: personalInfo.phone },
    { icon: '✉️', val: personalInfo.email },
    ...(personalInfo.customFields || []).map(f => ({ icon: '🔗', val: f.value })),
  ].filter(c => c.val);

  const PostCard: React.FC<{ icon: string; title: string; subtitle: string; date: string; body: React.ReactNode; }> = 
    ({ icon, title, subtitle, date, body }) => (
    <div className="bg-white rounded-lg border border-gray-200 mb-3 overflow-hidden print:break-inside-avoid">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
            {icon}
          </div>
          <div>
            <div className="font-semibold text-sm text-gray-900">{title}</div>
            <div className="text-xs text-gray-500">{subtitle} · <span className="text-gray-400">{date}</span></div>
          </div>
        </div>
        <div className="text-sm text-gray-700 leading-relaxed">{body}</div>
      </div>
      <div className="border-t border-gray-100 px-4 py-2 flex gap-4 text-xs text-gray-500">
        <button className="flex items-center gap-1 hover:text-blue-600">👍 Like</button>
        <button className="flex items-center gap-1 hover:text-blue-600">💬 Comment</button>
        <button className="flex items-center gap-1 hover:text-blue-600">↗ Share</button>
      </div>
    </div>
  );

  const renderFeedItem = (id: string) => {
    if ((styles.hiddenSections || []).includes(id)) return null;
    
    if (id === 'experience') return experience.map(exp => (
      <PostCard key={exp.id} icon="💼"
        title={exp.position} subtitle={`${exp.company} · ${exp.location}`}
        date={`${exp.startDate}–${exp.endDate}`}
        body={exp.description ? <MarkdownText text={exp.description} className="text-sm" /> : null}
      />
    ));
    
    if (id === 'projects') return projects.map(proj => (
      <PostCard key={proj.id} icon="🚀"
        title={proj.name} subtitle={proj.technologies || 'Personal Project'}
        date={proj.link || ''}
        body={proj.description ? <MarkdownText text={proj.description} className="text-sm" /> : null}
      />
    ));
    
    if (id === 'education') return education.map(edu => (
      <PostCard key={edu.id} icon="🎓"
        title={edu.degree} subtitle={`${edu.institution} · ${edu.location}`}
        date={`${edu.startDate}–${edu.endDate}`}
        body={edu.description}
      />
    ));
    
    const cs = customSections.find(s => s.id === id);
    if (cs) return cs.items.map(item => {
      const tf = cs.fields.find(f => f.type === 'title') || cs.fields[0];
      const df = cs.fields.filter(f => f.type === 'textarea');
      return (
        <PostCard key={item.id} icon="📌"
          title={tf ? item[tf.name] : cs.title} subtitle={cs.title} date=""
          body={df.map(f => item[f.name] ? <MarkdownText key={f.id} text={item[f.name]} className="text-sm" /> : null)}
        />
      );
    });
    return null;
  };

  return (
    <div className="resume-paper w-full bg-gray-100 font-sans" style={{ fontSize: '13px' }}>
      {/* Facebook Top Navbar */}
      <div className="bg-white border-b border-gray-300 px-4 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {/* Facebook logo F */}
          <svg className="h-8 w-8" viewBox="0 0 36 36" fill="url(#jsc_c_1)">
            <defs>
              <linearGradient x1="50%" x2="50%" y1="97.0782%" y2="0%" id="jsc_c_1">
                <stop offset="0%" stopColor="#0062E0" />
                <stop offset="100%" stopColor="#19AFFF" />
              </linearGradient>
            </defs>
            <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" fill="url(#jsc_c_1)" />
            <path d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z" fill="white" />
          </svg>
          <div className="bg-gray-100 rounded-full px-3 py-1.5 flex items-center gap-2 text-gray-500 text-sm w-44">
            <span>🔍</span>
            <span className="text-sm">{personalInfo.title || 'Job Title'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {personalInfo.photo ? (
            <img src={personalInfo.photo} className="w-8 h-8 rounded-full border border-gray-200 object-cover" alt="avatar" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">{personalInfo.name.charAt(0)}</div>
          )}
          <span className="font-semibold text-sm">{personalInfo.name.split(' ')[0]}</span>
          <span className="text-gray-500 text-xs">· {personalInfo.website || 'LinkedIn'}</span>
        </div>
      </div>

      {/* Two-column Facebook layout */}
      <div className="flex gap-3 p-3">
        {/* Left sidebar: Skills */}
        <div className="w-52 shrink-0 space-y-3">
          {!(styles.hiddenSections || []).includes('skills') && skills.map(skill => (
            <div key={skill.id} className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="font-semibold text-sm text-gray-800 mb-1">{skill.category}</div>
              <div className="text-xs text-gray-600 space-y-0.5">
                {skill.skills.split(',').map((s, i) => (
                  <div key={i}>{s.trim()}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main feed column */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Profile card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              {personalInfo.photo ? (
                <img src={personalInfo.photo} className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover" alt="avatar" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center text-2xl font-bold text-blue-600">{personalInfo.name.charAt(0)}</div>
              )}
              <div className="flex-1 bg-gray-100 rounded-full py-2.5 px-4 text-gray-500 text-sm">{personalInfo.name}</div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-600">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span>{c.icon}</span>
                  <span>{c.val}</span>
                </div>
              ))}
            </div>
            {personalInfo.summary && (
              <div className="mt-2 text-xs text-gray-600 leading-relaxed">
                <MarkdownText text={personalInfo.summary} />
              </div>
            )}
          </div>

          {/* Dynamic sections as posts */}
          {sectionOrder
            .filter(id => id !== 'personalInfo' && id !== 'skills')
            .map(id => <div key={id}>{renderFeedItem(id)}</div>)}
        </div>
      </div>
    </div>
  );
};
// ---- Main Router ----
export const FunBrand: React.FC<TemplateProps> = ({ data }) => {
  const templateId = data.styles.templateId;
  if (templateId === 'fun-google') return <GoogleTemplate data={data} />;
  if (templateId === 'fun-facebook') return <FacebookTemplate data={data} />;
  return <GoogleTemplate data={data} />;
};
