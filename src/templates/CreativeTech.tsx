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
  const { personalInfo, experience, education, skills, projects, customSections, sectionOrder, styles } = data;
  const { fontClass, sizeClass, leadingClass, marginClass, accentText, accentBgLight } = styleUtils;
  
  const templateId = styles.templateId;
  const isBoldBlock = templateId === 'creative-bold';
  const isSidebar = templateId === 'creative-sidebar';
  const isMinimalBorder = templateId === 'creative-minimal';

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
    if (isMinimalBorder) {
      return (
        <div className="flex items-center gap-2 mb-3 mt-1">
          <div className="w-1 h-3.5 rounded" style={{ backgroundColor: styleUtils.accentColor }} />
          <h2 className="font-bold text-xs uppercase tracking-wider text-gray-900">{title}</h2>
        </div>
      );
    }
    
    return (
      <div className="relative mb-3 mt-4">
        <h2 className={`font-bold text-xs uppercase tracking-wider text-gray-900 ${accentText}`}>
          {title}
        </h2>
        <div className="w-full h-0.5 mt-1 bg-gray-100">
          <div className="h-full w-12" style={{ backgroundColor: styleUtils.accentColor }} />
        </div>
      </div>
    );
  };

  const renderExperienceItems = () => (
    <div className="space-y-4">
      {experience.map((exp) => (
        <div key={exp.id} className="w-full print:break-inside-avoid experience-item">
          <div className="flex justify-between items-baseline font-bold text-xs text-gray-900">
            <span>{exp.position}</span>
            <span className="text-gray-500 font-normal text-[10px] whitespace-nowrap">{exp.startDate} – {exp.endDate}</span>
          </div>
          <div className="flex justify-between items-baseline text-[11px] font-medium text-gray-700 italic">
            <span>{exp.company}</span>
            <span className="font-normal not-italic text-[10px]">{exp.location}</span>
          </div>
          {exp.description && (
            <div className="mt-1.5 text-gray-850">
              <MarkdownText text={exp.description} className="text-xs text-justify" />
            </div>
          )}
          {exp.customFields && exp.customFields.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-500 font-medium">
              {exp.customFields.map((f, i) => f.name && f.value && (
                <span key={i}>
                  <span className="font-semibold text-gray-750">{f.name}:</span> {f.value}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderEducationItems = () => (
    <div className="space-y-3.5">
      {education.map((edu) => (
        <div key={edu.id} className="w-full print:break-inside-avoid education-item">
          <div className="flex justify-between items-baseline font-bold text-xs text-gray-900">
            <span>{edu.degree} in {edu.fieldOfStudy}</span>
            <span className="text-gray-500 font-normal text-[10px] whitespace-nowrap">{edu.startDate} – {edu.endDate}</span>
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
                  <span className="font-semibold text-gray-750">{f.name}:</span> {f.value}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkillsItems = () => (
    <div className="space-y-2.5">
      {skills.map((skill) => (
        <div key={skill.id} className="space-y-1">
          <div className="text-[11px] font-semibold text-gray-800 uppercase tracking-wide">{skill.category}</div>
          <div className="flex flex-wrap gap-1.5">
            {skill.skills.split(',').map((s, idx) => (
              <span 
                key={idx} 
                className={`text-[10px] font-medium px-2.5 py-0.5 rounded-md border border-gray-100 ${accentBgLight} ${accentText} print:bg-gray-100 print:text-black print:border-gray-300`}
              >
                {s.trim()}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderProjectsItems = () => (
    <div className="space-y-4">
      {projects.map((proj) => (
        <div key={proj.id} className="w-full space-y-1 print:break-inside-avoid project-item">
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
                  <span className="font-semibold text-gray-750">{f.name}:</span> {f.value}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderCustomSectionItems = (section: CustomSection) => {
    const titleField = section.fields.find(f => f.type === 'title') || section.fields[0];
    const dateField = section.fields.find(f => f.type === 'date');
    const descriptionFields = section.fields.filter(f => f.type === 'textarea');
    
    const metaFields = section.fields.filter(f => 
      f.id !== titleField?.id && 
      f.id !== dateField?.id && 
      f.type !== 'textarea'
    );

    return (
      <div className="space-y-4">
        {section.items.map((item) => {
          const titleVal = titleField ? item[titleField.name] : '';
          const dateVal = dateField ? item[dateField.name] : '';

          return (
            <div key={item.id} className="w-full space-y-0.5 print:break-inside-avoid custom-item">
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
                        <a key={f.id} href={val} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-650">
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
    );
  };

  const renderSection = (id: string) => {
    let title = '';
    let content: React.ReactNode = null;

    if (id === 'experience') {
      title = 'Professional Experience';
      content = renderExperienceItems();
    } else if (id === 'education') {
      title = 'Education';
      content = renderEducationItems();
    } else if (id === 'skills') {
      title = 'Tech Stack & Skills';
      content = renderSkillsItems();
    } else if (id === 'projects') {
      title = 'Projects';
      content = renderProjectsItems();
    } else {
      const cs = customSections.find(s => s.id === id);
      if (cs) {
        title = cs.title;
        content = renderCustomSectionItems(cs);
      }
    }

    if (!content) return null;

    if (isMinimalBorder) {
      return (
        <div key={id} className="w-full border border-slate-150 rounded-xl p-4 bg-white shadow-sm print:break-inside-avoid">
          {renderSectionHeader(title)}
          <div className="mt-2">
            {content}
          </div>
        </div>
      );
    }

    // Default layout style
    return (
      <div key={id} className="w-full">
        {renderSectionHeader(title)}
        <div className="mt-2">
          {content}
        </div>
      </div>
    );
  };

  if (isBoldBlock) {
    // Bold modern colorblock layout (colored background banner & left column)
    return (
      <div className={`resume-paper w-full bg-white text-gray-900 shadow-lg ${fontClass} ${sizeClass} ${leadingClass}`}>
        {/* Header Block Banner */}
        <div className="text-white px-8 py-6 flex flex-row justify-between items-center gap-4 border-b-4" style={{ background: `linear-gradient(135deg, #1e293b, ${styleUtils.accentColor})`, borderBottomColor: styleUtils.accentColor }}>
          <div className="flex flex-row items-center gap-4 text-left flex-1">
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
          <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-xs text-slate-300">
            {allContacts.map((contact, idx) => (
              <span key={idx} className="whitespace-nowrap">{contact}</span>
            ))}
          </div>
        </div>

        {/* Colorblock Body Grid */}
        <div className="grid grid-cols-12 min-h-[700px]">
          {/* Left Colored Sidebar Panel */}
          <div className={`col-span-4 p-5 ${accentBgLight} border-r border-slate-100 flex flex-col space-y-5`}>
            {personalInfo.summary && (
              <div className="space-y-2">
                <h3 className="font-bold text-[10px] uppercase tracking-wider text-slate-500">Profile Summary</h3>
                <MarkdownText text={personalInfo.summary} className="text-xs text-gray-700 leading-relaxed text-justify" />
              </div>
            )}
            {/* Find and render skills in sidebar */}
            {sectionOrder.includes('skills') && !(styles.hiddenSections || []).includes('skills') && (
              <div className="space-y-2">
                <h3 className="font-bold text-[10px] uppercase tracking-wider text-slate-500">Core Expertise</h3>
                {renderSkillsItems()}
              </div>
            )}
          </div>

          {/* Right Main Content Panel */}
          <div className="col-span-8 p-6 space-y-5 bg-white">
            {sectionOrder
              .filter(id => id !== 'personalInfo' && id !== 'skills' && !(styles.hiddenSections || []).includes(id))
              .map(id => renderSection(id))}
          </div>
        </div>
      </div>
    );
  }

  if (isSidebar) {
    // Printer-friendly Split Sidebar layout (White background, no solid block ink)
    return (
      <div className={`resume-paper w-full bg-white text-gray-900 shadow-lg ${fontClass} ${sizeClass} ${leadingClass} ${marginClass}`}>
        {/* Profile Header */}
        <div className="flex flex-row justify-between items-center gap-4 border-b pb-4 mb-4" style={{ borderBottomColor: styleUtils.accentColor }}>
          <div className="flex flex-row items-center gap-4 text-left flex-1">
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
          <div className="flex flex-col items-end gap-1 text-xs text-gray-600 print:text-black">
            {allContacts.map((contact, idx) => (
              <span key={idx} className="whitespace-nowrap">{contact}</span>
            ))}
          </div>
        </div>

        {/* Split Body Grid */}
        <div className="grid grid-cols-12 gap-5 mt-2">
          {/* Left Column (Width 4/12) */}
          <div className="col-span-4 border-r border-slate-100 pr-4 flex flex-col space-y-4">
            {personalInfo.summary && (
              <div className="space-y-1">
                <h3 className={`font-bold text-[10px] uppercase tracking-wider ${accentText}`}>Summary</h3>
                <div className="h-0.5 bg-gray-100 w-full mb-2">
                  <div className="h-full w-8" style={{ backgroundColor: styleUtils.accentColor }} />
                </div>
                <MarkdownText text={personalInfo.summary} className="text-xs text-gray-700 leading-relaxed text-justify" />
              </div>
            )}
            {/* Core Skills section inside sidebar */}
            {sectionOrder.includes('skills') && !(styles.hiddenSections || []).includes('skills') && (
              <div className="space-y-1">
                <h3 className={`font-bold text-[10px] uppercase tracking-wider ${accentText}`}>Core Skills</h3>
                <div className="h-0.5 bg-gray-100 w-full mb-2">
                  <div className="h-full w-8" style={{ backgroundColor: styleUtils.accentColor }} />
                </div>
                {renderSkillsItems()}
              </div>
            )}
          </div>

          {/* Right Column (Width 8/12) */}
          <div className="col-span-8 space-y-4">
            {sectionOrder
              .filter(id => id !== 'personalInfo' && id !== 'skills' && !(styles.hiddenSections || []).includes(id))
              .map(id => renderSection(id))}
          </div>
        </div>
      </div>
    );
  }

  // Minimal Border or Fallback layouts
  return (
    <div className={`resume-paper w-full bg-white text-gray-900 shadow-lg ${fontClass} ${sizeClass} ${leadingClass} ${marginClass}`}>
      {/* Profile Header */}
      <div className="flex flex-row justify-between items-center gap-4 border-b-2 pb-4 mb-4" style={{ borderBottomColor: styleUtils.accentColor }}>
        <div className="flex flex-row items-center gap-4 text-left flex-1">
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
        <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-xs text-gray-600 print:text-black">
          {allContacts.map((contact, idx) => (
            <span key={idx} className="whitespace-nowrap">{contact}</span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="text-xs text-gray-700 leading-relaxed text-justify mt-2 mb-4">
          <MarkdownText text={personalInfo.summary} />
        </div>
      )}

      {/* Body Blocks */}
      <div className={isMinimalBorder ? "grid grid-cols-2 gap-4 mt-2" : "space-y-4 mt-2"}>
        {sectionOrder
          .filter(id => id !== 'personalInfo' && !(styles.hiddenSections || []).includes(id))
          .map(id => {
            const isFullWidth = isMinimalBorder && (id === 'experience' || id === 'education');
            return (
              <div key={id} className={isFullWidth ? "col-span-2" : ""}>
                {renderSection(id)}
              </div>
            );
          })}
      </div>
    </div>
  );
};
