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
  };
}

export const ModernSplit: React.FC<TemplateProps> = ({ data, styleUtils }) => {
  const { personalInfo, experience, education, skills, projects, customSections, sectionOrder } = data;
  const { fontClass, sizeClass, leadingClass, accentColor } = styleUtils;
  
  const templateId = data.styles.templateId;
  const isRightSidebar = templateId === 'split-right';
  const isCompact = templateId === 'split-compact';

  const contacts = [
    { label: 'Email', val: personalInfo.email },
    { label: 'Phone', val: personalInfo.phone },
    { label: 'Link', val: personalInfo.website },
    { label: 'Location', val: personalInfo.location }
  ].filter(c => c.val);

  const customContacts = personalInfo.customFields 
    ? personalInfo.customFields.map(f => ({ label: f.name, val: f.value })) 
    : [];
  const allContacts = [...contacts, ...customContacts];

  // Divide sections into Sidebar and Main Body
  // Sidebar: skills + customSections
  // Main Body: experience + education + projects
  const sidebarSectionIds = ['skills', ...customSections.map(c => c.id)];
  const mainSectionIds = ['experience', 'education', 'projects'];

  // Respect the overall sectionOrder by sorting based on their index in sectionOrder
  const sortedSidebarIds = sidebarSectionIds.filter(id => sectionOrder.includes(id))
    .sort((a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b));
    
  const sortedMainIds = mainSectionIds.filter(id => sectionOrder.includes(id))
    .sort((a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b));

  const renderSectionHeader = (title: string, onDark: boolean = false) => (
    <h2 className={`font-bold text-xs tracking-wider uppercase border-b pb-1 mb-2.5 ${
      onDark 
        ? 'border-gray-200/20 text-white' 
        : 'border-gray-200 text-gray-900'
    }`}>
      {title}
    </h2>
  );

  const renderExperience = () => (
    <div key="experience" className="w-full">
      {renderSectionHeader('Professional Experience')}
      <div className="space-y-3.5">
        {experience.map((exp) => (
          <div key={exp.id} className="w-full">
            <div className="flex justify-between items-baseline font-semibold text-xs text-gray-900">
              <span>{exp.position}</span>
              <span className="text-gray-500 font-normal text-[10px] whitespace-nowrap">{exp.startDate} – {exp.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline text-[11px] text-gray-700 italic">
              <span>{exp.company}</span>
              <span className="font-normal not-italic text-[10px]">{exp.location}</span>
            </div>
            {exp.description && (
              <div className="mt-1">
                <MarkdownText text={exp.description} className="text-[11px] leading-normal text-gray-800" />
              </div>
            )}
            {exp.customFields && exp.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[9px] text-gray-500 font-medium">
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
    <div key="education" className="w-full">
      {renderSectionHeader('Education')}
      <div className="space-y-2.5">
        {education.map((edu) => (
          <div key={edu.id} className="w-full">
            <div className="flex justify-between items-baseline font-semibold text-xs text-gray-900">
              <span>{edu.degree}</span>
              <span className="text-gray-500 font-normal text-[10px]">{edu.startDate} – {edu.endDate}</span>
            </div>
            <div className="text-[11px] text-gray-700 italic">{edu.institution}</div>
            {edu.description && (
              <p className="text-[11px] text-gray-600 mt-0.5">{edu.description}</p>
            )}
            {edu.customFields && edu.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[9px] text-gray-500 font-medium">
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

  const renderProjects = () => (
    <div key="projects" className="w-full">
      {renderSectionHeader('Projects')}
      <div className="space-y-3">
        {projects.map((proj) => (
          <div key={proj.id} className="w-full">
            <div className="flex justify-between items-baseline font-semibold text-xs text-gray-900">
              <span>{proj.name}</span>
              {proj.link && (
                <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 font-normal hover:underline print:text-inherit">
                  {proj.link}
                </a>
              )}
            </div>
            {proj.technologies && (
              <div className="text-[10px] font-mono text-gray-500 italic mt-0.5">{proj.technologies}</div>
            )}
            {proj.description && (
              <div className="mt-1">
                <MarkdownText text={proj.description} className="text-[11px] text-gray-800" />
              </div>
            )}
            {proj.customFields && proj.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[9px] text-gray-500 font-medium">
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

  const renderSkills = (onDark: boolean = false) => (
    <div key="skills" className="w-full">
      {renderSectionHeader('Technical Skills', onDark)}
      <div className="space-y-2 text-[11px]">
        {skills.map((skill) => (
          <div key={skill.id} className="space-y-0.5">
            <div className={`font-semibold ${onDark ? 'text-gray-200' : 'text-gray-900'}`}>{skill.category}</div>
            <div className={`${onDark ? 'text-gray-300' : 'text-gray-700'}`}>{skill.skills}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomSection = (section: CustomSection, onDark: boolean = false) => (
    <div key={section.id} className="w-full">
      {renderSectionHeader(section.title, onDark)}
      <div className="space-y-3">
        {section.items.map((item) => {
          const titleField = section.fields.find(f => f.type === 'title') || section.fields[0];
          const dateField = section.fields.find(f => f.type === 'date');
          const descriptionFields = section.fields.filter(f => f.type === 'textarea');
          
          const metaFields = section.fields.filter(f => 
            f.id !== titleField?.id && 
            f.id !== dateField?.id && 
            f.type !== 'textarea'
          );

          const titleVal = titleField ? item[titleField.name] : '';
          const dateVal = dateField ? item[dateField.name] : '';

          return (
            <div key={item.id} className="space-y-0.5 text-[11px]">
              <div className={`font-semibold ${onDark ? 'text-white' : 'text-gray-900'} flex justify-between gap-1`}>
                <span>{titleVal}</span>
                {dateVal && <span className={`${onDark ? 'text-gray-400' : 'text-gray-500'} font-normal text-[9px]`}>{dateVal}</span>}
              </div>
              
              {metaFields.length > 0 && (
                <div className={`text-[10px] flex flex-wrap gap-x-2.5 gap-y-0.5 mt-0.5 ${onDark ? 'text-gray-300' : 'text-gray-650'}`}>
                  {metaFields.map(f => {
                    const val = item[f.name];
                    if (!val) return null;
                    if (/^https?:\/\//i.test(val)) {
                      return (
                        <a key={f.id} href={val} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-400">
                          {f.label}: {val}
                        </a>
                      );
                    }
                    return (
                      <span key={f.id}>
                        <span className="font-medium">{f.label}:</span> {val}
                      </span>
                    );
                  })}
                </div>
              )}

              {descriptionFields.map(f => {
                const val = item[f.name];
                if (!val) return null;
                return (
                  <div key={f.id} className={`mt-0.5 ${onDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    <MarkdownText text={val} className="text-[10px]" />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSidebarItem = (id: string, onDark: boolean = false) => {
    if (id === 'skills') return renderSkills(onDark);
    const cs = customSections.find(s => s.id === id);
    if (cs) return renderCustomSection(cs, onDark);
    return null;
  };

  const renderMainItem = (id: string) => {
    if (id === 'experience') return renderExperience();
    if (id === 'education') return renderEducation();
    if (id === 'projects') return renderProjects();
    return null;
  };

  // Determine sidebar dark theme classes (not applied to split-compact)
  const sidebarBg = isCompact 
    ? 'bg-white border-r border-gray-150 p-6' 
    : isRightSidebar 
      ? `bg-slate-900 text-gray-200 p-6` 
      : `bg-slate-900 text-gray-200 p-6`; // left sidebar dark theme by default

  const contentBg = 'bg-white text-gray-950 p-6';

  return (
    <div className={`resume-paper w-full bg-white shadow-lg grid grid-cols-12 ${fontClass} ${sizeClass} ${leadingClass}`}>
      {/* Top Header Row (Shared across columns) */}
      <div className="col-span-12 bg-slate-950 text-white px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3 border-b-4" style={{ borderColor: accentColor }}>
        <div className="text-center md:text-left space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">{personalInfo.name}</h1>
          {personalInfo.title && <p className="text-xs tracking-wider text-slate-300 font-medium uppercase">{personalInfo.title}</p>}
        </div>
        {/* Horizontal contacts in header */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
          {allContacts.map((c, i) => (
            <span key={i} className="whitespace-nowrap">{c.val}</span>
          ))}
        </div>
      </div>

      {/* Main Body Split */}
      <div className={`col-span-12 grid grid-cols-12 min-h-[800px]`}>
        
        {/* Left Side Column */}
        <div className={`${isRightSidebar ? 'col-span-8 ' + contentBg : 'col-span-4 ' + sidebarBg}`}>
          <div className="space-y-5">
            {isRightSidebar ? (
              // Main content goes here
              sortedMainIds.map(id => renderMainItem(id))
            ) : (
              // Sidebar content goes here (Left Sidebar)
              <>
                {personalInfo.photo && (
                  <div className="flex justify-center mb-4 shrink-0">
                    <img src={personalInfo.photo} alt="Avatar" className={`w-20 h-20 rounded-full border-2 ${!isCompact ? 'border-slate-800' : 'border-gray-200'} object-cover shadow-md`} />
                  </div>
                )}
                {/* Optional side summary if split-left */}
                {personalInfo.summary && !isCompact && (
                  <div className="space-y-1.5">
                    {renderSectionHeader('Summary', true)}
                    <p className="text-[11px] text-slate-350 text-justify leading-relaxed">
                      {personalInfo.summary.replace(/\*\*/g, '').replace(/\*/g, '')}
                    </p>
                  </div>
                )}
                {sortedSidebarIds.map(id => renderSidebarItem(id, !isCompact))}
              </>
            )}
          </div>
        </div>

        {/* Right Side Column */}
        <div className={`${isRightSidebar ? 'col-span-4 ' + sidebarBg : 'col-span-8 ' + contentBg}`}>
          <div className="space-y-5">
            {isRightSidebar ? (
              // Sidebar content goes here (Right Sidebar)
              <>
                {personalInfo.photo && (
                  <div className="flex justify-center mb-4 shrink-0">
                    <img src={personalInfo.photo} alt="Avatar" className={`w-20 h-20 rounded-full border-2 ${!isCompact ? 'border-slate-800' : 'border-gray-200'} object-cover shadow-md`} />
                  </div>
                )}
                {personalInfo.summary && !isCompact && (
                  <div className="space-y-1.5">
                    {renderSectionHeader('Summary', true)}
                    <p className="text-[11px] text-slate-350 text-justify leading-relaxed">
                      {personalInfo.summary.replace(/\*\*/g, '').replace(/\*/g, '')}
                    </p>
                  </div>
                )}
                {sortedSidebarIds.map(id => renderSidebarItem(id, !isCompact))}
              </>
            ) : (
              // Main content goes here (Left Sidebar active)
              <>
                {personalInfo.summary && isCompact && (
                  <div className="space-y-1.5 mb-4">
                    {renderSectionHeader('Summary')}
                    <p className="text-[11px] text-gray-700 text-justify leading-relaxed">
                      {personalInfo.summary.replace(/\*\*/g, '').replace(/\*/g, '')}
                    </p>
                  </div>
                )}
                {sortedMainIds.map(id => renderMainItem(id))}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
