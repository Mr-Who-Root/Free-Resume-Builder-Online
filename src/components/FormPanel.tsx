import React, { useState } from 'react';
import type { 
  ResumeData, 
  ExperienceItem, 
  EducationItem, 
  SkillCategory, 
  ProjectItem, 
  CustomSection
} from '../types/resume';
import { 
  DragDropContext, 
  Droppable, 
  Draggable
} from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  GripVertical, 
  Layers, 
  User, 
  Briefcase, 
  GraduationCap, 
  Sliders, 
  FolderGit2, 
  FolderPlus,
  ArrowRightLeft
} from 'lucide-react';

interface FormPanelProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const FormPanel: React.FC<FormPanelProps> = ({ data, onChange }) => {
  // Collapsible state for form accordion panels
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personalInfo: true,
    experience: false,
    education: false,
    skills: false,
    projects: false,
  });

  // Modal / Dynamic Form States for adding new custom sections
  const [customSectionTitle, setCustomSectionTitle] = useState('');
  const [isAddingCustomSection, setIsAddingCustomSection] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Generic state updater helper
  const updateField = (section: keyof ResumeData, value: any) => {
    onChange({
      ...data,
      [section]: value
    });
  };

  // Personal Info update handler
  const handlePersonalInfoChange = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  // Photo upload and clear handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image (PNG, JPG, WebP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange({
        ...data,
        personalInfo: {
          ...data.personalInfo,
          photo: event.target?.result as string
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        photo: ''
      }
    });
  };

  // Personal Info Custom Contact link handlers
  const addPersonalInfoCustomField = () => {
    const customFields = [...(data.personalInfo.customFields || []), { name: 'LinkedIn', value: '' }];
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        customFields
      }
    });
  };

  const handlePersonalInfoCustomFieldChange = (index: number, key: 'name' | 'value', val: string) => {
    const customFields = [...(data.personalInfo.customFields || [])];
    customFields[index] = { ...customFields[index], [key]: val };
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        customFields
      }
    });
  };

  const deletePersonalInfoCustomField = (index: number) => {
    const customFields = (data.personalInfo.customFields || []).filter((_, i) => i !== index);
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        customFields
      }
    });
  };

  // Custom fields inside standard items (Experience, Education, Projects)
  const handleItemCustomFieldChange = (
    section: 'experience' | 'education' | 'projects',
    itemId: string,
    fieldIndex: number,
    key: 'name' | 'value',
    val: string
  ) => {
    const updated = (data[section] as any[]).map(item => {
      if (item.id === itemId) {
        const cFields = [...(item.customFields || [])];
        cFields[fieldIndex] = { ...cFields[fieldIndex], [key]: val };
        return { ...item, customFields: cFields };
      }
      return item;
    });
    updateField(section, updated);
  };

  const addItemCustomField = (
    section: 'experience' | 'education' | 'projects',
    itemId: string
  ) => {
    const updated = (data[section] as any[]).map(item => {
      if (item.id === itemId) {
        const cFields = [...(item.customFields || []), { name: 'Portfolio', value: '' }];
        return { ...item, customFields: cFields };
      }
      return item;
    });
    updateField(section, updated);
  };

  const deleteItemCustomField = (
    section: 'experience' | 'education' | 'projects',
    itemId: string,
    fieldIndex: number
  ) => {
    const updated = (data[section] as any[]).map(item => {
      if (item.id === itemId) {
        const cFields = (item.customFields || []).filter((_: any, i: number) => i !== fieldIndex);
        return { ...item, customFields: cFields };
      }
      return item;
    });
    updateField(section, updated);
  };

  // Reordering handlers for Drag and Drop
  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    // 1. Reordering Main Layout Sections
    if (type === 'SECTIONS') {
      const newOrder = Array.from(data.sectionOrder);
      const [removed] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, removed);
      updateField('sectionOrder', newOrder);
      return;
    }

    // 2. Reordering nested lists inside standard sections
    const droppableId = source.droppableId;
    if (droppableId === 'experience') {
      const items = Array.from(data.experience);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);
      updateField('experience', items);
    } else if (droppableId === 'education') {
      const items = Array.from(data.education);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);
      updateField('education', items);
    } else if (droppableId === 'skills') {
      const items = Array.from(data.skills);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);
      updateField('skills', items);
    } else if (droppableId === 'projects') {
      const items = Array.from(data.projects);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);
      updateField('projects', items);
    } else if (droppableId.startsWith('custom-list-')) {
      // Reordering items in a custom section
      const sectionId = droppableId.replace('custom-list-', '');
      const sections = data.customSections.map(cs => {
        if (cs.id === sectionId) {
          const items = Array.from(cs.items);
          const [removed] = items.splice(source.index, 1);
          items.splice(destination.index, 0, removed);
          return { ...cs, items };
        }
        return cs;
      });
      updateField('customSections', sections);
    }
  };

  // ADD Handlers
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      location: '',
      description: ''
    };
    updateField('experience', [...data.experience, newExp]);
    setExpandedSections(prev => ({ ...prev, experience: true }));
  };

  const addEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      location: '',
      description: ''
    };
    updateField('education', [...data.education, newEdu]);
    setExpandedSections(prev => ({ ...prev, education: true }));
  };

  const addSkillCategory = () => {
    const newSkill: SkillCategory = {
      id: `skill-${Date.now()}`,
      category: '',
      skills: ''
    };
    updateField('skills', [...data.skills, newSkill]);
    setExpandedSections(prev => ({ ...prev, skills: true }));
  };

  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    updateField('projects', [...data.projects, newProj]);
    setExpandedSections(prev => ({ ...prev, projects: true }));
  };

  // DYNAMIC CUSTOM SECTION BUILDER
  const createCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSectionTitle.trim()) return;

    const sectionId = `custom-${Date.now()}`;
    const newSection: CustomSection = {
      id: sectionId,
      title: customSectionTitle.trim(),
      fields: [
        { id: `f1-${Date.now()}`, name: 'title', label: 'Item Header (Title)', type: 'text' },
        { id: `f2-${Date.now()}`, name: 'date', label: 'Timeline / Date', type: 'text' },
        { id: `f3-${Date.now()}`, name: 'org', label: 'Sub-heading / Organization', type: 'text' },
        { id: `f4-${Date.now()}`, name: 'desc', label: 'Details (Markdown enabled)', type: 'textarea' }
      ],
      items: []
    };

    onChange({
      ...data,
      customSections: [...data.customSections, newSection],
      sectionOrder: [...data.sectionOrder, sectionId]
    });

    setCustomSectionTitle('');
    setIsAddingCustomSection(false);
    setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
  };

  const addCustomItem = (sectionId: string) => {
    const sections = data.customSections.map(cs => {
      if (cs.id === sectionId) {
        const newItem: any = { id: `item-${Date.now()}` };
        cs.fields.forEach(f => {
          newItem[f.name] = '';
        });
        return {
          ...cs,
          items: [...cs.items, newItem]
        };
      }
      return cs;
    });
    updateField('customSections', sections);
  };

  // DELETE Handlers
  const deleteItem = (section: 'experience' | 'education' | 'skills' | 'projects', id: string) => {
    const filtered = (data[section] as any[]).filter(item => item.id !== id);
    updateField(section, filtered);
  };

  const deleteCustomItem = (sectionId: string, itemId: string) => {
    const sections = data.customSections.map(cs => {
      if (cs.id === sectionId) {
        return {
          ...cs,
          items: cs.items.filter(item => item.id !== itemId)
        };
      }
      return cs;
    });
    updateField('customSections', sections);
  };

  const deleteCustomSection = (sectionId: string) => {
    onChange({
      ...data,
      customSections: data.customSections.filter(cs => cs.id !== sectionId),
      sectionOrder: data.sectionOrder.filter(id => id !== sectionId)
    });
  };

  // Dynamic values editor for fields in Custom Sections
  const handleCustomItemChange = (sectionId: string, itemId: string, fieldName: string, value: string) => {
    const sections = data.customSections.map(cs => {
      if (cs.id === sectionId) {
        const items = cs.items.map(item => {
          if (item.id === itemId) {
            return { ...item, [fieldName]: value };
          }
          return item;
        });
        return { ...cs, items };
      }
      return cs;
    });
    updateField('customSections', sections);
  };

  // Label configuration for dynamic fields (to define what fields a custom section has)
  const handleCustomFieldLabelChange = (sectionId: string, fieldId: string, newLabel: string) => {
    const sections = data.customSections.map(cs => {
      if (cs.id === sectionId) {
        const fields = cs.fields.map(f => {
          if (f.id === fieldId) {
            return { ...f, label: newLabel };
          }
          return f;
        });
        return { ...cs, fields };
      }
      return cs;
    });
    updateField('customSections', sections);
  };

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* 1. Drag & Drop Section Arranger */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-md">
        <button 
          onClick={() => toggleSection('sectionArranger')}
          className="w-full flex items-center justify-between font-bold text-sm text-slate-300 uppercase tracking-wider"
        >
          <span className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
            <span>Arrange Sections Layout</span>
          </span>
          {expandedSections.sectionArranger ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expandedSections.sectionArranger && (
          <div className="mt-3.5 pt-3 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 mb-3">
              Drag sections to reorder. The live preview updates instantaneously.
            </p>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections-list" type="SECTIONS">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-1.5"
                  >
                    {data.sectionOrder
                      .filter(id => id !== 'personalInfo')
                      .map((id, index) => {
                        // Resolve readable display title
                        let displayName = id;
                        if (id === 'experience') displayName = 'Professional Experience';
                        else if (id === 'education') displayName = 'Education';
                        else if (id === 'skills') displayName = 'Technical Skills';
                        else if (id === 'projects') displayName = 'Projects';
                        else {
                          const cs = data.customSections.find(s => s.id === id);
                          if (cs) displayName = `Custom: ${cs.title}`;
                        }

                        return (
                          <Draggable key={id} draggableId={id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center justify-between text-xs px-3 py-2 border rounded-lg transition-all ${
                                  snapshot.isDragging 
                                    ? 'bg-indigo-950/60 border-indigo-500/80 shadow-lg' 
                                    : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700/80 text-slate-300'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <GripVertical className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{displayName}</span>
                                </span>
                                {id.startsWith('custom-') && (
                                  <button 
                                    onClick={() => deleteCustomSection(id)}
                                    className="text-slate-500 hover:text-rose-400 transition"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>

      {/* 2. Drag & Drop Context for nested fields list reordering */}
      <DragDropContext onDragEnd={onDragEnd}>
        
        {/* PERSONAL INFO PANEL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <button 
            onClick={() => toggleSection('personalInfo')}
            className="w-full flex items-center justify-between p-4 bg-slate-950/40 font-bold hover:bg-slate-950/70 transition"
          >
            <span className="flex items-center gap-2 text-slate-200">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Contact & Summary</span>
            </span>
            {expandedSections.personalInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expandedSections.personalInfo && (
            <div className="p-4 space-y-4 border-t border-slate-850">
              
              {/* Profile Photo Uploader */}
              <div className="flex items-center gap-4 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  {data.personalInfo.photo ? (
                    <img 
                      src={data.personalInfo.photo} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-semibold text-slate-400">Profile Photo</div>
                  <div className="flex gap-2">
                    <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] px-2.5 py-1 rounded transition">
                      Upload Image
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                      />
                    </label>
                    {data.personalInfo.photo && (
                      <button 
                        type="button"
                        onClick={handleClearPhoto}
                        className="bg-slate-900 border border-slate-800 hover:border-rose-900/50 hover:text-rose-400 text-slate-400 font-semibold text-[11px] px-2.5 py-1 rounded transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name-input" className="text-xs text-slate-400 font-semibold block">Full Name</label>
                  <input
                    id="name-input"
                    type="text"
                    value={data.personalInfo.name}
                    onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                    placeholder="John Doe"
                    className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="title-input" className="text-xs text-slate-400 font-semibold block">Professional Title</label>
                  <input
                    id="title-input"
                    type="text"
                    value={data.personalInfo.title}
                    onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                    placeholder="Senior Frontend Dev"
                    className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="email-input" className="text-xs text-slate-400 font-semibold block">Email Address</label>
                  <input
                    id="email-input"
                    type="email"
                    value={data.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="phone-input" className="text-xs text-slate-400 font-semibold block">Phone Number</label>
                  <input
                    id="phone-input"
                    type="text"
                    value={data.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="website-input" className="text-xs text-slate-400 font-semibold block">Portfolio / GitHub / LinkedIn</label>
                  <input
                    id="website-input"
                    type="text"
                    value={data.personalInfo.website}
                    onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                    placeholder="github.com/johndoe"
                    className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="location-input" className="text-xs text-slate-400 font-semibold block">Location</label>
                  <input
                    id="location-input"
                    type="text"
                    value={data.personalInfo.location}
                    onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    placeholder="San Francisco, CA"
                    className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="summary-input" className="text-xs text-slate-400 font-semibold block">Professional Summary (Markdown allowed)</label>
                <textarea
                  id="summary-input"
                  rows={3}
                  value={data.personalInfo.summary}
                  onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                  placeholder="Senior developer with 5+ years of experience. Specialized in **React** and *TypeScript*."
                  className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                />
              </div>

              {/* Custom Contact Fields */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Custom Contact Links</span>
                  <button 
                    type="button" 
                    onClick={addPersonalInfoCustomField}
                    className="flex items-center gap-1 text-[10px] bg-indigo-950 border border-indigo-900/60 hover:bg-indigo-900/40 text-indigo-400 px-2 py-1 rounded-md transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Custom Link</span>
                  </button>
                </div>

                {(data.personalInfo.customFields || []).map((field, idx) => (
                  <div key={idx} className="flex gap-2.5 items-end bg-slate-950/40 border border-slate-850 p-2.5 rounded-lg animate-fadeIn">
                    <div className="w-1/3 space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold uppercase block">Field Name</label>
                      <input 
                        type="text"
                        value={field.name}
                        onChange={(e) => handlePersonalInfoCustomFieldChange(idx, 'name', e.target.value)}
                        placeholder="e.g. GitHub, Skype"
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold uppercase block">Field Value</label>
                      <input 
                        type="text"
                        value={field.value}
                        onChange={(e) => handlePersonalInfoCustomFieldChange(idx, 'value', e.target.value)}
                        placeholder="e.g. github.com/username"
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => deletePersonalInfoCustomField(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900/40 rounded transition shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* WORK EXPERIENCE PANEL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <button 
            onClick={() => toggleSection('experience')}
            className="w-full flex items-center justify-between p-4 bg-slate-950/40 font-bold hover:bg-slate-950/70 transition"
          >
            <span className="flex items-center gap-2 text-slate-200">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Work Experience</span>
            </span>
            {expandedSections.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSections.experience && (
            <div className="p-4 space-y-4 border-t border-slate-850">
              <Droppable droppableId="experience" type="EXP">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {data.experience.map((exp, index) => (
                      <Draggable key={exp.id} draggableId={exp.id} index={index}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-4 border rounded-xl space-y-3 relative ${
                              snapshot.isDragging 
                                ? 'bg-slate-900 border-indigo-500/80 shadow-2xl' 
                                : 'bg-slate-950 border-slate-850 hover:border-slate-800'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-400 flex items-center gap-1">
                                <GripVertical className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-semibold">Position #{index + 1}</span>
                              </div>
                              <button 
                                onClick={() => deleteItem('experience', exp.id)}
                                className="text-slate-500 hover:text-rose-400 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-semibold block">Company Name</label>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => {
                                    const updated = data.experience.map(item => item.id === exp.id ? { ...item, company: e.target.value } : item);
                                    updateField('experience', updated);
                                  }}
                                  placeholder="Tech Corp"
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-semibold block">Position/Role</label>
                                <input
                                  type="text"
                                  value={exp.position}
                                  onChange={(e) => {
                                    const updated = data.experience.map(item => item.id === exp.id ? { ...item, position: e.target.value } : item);
                                    updateField('experience', updated);
                                  }}
                                  placeholder="Software Engineer"
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-semibold block">Start Date</label>
                                <input
                                  type="text"
                                  value={exp.startDate}
                                  onChange={(e) => {
                                    const updated = data.experience.map(item => item.id === exp.id ? { ...item, startDate: e.target.value } : item);
                                    updateField('experience', updated);
                                  }}
                                  placeholder="Oct 2023"
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-semibold block">End Date</label>
                                <input
                                  type="text"
                                  value={exp.endDate}
                                  onChange={(e) => {
                                    const updated = data.experience.map(item => item.id === exp.id ? { ...item, endDate: e.target.value } : item);
                                    updateField('experience', updated);
                                  }}
                                  placeholder="Present"
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-semibold block">Location</label>
                                <input
                                  type="text"
                                  value={exp.location}
                                  onChange={(e) => {
                                    const updated = data.experience.map(item => item.id === exp.id ? { ...item, location: e.target.value } : item);
                                    updateField('experience', updated);
                                  }}
                                  placeholder="San Francisco, CA"
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-400 font-semibold block">Description & Bullet Points (Markdown allowed)</label>
                              <textarea
                                rows={3}
                                value={exp.description}
                                onChange={(e) => {
                                  const updated = data.experience.map(item => item.id === exp.id ? { ...item, description: e.target.value } : item);
                                  updateField('experience', updated);
                                }}
                                placeholder="• Developed scalable UI components using **React**&#10;• Led optimization refactors reducing LCP by *35%*"
                                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                              />
                            </div>

                            {/* Custom Fields for Experience */}
                            <div className="space-y-2.5 pt-2.5 border-t border-slate-800/60">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Custom Role Details</span>
                                <button
                                  type="button"
                                  onClick={() => addItemCustomField('experience', exp.id)}
                                  className="text-[9px] bg-indigo-950/60 border border-indigo-900/50 hover:bg-indigo-900/40 text-indigo-400 px-2 py-1 rounded transition"
                                >
                                  + Add Custom Field
                                </button>
                              </div>
                              
                              {(exp.customFields || []).map((field, fIdx) => (
                                <div key={fIdx} className="flex gap-2 items-center animate-fadeIn">
                                  <input
                                    type="text"
                                    value={field.name}
                                    onChange={(e) => handleItemCustomFieldChange('experience', exp.id, fIdx, 'name', e.target.value)}
                                    placeholder="e.g. Project link, Tech Lead"
                                    className="w-1/3 text-[11px] bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                  <input
                                    type="text"
                                    value={field.value}
                                    onChange={(e) => handleItemCustomFieldChange('experience', exp.id, fIdx, 'value', e.target.value)}
                                    placeholder="Field value"
                                    className="flex-1 text-[11px] bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => deleteItemCustomField('experience', exp.id, fIdx)}
                                    className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900/30 rounded"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button 
                onClick={addExperience}
                className="w-full flex items-center justify-center gap-1 py-2.5 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition shadow-md shadow-indigo-650/10"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            </div>
          )}
        </div>

        {/* EDUCATION PANEL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <button 
            onClick={() => toggleSection('education')}
            className="w-full flex items-center justify-between p-4 bg-slate-950/40 font-bold hover:bg-slate-950/70 transition"
          >
            <span className="flex items-center gap-2 text-slate-200">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Education</span>
            </span>
            {expandedSections.education ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSections.education && (
            <div className="p-4 space-y-4 border-t border-slate-850">
              <Droppable droppableId="education" type="EDU">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {data.education.map((edu, index) => (
                      <Draggable key={edu.id} draggableId={edu.id} index={index}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-4 border rounded-xl space-y-3 relative ${
                              snapshot.isDragging 
                                ? 'bg-slate-900 border-indigo-500/80 shadow-2xl' 
                                : 'bg-slate-950 border-slate-850 hover:border-slate-800'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-400 flex items-center gap-1">
                                <GripVertical className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-semibold">Degree #{index + 1}</span>
                              </div>
                              <button 
                                onClick={() => deleteItem('education', edu.id)}
                                className="text-slate-500 hover:text-rose-400 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-semibold block">School / Institution</label>
                                <input
                                  type="text"
                                  value={edu.institution}
                                  onChange={(e) => {
                                    const updated = data.education.map(item => item.id === edu.id ? { ...item, institution: e.target.value } : item);
                                    updateField('education', updated);
                                  }}
                                  placeholder="UC Berkeley"
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-semibold block">Degree Name</label>
                                <input
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => {
                                    const updated = data.education.map(item => item.id === edu.id ? { ...item, degree: e.target.value } : item);
                                    updateField('education', updated);
                                  }}
                                  placeholder="Bachelor of Science"
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-semibold block">Major / Field</label>
                                <input
                                  type="text"
                                  value={edu.fieldOfStudy}
                                  onChange={(e) => {
                                    const updated = data.education.map(item => item.id === edu.id ? { ...item, fieldOfStudy: e.target.value } : item);
                                    updateField('education', updated);
                                  }}
                                  placeholder="Computer Science"
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-semibold block">Dates Attended</label>
                                <input
                                  type="text"
                                  value={edu.startDate + (edu.endDate ? ' - ' + edu.endDate : '')}
                                  onChange={(e) => {
                                    // Parse dates back into start/end
                                    const val = e.target.value;
                                    const split = val.split('-');
                                    const start = split[0]?.trim() || '';
                                    const end = split[1]?.trim() || '';
                                    const updated = data.education.map(item => item.id === edu.id ? { ...item, startDate: start, endDate: end } : item);
                                    updateField('education', updated);
                                  }}
                                  placeholder="2017 - 2021"
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-semibold block">School Location</label>
                                <input
                                  type="text"
                                  value={edu.location}
                                  onChange={(e) => {
                                    const updated = data.education.map(item => item.id === edu.id ? { ...item, location: e.target.value } : item);
                                    updateField('education', updated);
                                  }}
                                  placeholder="Berkeley, CA"
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-400 font-semibold block">GPA or Additional Details</label>
                              <input
                                type="text"
                                value={edu.description}
                                onChange={(e) => {
                                  const updated = data.education.map(item => item.id === edu.id ? { ...item, description: e.target.value } : item);
                                  updateField('education', updated);
                                }}
                                placeholder="GPA: 3.8/4.0. Completed Honors project on Distributed Networks."
                                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>

                            {/* Custom Fields for Education */}
                            <div className="space-y-2.5 pt-2.5 border-t border-slate-800/60">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Custom School Details</span>
                                <button
                                  type="button"
                                  onClick={() => addItemCustomField('education', edu.id)}
                                  className="text-[9px] bg-indigo-950/60 border border-indigo-900/50 hover:bg-indigo-900/40 text-indigo-400 px-2 py-1 rounded transition"
                                >
                                  + Add Custom Field
                                </button>
                              </div>
                              
                              {(edu.customFields || []).map((field, fIdx) => (
                                <div key={fIdx} className="flex gap-2 items-center animate-fadeIn">
                                  <input
                                    type="text"
                                    value={field.name}
                                    onChange={(e) => handleItemCustomFieldChange('education', edu.id, fIdx, 'name', e.target.value)}
                                    placeholder="e.g. Major GPA, Advisor"
                                    className="w-1/3 text-[11px] bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                  <input
                                    type="text"
                                    value={field.value}
                                    onChange={(e) => handleItemCustomFieldChange('education', edu.id, fIdx, 'value', e.target.value)}
                                    placeholder="Field value"
                                    className="flex-1 text-[11px] bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => deleteItemCustomField('education', edu.id, fIdx)}
                                    className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900/30 rounded"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button 
                onClick={addEducation}
                className="w-full flex items-center justify-center gap-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </div>
          )}
        </div>

        {/* SKILLS PANEL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <button 
            onClick={() => toggleSection('skills')}
            className="w-full flex items-center justify-between p-4 bg-slate-950/40 font-bold hover:bg-slate-950/70 transition"
          >
            <span className="flex items-center gap-2 text-slate-200">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Skills Categories</span>
            </span>
            {expandedSections.skills ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSections.skills && (
            <div className="p-4 space-y-4 border-t border-slate-850">
              <Droppable droppableId="skills" type="SKILLS">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {data.skills.map((skill, index) => (
                      <Draggable key={skill.id} draggableId={skill.id} index={index}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-3 border rounded-xl space-y-2.5 relative ${
                              snapshot.isDragging 
                                ? 'bg-slate-900 border-indigo-500/80 shadow-2xl' 
                                : 'bg-slate-950 border-slate-850 hover:border-slate-800'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-400 flex items-center gap-1">
                                <GripVertical className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-semibold">Category #{index + 1}</span>
                              </div>
                              <button 
                                onClick={() => deleteItem('skills', skill.id)}
                                className="text-slate-500 hover:text-rose-400 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-2">
                              <input
                                type="text"
                                value={skill.category}
                                onChange={(e) => {
                                  const updated = data.skills.map(item => item.id === skill.id ? { ...item, category: e.target.value } : item);
                                  updateField('skills', updated);
                                }}
                                placeholder="e.g. Languages, Frontend"
                                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                              <input
                                type="text"
                                value={skill.skills}
                                onChange={(e) => {
                                  const updated = data.skills.map(item => item.id === skill.id ? { ...item, skills: e.target.value } : item);
                                  updateField('skills', updated);
                                }}
                                placeholder="React, TypeScript, Next.js (comma separated)"
                                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button 
                onClick={addSkillCategory}
                className="w-full flex items-center justify-center gap-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skills Category</span>
              </button>
            </div>
          )}
        </div>

        {/* PROJECTS PANEL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <button 
            onClick={() => toggleSection('projects')}
            className="w-full flex items-center justify-between p-4 bg-slate-950/40 font-bold hover:bg-slate-950/70 transition"
          >
            <span className="flex items-center gap-2 text-slate-200">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              <span>Projects</span>
            </span>
            {expandedSections.projects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSections.projects && (
            <div className="p-4 space-y-4 border-t border-slate-850">
              <Droppable droppableId="projects" type="PROJECTS">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {data.projects.map((proj, index) => (
                      <Draggable key={proj.id} draggableId={proj.id} index={index}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-4 border rounded-xl space-y-3 relative ${
                              snapshot.isDragging 
                                ? 'bg-slate-900 border-indigo-500/80 shadow-2xl' 
                                : 'bg-slate-950 border-slate-850 hover:border-slate-800'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-400 flex items-center gap-1">
                                <GripVertical className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-semibold">Project #{index + 1}</span>
                              </div>
                              <button 
                                onClick={() => deleteItem('projects', proj.id)}
                                className="text-slate-500 hover:text-rose-400 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-semibold block">Project Name</label>
                                <input
                                  type="text"
                                  value={proj.name}
                                  onChange={(e) => {
                                    const updated = data.projects.map(item => item.id === proj.id ? { ...item, name: e.target.value } : item);
                                    updateField('projects', updated);
                                  }}
                                  placeholder="Resume Builder"
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-semibold block">Link / URL</label>
                                <input
                                  type="text"
                                  value={proj.link}
                                  onChange={(e) => {
                                    const updated = data.projects.map(item => item.id === proj.id ? { ...item, link: e.target.value } : item);
                                    updateField('projects', updated);
                                  }}
                                  placeholder="github.com/project"
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-400 font-semibold block">Technologies Used</label>
                              <input
                                type="text"
                                value={proj.technologies}
                                onChange={(e) => {
                                  const updated = data.projects.map(item => item.id === proj.id ? { ...item, technologies: e.target.value } : item);
                                  updateField('projects', updated);
                                }}
                                placeholder="React, TypeScript, Tailwind CSS"
                                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-400 font-semibold block">Project Description (Markdown allowed)</label>
                              <textarea
                                rows={3}
                                value={proj.description}
                                onChange={(e) => {
                                  const updated = data.projects.map(item => item.id === proj.id ? { ...item, description: e.target.value } : item);
                                  updateField('projects', updated);
                                }}
                                placeholder="Built a client-side exporter with **60fps** render speeds."
                                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                              />
                            </div>

                            {/* Custom Fields for Projects */}
                            <div className="space-y-2.5 pt-2.5 border-t border-slate-800/60">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Custom Project Details</span>
                                <button
                                  type="button"
                                  onClick={() => addItemCustomField('projects', proj.id)}
                                  className="text-[9px] bg-indigo-950/60 border border-indigo-900/50 hover:bg-indigo-900/40 text-indigo-400 px-2 py-1 rounded transition"
                                >
                                  + Add Custom Field
                                </button>
                              </div>
                              
                              {(proj.customFields || []).map((field, fIdx) => (
                                <div key={fIdx} className="flex gap-2 items-center animate-fadeIn">
                                  <input
                                    type="text"
                                    value={field.name}
                                    onChange={(e) => handleItemCustomFieldChange('projects', proj.id, fIdx, 'name', e.target.value)}
                                    placeholder="e.g. Team size, Award"
                                    className="w-1/3 text-[11px] bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                  <input
                                    type="text"
                                    value={field.value}
                                    onChange={(e) => handleItemCustomFieldChange('projects', proj.id, fIdx, 'value', e.target.value)}
                                    placeholder="Field value"
                                    className="flex-1 text-[11px] bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => deleteItemCustomField('projects', proj.id, fIdx)}
                                    className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900/30 rounded"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button 
                onClick={addProject}
                className="w-full flex items-center justify-center gap-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>
          )}
        </div>

        {/* DYNAMIC CUSTOM SECTIONS RENDERER */}
        {data.customSections.map((cs) => (
          <div key={cs.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <button 
              onClick={() => toggleSection(cs.id)}
              className="w-full flex items-center justify-between p-4 bg-slate-950/40 font-bold hover:bg-slate-950/70 transition"
            >
              <span className="flex items-center gap-2 text-slate-200">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>{cs.title} (Custom)</span>
              </span>
              {expandedSections[cs.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSections[cs.id] && (
              <div className="p-4 space-y-4 border-t border-slate-850">
                
                {/* Customizable field labels */}
                <div className="bg-slate-950/50 border border-slate-850 p-3 rounded-lg space-y-2">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Configure Custom Field Labels:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {cs.fields.map(f => (
                      <div key={f.id} className="space-y-0.5">
                        <label className="text-[9px] text-slate-500 font-semibold uppercase">{f.name} Label</label>
                        <input
                          type="text"
                          value={f.label}
                          onChange={(e) => handleCustomFieldLabelChange(cs.id, f.id, e.target.value)}
                          className="w-full text-[11px] bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Droppable droppableId={`custom-list-${cs.id}`} type={`CUSTOM_${cs.id}`}>
                  {(provided) => (
                    <div 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4 animate-fadeIn"
                    >
                      {cs.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`p-4 border rounded-xl space-y-3 relative ${
                                snapshot.isDragging 
                                  ? 'bg-slate-900 border-indigo-500/80 shadow-2xl' 
                                  : 'bg-slate-950 border-slate-850 hover:border-slate-800'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-400 flex items-center gap-1">
                                  <GripVertical className="w-4 h-4" />
                                  <span className="text-[10px] uppercase font-semibold">Item #{index + 1}</span>
                                </div>
                                <button 
                                  onClick={() => deleteCustomItem(cs.id, item.id)}
                                  className="text-slate-500 hover:text-rose-400 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Render input form elements dynamically mapping schemas */}
                              <div className="space-y-2.5">
                                {cs.fields.map((f) => (
                                  <div key={f.id} className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-semibold block">{f.label}</label>
                                    {f.type === 'textarea' ? (
                                      <textarea
                                        rows={3}
                                        value={item[f.name] || ''}
                                        onChange={(e) => handleCustomItemChange(cs.id, item.id, f.name, e.target.value)}
                                        placeholder={`Enter details (Markdown allowed)`}
                                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        value={item[f.name] || ''}
                                        onChange={(e) => handleCustomItemChange(cs.id, item.id, f.name, e.target.value)}
                                        placeholder={`Enter ${f.label.toLowerCase()}`}
                                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <button 
                  onClick={() => addCustomItem(cs.id)}
                  className="w-full flex items-center justify-center gap-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item to {cs.title}</span>
                </button>
              </div>
            )}
          </div>
        ))}

      </DragDropContext>

      {/* CREATE NEW SECTION CONTROLLER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        {!isAddingCustomSection ? (
          <button 
            onClick={() => setIsAddingCustomSection(true)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-950 border border-dashed border-slate-700 hover:border-slate-500 rounded-xl text-slate-400 hover:text-slate-200 transition font-semibold text-xs"
          >
            <FolderPlus className="w-4 h-4 text-indigo-400" />
            <span>Create New Custom Section</span>
          </button>
        ) : (
          <form onSubmit={createCustomSection} className="space-y-3 animate-fadeIn">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Create Custom Section</h3>
            <div className="space-y-1">
              <label htmlFor="sec-title-input" className="text-[11px] text-slate-400 font-semibold block">Section Name</label>
              <input
                id="sec-title-input"
                type="text"
                value={customSectionTitle}
                onChange={(e) => setCustomSectionTitle(e.target.value)}
                placeholder="e.g. Certifications, Open Source"
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end text-xs">
              <button 
                type="button" 
                onClick={() => setIsAddingCustomSection(false)}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-lg text-slate-400 transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
              >
                Create Section
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
