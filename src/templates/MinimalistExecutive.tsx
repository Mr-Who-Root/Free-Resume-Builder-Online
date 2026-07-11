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

export const MinimalistExecutive: React.FC<TemplateProps> = ({ data, styleUtils }) => {
  const { personalInfo, experience, education, skills, projects, customSections, sectionOrder, styles } = data;
  const { fontClass, sizeClass, leadingClass, marginClass } = styleUtils;
  const isClassic = data.styles.templateId === 'exec-classic';
  const isEditorial = data.styles.templateId === 'exec-editorial';

  // Force serif font for classic/editorial executive
  const resolvedFont = (isClassic || isEditorial) ? 'font-serif' : fontClass;

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
    <h2 className={`font-medium tracking-wide text-xs text-gray-900 border-b border-gray-150 uppercase pb-1 mb-3 mt-5`}>
      {title}
    </h2>
  );

  const renderExperience = () => (
    <div key="experience" className="w-full">
      {renderSectionHeader('Professional Experience')}
      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp.id} className="w-full space-y-1 print:break-inside-avoid experience-item">
            <div className="flex justify-between items-baseline font-medium text-xs">
              <span className="text-gray-900 text-sm">{exp.company}</span>
              <span className="text-gray-500 font-normal italic">{exp.startDate} – {exp.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline text-xs text-gray-600">
              <span className="font-semibold">{exp.position}</span>
              <span className="font-normal italic">{exp.location}</span>
            </div>
            {exp.description && (
              <div className="pt-1 text-gray-800">
                <MarkdownText text={exp.description} className="text-xs leading-relaxed text-justify" />
              </div>
            )}
            {exp.customFields && exp.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-500 italic">
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
      <div className="space-y-3">
        {education.map((edu) => (
          <div key={edu.id} className="w-full space-y-0.5 print:break-inside-avoid education-item">
            <div className="flex justify-between items-baseline font-medium text-xs">
              <span className="text-gray-900 text-sm">{edu.institution}</span>
              <span className="text-gray-500 font-normal italic">{edu.startDate} – {edu.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline text-xs text-gray-600">
              <span>{edu.degree} in {edu.fieldOfStudy}</span>
              <span className="italic">{edu.location}</span>
            </div>
            {edu.description && (
              <p className="text-xs text-gray-655 italic mt-0.5">{edu.description}</p>
            )}
            {edu.customFields && edu.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-500 italic">
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
      {renderSectionHeader('Core Competencies')}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-xs">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-start py-0.5 border-b border-gray-50">
            <span className="font-semibold text-gray-900 shrink-0 mr-1.5">{skill.category}:</span>
            <span className="text-gray-700">{skill.skills}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div key="projects" className="w-full">
      {renderSectionHeader('Key Projects')}
      <div className="space-y-4">
        {projects.map((proj) => (
          <div key={proj.id} className="w-full space-y-1 print:break-inside-avoid project-item">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-gray-900 text-xs">
                {proj.name} {proj.technologies && <span className="font-normal italic text-gray-500">({proj.technologies})</span>}
              </span>
              {proj.link && (
                <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:underline print:text-inherit">
                  {proj.link}
                </a>
              )}
            </div>
            {proj.description && (
              <div className="text-gray-800">
                <MarkdownText text={proj.description} className="text-xs text-justify" />
              </div>
            )}
            {proj.customFields && proj.customFields.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-500 italic">
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
    <div key={section.id} className="w-full">
      {renderSectionHeader(section.title)}
      <div className="space-y-4">
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
            <div key={item.id} className="w-full space-y-1 print:break-inside-avoid custom-item">
              <div className="flex justify-between items-baseline font-medium text-xs">
                <span className="text-gray-900 text-sm">{titleVal}</span>
                {dateVal && <span className="text-gray-500 font-normal italic">{dateVal}</span>}
              </div>
              
              {metaFields.length > 0 && (
                <div className="text-xs text-gray-600 font-medium flex flex-wrap gap-x-2.5 gap-y-0.5">
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
                  <div key={f.id} className="text-gray-800">
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
    <div className={`resume-paper w-full bg-white text-gray-900 shadow-lg ${resolvedFont} ${sizeClass} ${leadingClass} ${marginClass} tracking-normal`}>
      {/* Executive Center/Left Header */}
      <div className={`flex ${personalInfo.photo ? 'flex-row items-center gap-4 text-left border-b pb-3 mb-2' : 'flex-col'} ${isEditorial ? 'justify-center text-center' : 'justify-start text-left'} pb-4 space-y-2 border-b border-gray-200/80`}>
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Avatar" className="w-16 h-16 rounded-full border border-gray-250 object-cover shrink-0" />
        )}
        <div className={`space-y-1.5 flex-1 ${isEditorial ? 'text-center' : 'text-left'}`}>
          <h1 className={`font-light text-gray-900 ${isEditorial ? 'text-4xl italic tracking-wide font-serif' : 'text-3xl tracking-tight'}`}>
            {personalInfo.name}
          </h1>
          {personalInfo.title && (
            <p className="text-xs uppercase tracking-widest text-gray-655 font-semibold">{personalInfo.title}</p>
          )}
          <div className={`text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5 ${isEditorial ? 'justify-center' : 'justify-start'} print:text-black`}>
            {allContacts.map((contact, idx) => (
              <span key={idx} className="hover:text-gray-800">
                {contact}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Summary with high line-height and padding */}
      {personalInfo.summary && (
        <div className="py-4 border-b border-gray-100/50">
          <p className="text-xs text-gray-700 leading-relaxed italic text-justify">
            {personalInfo.summary.replace(/\*\*/g, '').replace(/\*/g, '')}
          </p>
        </div>
      )}

      {/* Layout Grid / Flow */}
      <div className="space-y-5">
        {sectionOrder
          .filter(id => id !== 'personalInfo' && !(styles.hiddenSections || []).includes(id))
          .map(id => renderSection(id))}
      </div>
    </div>
  );
};
