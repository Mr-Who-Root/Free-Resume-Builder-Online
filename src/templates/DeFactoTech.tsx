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

export const DeFactoTech: React.FC<TemplateProps> = ({ data, styleUtils }) => {
  const { personalInfo, experience, education, skills, projects, customSections, sectionOrder } = data;
  const { fontClass, sizeClass, leadingClass, spacingClass, marginClass, accentText, accentBorder } = styleUtils;
  const isCompact = data.styles.templateId === 'tech-compact';
  const isAcademic = data.styles.templateId === 'tech-academic';

  // Format contacts nicely
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

  const renderSectionHeader = (title: string) => (
    <h2 className={`font-bold text-sm tracking-wide border-b ${isCompact ? 'border-gray-200' : accentBorder} uppercase pb-0.5 mb-2 mt-4`}>
      {title}
    </h2>
  );

  const renderExperience = () => (
    <div key="experience" className="w-full">
      {renderSectionHeader('Experience')}
      <div className={spacingClass}>
        {experience.map((exp) => (
          <div key={exp.id} className="w-full">
            <div className="flex justify-between items-baseline font-semibold">
              <span className="text-gray-900">{exp.company}</span>
              <span className="text-gray-600 font-normal text-xs">{exp.startDate} – {exp.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline text-xs italic text-gray-700">
              <span>{exp.position}</span>
              <span className="font-normal not-italic">{exp.location}</span>
            </div>
            {exp.description && (
              <div className="mt-1 text-gray-800">
                <MarkdownText text={exp.description} className="text-xs" />
              </div>
            )}
            {exp.customFields && exp.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-650 font-medium">
                {exp.customFields.map((f, i) => f.name && f.value && (
                  <span key={i}>
                    <span className="font-semibold text-gray-800">{f.name}:</span> {f.value}
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
      <div className={spacingClass}>
        {education.map((edu) => (
          <div key={edu.id} className="w-full">
            <div className="flex justify-between items-baseline font-semibold">
              <span className="text-gray-900">{edu.institution}</span>
              <span className="text-gray-600 font-normal text-xs">{edu.startDate} – {edu.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline text-xs italic text-gray-700">
              <span>{edu.degree} in {edu.fieldOfStudy}</span>
              <span className="font-normal not-italic">{edu.location}</span>
            </div>
            {edu.description && (
              <p className="mt-1 text-xs text-gray-700">{edu.description}</p>
            )}
            {edu.customFields && edu.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-655 font-medium">
                {edu.customFields.map((f, i) => f.name && f.value && (
                  <span key={i}>
                    <span className="font-semibold text-gray-800">{f.name}:</span> {f.value}
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
      {renderSectionHeader('Skills')}
      <div className="space-y-1 text-xs">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-start">
            <span className="font-semibold text-gray-900 shrink-0 mr-1.5">{skill.category}:</span>
            <span className="text-gray-800">{skill.skills}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div key="projects" className="w-full">
      {renderSectionHeader('Projects')}
      <div className={spacingClass}>
        {projects.map((proj) => (
          <div key={proj.id} className="w-full">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                {proj.name}
                {proj.technologies && (
                  <span className="font-normal text-xs text-gray-600">
                    | <span className="italic">{proj.technologies}</span>
                  </span>
                )}
              </span>
              {proj.link && (
                <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline print:text-inherit">
                  {proj.link}
                </a>
              )}
            </div>
            {proj.description && (
              <div className="mt-1 text-gray-800">
                <MarkdownText text={proj.description} className="text-xs" />
              </div>
            )}
            {proj.customFields && proj.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-650 font-medium">
                {proj.customFields.map((f, i) => f.name && f.value && (
                  <span key={i}>
                    <span className="font-semibold text-gray-800">{f.name}:</span> {f.value}
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
    <div key={section.id} className="w-full">
      {renderSectionHeader(section.title)}
      <div className={spacingClass}>
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
            <div key={item.id} className="w-full">
              <div className="flex justify-between items-baseline font-semibold">
                <span className="text-gray-900">{titleVal}</span>
                {dateVal && <span className="text-gray-600 font-normal text-xs">{dateVal}</span>}
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
                  <div key={f.id} className="mt-1 text-gray-800">
                    <MarkdownText text={val} className="text-xs" />
                  </div>
                );
              })}
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
    
    // Check if custom section
    const customSec = customSections.find(s => s.id === id);
    if (customSec) return renderCustomSection(customSec);
    return null;
  };

  // Fonts override for academic: force serif
  const resolvedFont = isAcademic ? 'font-serif' : fontClass;

  return (
    <div className={`resume-paper w-full bg-white text-gray-950 shadow-lg ${resolvedFont} ${sizeClass} ${leadingClass} ${marginClass}`}>
      {/* Profile Header */}
      <div className={`flex ${personalInfo.photo ? 'flex-row items-center gap-4 text-left border-b pb-3 mb-2' : 'flex-col text-center'} justify-between`}>
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Avatar" className="w-14 h-14 rounded-full border border-gray-300 object-cover shrink-0" />
        )}
        <div className={`space-y-0.5 flex-1 ${personalInfo.photo ? 'text-left' : 'text-center'}`}>
          <h1 className={`font-bold tracking-tight text-gray-900 ${isAcademic ? 'text-2xl font-normal border-b border-double border-gray-400 pb-1 mb-2' : 'text-3xl'}`}>
            {personalInfo.name}
          </h1>
          {personalInfo.title && !isAcademic && (
            <p className={`text-xs font-semibold uppercase tracking-wider ${accentText}`}>{personalInfo.title}</p>
          )}
          <div className={`text-xs text-gray-600 flex flex-wrap gap-x-2 gap-y-0.5 print:text-black ${personalInfo.photo ? 'justify-start' : 'justify-center'}`}>
            {allContacts.map((contact, idx) => (
              <React.Fragment key={idx}>
                <span>{contact}</span>
                {idx < allContacts.length - 1 && <span className="text-gray-400 select-none print:text-black">•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mt-4">
          {isAcademic ? null : (
            <MarkdownText text={personalInfo.summary} className="text-xs text-gray-800 text-justify" />
          )}
        </div>
      )}

      {/* Dynamic Sections reordered */}
      <div className="space-y-4 mt-2">
        {sectionOrder
          .filter(id => id !== 'personalInfo')
          .map(id => renderSection(id))}
      </div>
    </div>
  );
};
