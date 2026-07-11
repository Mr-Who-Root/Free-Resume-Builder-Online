import React from 'react';
import type { ResumeData, CustomSection } from '../types/resume';
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

export const FunkyGamer: React.FC<TemplateProps> = ({ data, styleUtils }) => {
  const { personalInfo, experience, education, skills, projects, customSections, sectionOrder, styles } = data;
  const { sizeClass, leadingClass, marginClass } = styleUtils;
  
  const templateId = styles.templateId;
  const isArcade = templateId === 'gamer-arcade';
  const isCyber = templateId === 'gamer-cyberpunk';
  const isComic = templateId === 'gamer-comic';

  // Force fonts for distinct gaming/funky styles
  const gamerFontClass = isArcade 
    ? 'font-mono' 
    : isCyber 
      ? 'font-mono tracking-tight' 
      : 'font-sans'; // Comic pop uses styled heavy sans

  const contacts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.website,
    personalInfo.location,
  ].filter(Boolean);

  const customContacts = personalInfo.customFields 
    ? personalInfo.customFields.map(f => f.value).filter(Boolean) 
    : [];
  const allContacts = [...contacts, ...customContacts];

  const renderSectionHeader = (title: string) => {
    if (isArcade) {
      return (
        <div className="mb-4 mt-3 bg-slate-950 text-white p-2 border-2 border-black flex justify-between items-center shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          <span className="font-bold text-xs tracking-widest uppercase">:: {title} ::</span>
          <span className="text-[9px] text-green-400">READY_</span>
        </div>
      );
    }
    
    if (isCyber) {
      return (
        <div className="mb-3 mt-4 border-b border-dashed flex justify-between items-baseline" style={{ borderColor: styleUtils.accentColor }}>
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900" style={{ color: styleUtils.accentColor }}>
            $ cat /var/log/{title.toLowerCase().replace(/\s+/g, '_')}
          </h2>
          <span className="text-[8px] text-slate-400">SECURE_LINK //</span>
        </div>
      );
    }

    // Comic Pop Neobrutalism Style
    return (
      <div className="inline-block bg-yellow-300 text-slate-950 px-3 py-1.5 mb-4 mt-3 border-2 border-slate-950 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_rgba(0,0,0,1)] transform -rotate-1">
        {title}
      </div>
    );
  };

  const renderExperience = () => (
    <div key="experience" className="w-full">
      {renderSectionHeader('Professional Experience')}
      <div className="space-y-4">
        {experience.map((exp) => (
          <div 
            key={exp.id} 
            className={`w-full print:break-inside-avoid ${
              isComic 
                ? 'border-2 border-slate-950 p-4 rounded-xl bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)] mb-1' 
                : isArcade 
                  ? 'border-l-2 border-black pl-3 py-1 mb-2' 
                  : 'relative pl-4 border-l border-slate-200 py-1'
            }`}
          >
            {isCyber && (
              <div className="absolute -left-[4.5px] top-2.5 w-2 h-2 rounded-none border" style={{ backgroundColor: styleUtils.accentColor, borderColor: styleUtils.accentColor }} />
            )}
            
            <div className="flex justify-between items-baseline font-bold text-xs text-gray-900">
              <span className={isComic ? 'font-black text-sm' : ''}>
                {isArcade && '> '}{exp.position}
              </span>
              <span className="text-gray-500 font-normal text-[10px] whitespace-nowrap">
                {isArcade && '['}{exp.startDate} – {exp.endDate}{isArcade && ']'}
              </span>
            </div>
            
            <div className="flex justify-between items-baseline text-[11px] font-medium text-gray-700 italic">
              <span>{exp.company}</span>
              <span className="font-normal not-italic text-[10px]">{exp.location}</span>
            </div>

            {exp.description && (
              <div className={`mt-1.5 text-gray-800 ${isArcade ? 'text-xs' : ''}`}>
                <MarkdownText text={exp.description} className="text-xs text-justify" />
              </div>
            )}

            {exp.customFields && exp.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[10px] text-gray-500 font-medium">
                {exp.customFields.map((f, i) => f.name && f.value && (
                  <span key={i} className={isArcade ? 'text-xs font-mono' : ''}>
                    <span className="font-semibold text-gray-700">{f.name}:</span> {f.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div key="education" className="w-full">
      {renderSectionHeader('Education')}
      <div className="space-y-3.5">
        {education.map((edu) => (
          <div 
            key={edu.id} 
            className={`w-full print:break-inside-avoid ${
              isComic 
                ? 'border-2 border-slate-950 p-4 rounded-xl bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)]' 
                : isArcade 
                  ? 'border-l-2 border-black pl-3 py-1' 
                  : 'relative pl-4 border-l border-slate-200 py-1'
            }`}
          >
            {isCyber && (
              <div className="absolute -left-[4.5px] top-2.5 w-2 h-2 rounded-none border border-slate-400 bg-slate-300" />
            )}
            
            <div className="flex justify-between items-baseline font-bold text-xs text-gray-900">
              <span className={isComic ? 'font-black' : ''}>
                {isArcade && '> '}{edu.degree}
              </span>
              <span className="text-gray-500 font-normal text-[10px] whitespace-nowrap">
                {isArcade && '['}{edu.startDate} – {edu.endDate}{isArcade && ']'}
              </span>
            </div>
            
            <div className="flex justify-between items-baseline text-[11px] font-medium text-gray-700">
              <span>{edu.institution}</span>
              <span className="font-normal italic text-[10px]">{edu.location}</span>
            </div>

            {edu.description && (
              <p className="text-xs text-gray-600 mt-1">{edu.description}</p>
            )}

            {edu.customFields && edu.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-500 font-medium">
                {edu.customFields.map((f, i) => f.name && f.value && (
                  <span key={i}>
                    <span className="font-semibold text-gray-700">{f.name}:</span> {f.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div key="skills" className="w-full">
      {renderSectionHeader('Tech Stack & Skills')}
      <div className={isComic ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
        {skills.map((skill) => (
          <div 
            key={skill.id} 
            className={`space-y-1.5 ${
              isComic 
                ? 'border-2 border-slate-950 p-3 rounded-lg bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                : isArcade 
                  ? 'bg-slate-50 border border-slate-200 p-2 font-mono' 
                  : ''
            }`}
          >
            <div className={`text-[11px] font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5`}>
              {isArcade && <span className="text-indigo-600">[SKL]</span>}
              {isCyber && <span className="text-emerald-600">::</span>}
              <span>{skill.category}</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {skill.skills.split(',').map((s, idx) => {
                if (isArcade) {
                  return (
                    <span key={idx} className="text-[10px] font-mono border-2 border-black bg-white px-2 py-0.5 text-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                      + {s.trim()}
                    </span>
                  );
                }
                
                if (isCyber) {
                  return (
                    <span key={idx} className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">
                      &gt; {s.trim()}
                    </span>
                  );
                }

                // Comic Pop
                return (
                  <span key={idx} className="text-[10px] font-bold px-2.5 py-1 rounded-full border-2 border-slate-950 bg-sky-200 text-slate-950 shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:bg-sky-300 transition cursor-default">
                    {s.trim()}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div key="projects" className="w-full">
      {renderSectionHeader('Projects')}
      <div className="space-y-4">
        {projects.map((proj) => (
          <div 
            key={proj.id} 
            className={`w-full print:break-inside-avoid ${
              isComic 
                ? 'border-2 border-slate-950 p-4 rounded-xl bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)]' 
                : ''
            }`}
          >
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-xs text-gray-900 flex flex-wrap items-center gap-2">
                <span>{isArcade && '[PROJ] '}{proj.name}</span>
                {proj.technologies && (
                  <span className={`font-mono font-normal text-[9px] px-1.5 py-0.5 rounded ${
                    isComic 
                      ? 'border border-slate-900 bg-amber-200 text-slate-900 font-bold' 
                      : 'bg-slate-100 text-gray-600'
                  }`}>
                    {proj.technologies}
                  </span>
                )}
              </span>
              {proj.link && (
                <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline print:text-inherit">
                  {proj.link}
                </a>
              )}
            </div>
            
            {proj.description && (
              <div className="text-gray-800 mt-1">
                <MarkdownText text={proj.description} className="text-xs text-justify" />
              </div>
            )}

            {proj.customFields && proj.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-500 font-medium">
                {proj.customFields.map((f, i) => f.name && f.value && (
                  <span key={i}>
                    <span className="font-semibold text-gray-700">{f.name}:</span> {f.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomSection = (section: CustomSection) => {
    const titleField = section.fields.find(f => f.type === 'title') || section.fields[0];
    const dateField = section.fields.find(f => f.type === 'date');
    const descriptionFields = section.fields.filter(f => f.type === 'textarea');
    
    const metaFields = section.fields.filter(f => 
      f.id !== titleField?.id && 
      f.id !== dateField?.id && 
      f.type !== 'textarea'
    );

    return (
      <div key={section.id} className="w-full">
        {renderSectionHeader(section.title)}
        <div className="space-y-4">
          {section.items.map((item) => {
            const titleVal = titleField ? item[titleField.name] : '';
            const dateVal = dateField ? item[dateField.name] : '';

            return (
              <div 
                key={item.id} 
                className={`w-full space-y-0.5 print:break-inside-avoid ${
                  isComic 
                    ? 'border-2 border-slate-950 p-4 rounded-xl bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)]' 
                    : ''
                }`}
              >
                <div className="flex justify-between items-baseline font-bold text-xs text-gray-900">
                  <span>{titleVal}</span>
                  {dateVal && <span className="text-gray-600 font-normal text-[10px] whitespace-nowrap">{dateVal}</span>}
                </div>
                
                {metaFields.length > 0 && (
                  <div className="text-xs text-gray-700 flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    {metaFields.map(f => {
                      const val = item[f.name];
                      if (!val) return null;
                      if (/^https?:\/\//i.test(val)) {
                        return (
                          <a key={f.id} href={val} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-600">
                            {f.label}: {val}
                          </a>
                        );
                      }
                      return (
                        <span key={f.id}>
                          <span className="font-semibold">{f.label}:</span> {val}
                        </span>
                      );
                    })}
                  </div>
                )}

                {descriptionFields.map(f => {
                  const val = item[f.name];
                  if (!val) return null;
                  return (
                    <div key={f.id} className="text-gray-850 mt-1">
                      <MarkdownText text={val} className="text-xs text-justify" />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSection = (id: string) => {
    if (id === 'experience') return renderExperience();
    if (id === 'education') return renderEducation();
    if (id === 'skills') return renderSkills();
    if (id === 'projects') return renderProjects();
    
    const cs = customSections.find(s => s.id === id);
    if (cs) return renderCustomSection(cs);
    return null;
  };

  // Outer panel border theme
  const wrapperBorderClass = isComic 
    ? 'border-4 border-slate-950 p-8 shadow-[6px_6px_0px_0px_rgba(2,6,23,1)] m-2' 
    : isArcade 
      ? 'border-4 border-black p-6 m-2 shadow-[4px_4px_0px_rgba(0,0,0,1)]' 
      : 'p-6';

  // Return full paper layout
  return (
    <div className={`resume-paper w-full bg-white text-gray-900 shadow-xl ${gamerFontClass} ${sizeClass} ${leadingClass} ${marginClass}`}>
      <div className={wrapperBorderClass}>
        
        {/* Header Block */}
        <div className={`w-full pb-4 mb-4 ${
          isComic 
            ? 'border-b-4 border-slate-950 flex flex-row justify-between items-center gap-4' 
            : isArcade 
              ? 'border-b-4 border-black border-double pb-5 flex flex-row justify-between items-center gap-4' 
              : 'border-b border-dashed border-slate-200 flex flex-row justify-between items-center gap-4'
        }`}>
          <div className="flex flex-row items-center gap-4 text-left flex-1">
            {personalInfo.photo && (
              <img 
                src={personalInfo.photo} 
                alt="Avatar" 
                className={`w-16 h-16 object-cover shrink-0 ${
                  isComic 
                    ? 'border-2 border-slate-950 rounded-2xl shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                    : isArcade 
                      ? 'border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                      : 'rounded-full border border-slate-200'
                }`} 
              />
            )}
            <div className="space-y-0.5">
              <h1 className={`text-gray-900 tracking-tight ${
                isComic 
                  ? 'text-3xl font-black uppercase italic text-shadow-sm' 
                  : isArcade 
                    ? 'text-2xl font-extrabold uppercase font-mono' 
                    : 'text-3xl font-bold font-mono tracking-widest uppercase'
              }`}>
                {personalInfo.name}
              </h1>
              {personalInfo.title && (
                <p className={`text-xs font-semibold uppercase tracking-wider ${
                  isComic 
                    ? 'text-slate-900 font-extrabold underline' 
                    : isArcade 
                      ? 'text-indigo-600 font-mono' 
                      : 'text-emerald-600 font-mono'
                }`}>
                  {isArcade && '[LVL.99] '}{personalInfo.title}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 text-[11px] text-gray-600 print:text-black">
            {allContacts.map((contact, idx) => (
              <span 
                key={idx} 
                className={`whitespace-nowrap ${
                  isComic 
                    ? 'font-bold bg-pink-100 border border-slate-950 px-2 py-0.5 rounded shadow-[1px_1px_0px_rgba(0,0,0,1)] text-[10px]' 
                    : isArcade 
                      ? 'font-mono text-xs bg-slate-50 border border-slate-200 px-1 py-0.5' 
                      : 'font-mono'
                }`}
              >
                {isCyber && '> '}{contact}
              </span>
            ))}
          </div>
        </div>

        {/* Profile Summary */}
        {personalInfo.summary && (
          <div className={`text-xs text-gray-700 leading-relaxed text-justify mb-5 ${
            isComic 
              ? 'border-2 border-slate-950 p-4 rounded-xl bg-yellow-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] font-medium' 
              : isArcade 
                ? 'bg-slate-50 border border-slate-200 p-3 font-mono text-xs' 
                : 'border-l border-slate-200 pl-4 italic text-slate-650'
          }`}>
            {isArcade && <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">// SUB_ROUTINE: PROFILE</div>}
            <MarkdownText text={personalInfo.summary} />
          </div>
        )}

        {/* Dynamic section loops (reordered by drag and drop) */}
        <div className="space-y-4">
          {sectionOrder
            .filter(id => id !== 'personalInfo' && !(styles.hiddenSections || []).includes(id))
            .map(id => renderSection(id))}
        </div>
      </div>
    </div>
  );
};
