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

export const CreativeTech: React.FC<TemplateProps> = ({ data, styleUtils }) => {
  const { personalInfo, experience, education, skills, projects, customSections, sectionOrder } = data;
  const { fontClass, sizeClass, leadingClass, marginClass, accentText, accentBgLight } = styleUtils;
  
  const templateId = data.styles.templateId;
  const isTopBlock = templateId === 'creative-top';
  const isGrid = templateId === 'creative-grid';

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
    if (isGrid) {
      return (
        <div className="flex items-center gap-2 mb-3 mt-4">
          <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: styleUtils.accentColor }} />
          <h2 className="font-bold text-xs uppercase tracking-wider text-gray-900">{title}</h2>
        </div>
      );
    }
    
    return (
      <div className="relative mb-3 mt-5">
        <h2 className={`font-bold text-xs uppercase tracking-wider text-gray-900 ${accentText}`}>
          {title}
        </h2>
        <div className={`w-full h-0.5 mt-1 bg-gray-100`}>
          <div className={`h-full w-12`} style={{ backgroundColor: styleUtils.accentColor }} />
        </div>
      </div>
    );
  };

  const renderExperience = () => (
    <div key="experience" className={`w-full ${isGrid ? 'bg-slate-50/50 border border-slate-100 rounded-xl p-4' : ''}`}>
      {renderSectionHeader('Professional Experience')}
      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp.id} className="w-full relative pl-4 border-l border-gray-150">
            {/* Dot marker on timeline */}
            <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: styleUtils.accentColor }} />
            
            <div className="flex justify-between items-baseline font-bold text-xs text-gray-900">
              <span>{exp.position}</span>
              <span className="text-gray-500 font-normal text-[10px]">{exp.startDate} – {exp.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline text-[11px] font-medium text-gray-700 italic">
              <span>{exp.company}</span>
              <span className="font-normal not-italic text-[10px]">{exp.location}</span>
            </div>
            {exp.description && (
              <div className="mt-1.5 text-gray-800">
                <MarkdownText text={exp.description} className="text-xs text-justify" />
              </div>
            )}
            {exp.customFields && exp.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-500 font-medium">
                {exp.customFields.map((f, i) => f.name && f.value && (
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

  const renderEducation = () => (
    <div key="education" className={`w-full ${isGrid ? 'bg-slate-50/50 border border-slate-100 rounded-xl p-4' : ''}`}>
      {renderSectionHeader('Education')}
      <div className="space-y-3.5">
        {education.map((edu) => (
          <div key={edu.id} className="w-full pl-4 border-l border-gray-150 relative">
            <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full border border-white bg-gray-400" />
            <div className="flex justify-between items-baseline font-bold text-xs text-gray-900">
              <span>{edu.degree} in {edu.fieldOfStudy}</span>
              <span className="text-gray-500 font-normal text-[10px]">{edu.startDate} – {edu.endDate}</span>
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
    <div key="skills" className={`w-full ${isGrid ? 'bg-slate-50/50 border border-slate-100 rounded-xl p-4' : ''}`}>
      {renderSectionHeader('Tech Stack & Skills')}
      <div className="space-y-2.5">
        {skills.map((skill) => (
          <div key={skill.id} className="space-y-1">
            <div className="text-[11px] font-semibold text-gray-800 uppercase tracking-wide">{skill.category}</div>
            <div className="flex flex-wrap gap-1.5">
              {skill.skills.split(',').map((s, idx) => (
                <span 
                  key={idx} 
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md border border-gray-100 ${accentBgLight} ${accentText} print:bg-gray-100 print:text-black print:border-gray-300`}
                >
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div key="projects" className={`w-full ${isGrid ? 'bg-slate-50/50 border border-slate-100 rounded-xl p-4' : ''}`}>
      {renderSectionHeader('Projects')}
      <div className="space-y-4">
        {projects.map((proj) => (
          <div key={proj.id} className="w-full space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-xs text-gray-900 flex items-center gap-2">
                {proj.name}
                {proj.technologies && (
                  <span className="font-mono font-normal text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
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

  const renderCustomSection = (section: CustomSection) => (
    <div key={section.id} className={`w-full ${isGrid ? 'bg-slate-50/50 border border-slate-100 rounded-xl p-4' : ''}`}>
      {renderSectionHeader(section.title)}
      <div className="space-y-4">
        {section.items.map((item) => {
          const titleVal = item.title || item.name || Object.values(item)[1] || '';
          const dateVal = item.date || item.year || '';
          const orgVal = item.org || item.publisher || item.subtitle || '';
          const descVal = item.desc || item.description || item.details || '';

          return (
            <div key={item.id} className="w-full space-y-0.5 pl-4 border-l border-gray-150 relative">
              <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full border border-white bg-gray-400" />
              <div className="flex justify-between items-baseline font-bold text-xs text-gray-900">
                <span>{titleVal}</span>
                {dateVal && <span className="text-gray-500 font-normal text-[10px]">{dateVal}</span>}
              </div>
              {orgVal && <div className="text-[11px] text-gray-700 font-medium">{orgVal}</div>}
              {descVal && (
                <div className="text-gray-800 mt-1">
                  <MarkdownText text={descVal} className="text-xs text-justify" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSection = (id: string) => {
    if (id === 'experience') return renderExperience();
    if (id === 'education') return renderEducation();
    if (id === 'skills') return renderSkills();
    if (id === 'projects') return renderProjects();
    
    const customSec = customSections.find(s => s.id === id);
    if (customSec) return renderCustomSection(customSec);
    return null;
  };

  return (
    <div className={`resume-paper w-full bg-white text-gray-900 shadow-lg ${fontClass} ${sizeClass} ${leadingClass} ${isTopBlock ? '' : marginClass}`}>
      {/* Top Banner layout */}
      {isTopBlock ? (
        <div className="text-white px-8 py-6 border-b-4 flex flex-col md:flex-row justify-between items-center gap-4" style={{ background: `linear-gradient(135deg, #1e293b, ${styleUtils.accentColor})`, borderBottomColor: styleUtils.accentColor }}>
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left flex-1">
            {personalInfo.photo && (
              <img src={personalInfo.photo} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-white/25 object-cover shrink-0" />
            )}
            <div className="space-y-0.5">
              <h1 className="text-3xl font-extrabold tracking-tight">{personalInfo.name}</h1>
              {personalInfo.title && (
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-200">{personalInfo.title}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-1 text-xs text-slate-300">
            {allContacts.map((contact, idx) => (
              <span key={idx} className="whitespace-nowrap">{contact}</span>
            ))}
          </div>
        </div>
      ) : (
        /* Regular Accent Header */
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 pb-4 mb-4" style={{ borderBottomColor: styleUtils.accentColor }}>
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left flex-1">
            {personalInfo.photo && (
              <img src={personalInfo.photo} alt="Avatar" className="w-16 h-16 rounded-full border border-gray-250 object-cover shrink-0" />
            )}
            <div className="space-y-0.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{personalInfo.name}</h1>
              {personalInfo.title && (
                <p className={`text-xs font-semibold uppercase tracking-wider ${accentText}`}>{personalInfo.title}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-3 gap-y-1 text-xs text-gray-600 print:text-black">
            {allContacts.map((contact, idx) => (
              <span key={idx} className="whitespace-nowrap">{contact}</span>
            ))}
          </div>
        </div>
      )}

      {/* Body content wrapper */}
      <div className={`space-y-4 ${isTopBlock ? marginClass + ' pt-2' : ''}`}>
        
        {/* Summary paragraph */}
        {personalInfo.summary && (
          <div className="text-xs text-gray-700 leading-relaxed text-justify mt-2">
            <MarkdownText text={personalInfo.summary} />
          </div>
        )}

        {/* Dynamic section loops (reordered by drag and drop) */}
        <div className={isGrid ? "grid grid-cols-1 md:grid-cols-2 gap-4 mt-2" : "space-y-4 mt-2"}>
          {sectionOrder
            .filter(id => id !== 'personalInfo')
            .map(id => {
              const element = renderSection(id);
              if (!element) return null;
              
              // In grid mode, we span experience/education/projects to full width,
              // while skills and custom items can be packed side by side if desired.
              // To make it look perfect, let's keep full columns for items if they aren't grid-able.
              const isFullWidth = isGrid && (id === 'experience' || id === 'education');
              return (
                <div key={id} className={isFullWidth ? "md:col-span-2" : ""}>
                  {element}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
