import React, { useState } from 'react';
import type { 
  ResumeData, 
  ExperienceItem, 
  EducationItem, 
  SkillCategory, 
  ProjectItem, 
  CustomSection,
  SocialLink
} from '../types/resume';
import { SocialLinksSection } from './SocialLinksSection';
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
  ArrowRightLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { MarkdownTextarea } from './MarkdownTextarea';

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
  const [newFieldLabels, setNewFieldLabels] = useState<Record<string, string>>({});
  const [newFieldTypes, setNewFieldTypes] = useState<Record<string, 'text' | 'textarea' | 'date' | 'title'>>({});

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
      const filteredOrder = data.sectionOrder.filter(id => id !== 'personalInfo');
      const [removed] = filteredOrder.splice(source.index, 1);
      filteredOrder.splice(destination.index, 0, removed);
      
      const newOrder = ['personalInfo', ...filteredOrder];
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
      fields: [], // Start with NO fields - fully custom fields layout!
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

  const addCustomField = (sectionId: string) => {
    const label = newFieldLabels[sectionId]?.trim();
    const type = newFieldTypes[sectionId] || 'text';
    if (!label) return;

    const fieldName = `field_${Date.now()}`;
    const fieldId = `f-${Date.now()}`;

    const sections = data.customSections.map(cs => {
      if (cs.id === sectionId) {
        const updatedFields = [...cs.fields, { id: fieldId, name: fieldName, label, type }];
        
        // Initialize the new key in all existing items
        const updatedItems = cs.items.map(item => ({
          ...item,
          [fieldName]: ''
        }));

        return {
          ...cs,
          fields: updatedFields,
          items: updatedItems
        };
      }
      return cs;
    });

    updateField('customSections', sections);

    // Reset local states
    setNewFieldLabels(prev => ({ ...prev, [sectionId]: '' }));
    setNewFieldTypes(prev => ({ ...prev, [sectionId]: 'text' }));
  };

  const deleteCustomField = (sectionId: string, fieldId: string) => {
    const sections = data.customSections.map(cs => {
      if (cs.id === sectionId) {
        const targetField = cs.fields.find(f => f.id === fieldId);
        if (!targetField) return cs;

        const updatedFields = cs.fields.filter(f => f.id !== fieldId);
        
        // Clean up from all items
        const updatedItems = cs.items.map(item => {
          const copy = { ...item };
          delete copy[targetField.name];
          return copy;
        });

        return {
          ...cs,
          fields: updatedFields,
          items: updatedItems
        };
      }
      return cs;
    });
    updateField('customSections', sections);
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

  const toggleHideSection = (sectionId: string) => {
    const hiddenList = data.styles.hiddenSections || [];
    const newHidden = hiddenList.includes(sectionId)
      ? hiddenList.filter(id => id !== sectionId)
      : [...hiddenList, sectionId];
    
    onChange({
      ...data,
      styles: {
        ...data.styles,
        hiddenSections: newHidden
      }
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
                        // Resolve readable display title to match accordion headers exactly
                        let displayName = id;
                        if (id === 'experience') displayName = 'Work Experience';
                        else if (id === 'education') displayName = 'Education';
                        else if (id === 'skills') displayName = 'Skills Categories';
                        else if (id === 'projects') displayName = 'Projects';
                        else {
                          const cs = data.customSections.find(s => s.id === id);
                          if (cs) displayName = `${cs.title} (Custom)`;
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
          <div className="w-full flex items-center justify-between p-4 bg-slate-950/40 font-bold border-b border-slate-850">
            <button 
              onClick={() => toggleSection('personalInfo')}
              className="flex items-center gap-2 text-slate-200 text-left flex-1"
            >
              <User className="w-4 h-4 text-indigo-400" />
              <span className={(data.styles.hiddenSections || []).includes('personalInfo') ? "line-through text-slate-500 font-normal italic" : ""}>
                Contact & Summary
              </span>
            </button>
            <div className="flex items-center gap-2 text-slate-400 ml-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHideSection('personalInfo');
                }}
                className="p-1 rounded hover:text-slate-100 hover:bg-slate-800 transition"
                title={(data.styles.hiddenSections || []).includes('personalInfo') ? "Show Section" : "Hide Section"}
              >
                {(data.styles.hiddenSections || []).includes('personalInfo') ? (
                  <EyeOff className="w-4 h-4 text-rose-400" />
                ) : (
                  <Eye className="w-4 h-4 text-emerald-400" />
                )}
              </button>
              <button 
                onClick={() => toggleSection('personalInfo')}
                className="p-1 rounded hover:text-slate-100 hover:bg-slate-800 transition"
              >
                {expandedSections.personalInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
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

              <MarkdownTextarea
                id="summary-input"
                label="Professional Summary (Markdown allowed)"
                rows={3}
                value={data.personalInfo.summary}
                onChange={(val) => handlePersonalInfoChange('summary', val)}
                placeholder="Senior developer with 5+ years of experience. Specialized in **React** and *TypeScript*."
              />

              {/* Social Links */}
              <SocialLinksSection
                links={data.personalInfo.socialLinks || []}
                onChange={(links: SocialLink[]) =>
                  onChange({
                    ...data,
                    personalInfo: { ...data.personalInfo, socialLinks: links },
                  })
                }
              />

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
          <div className="w-full flex items-center justify-between p-4 bg-slate-950/40 font-bold border-b border-slate-850">
            <button 
              onClick={() => toggleSection('experience')}
              className="flex items-center gap-2 text-slate-200 text-left flex-1"
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span className={(data.styles.hiddenSections || []).includes('experience') ? "line-through text-slate-500 font-normal italic" : ""}>
                Work Experience
              </span>
            </button>
            <div className="flex items-center gap-2 text-slate-400 ml-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHideSection('experience');
                }}
                className="p-1 rounded hover:text-slate-100 hover:bg-slate-800 transition"
                title={(data.styles.hiddenSections || []).includes('experience') ? "Show Section" : "Hide Section"}
              >
                {(data.styles.hiddenSections || []).includes('experience') ? (
                  <EyeOff className="w-4 h-4 text-rose-400" />
                ) : (
                  <Eye className="w-4 h-4 text-emerald-400" />
                )}
              </button>
              <button 
                onClick={() => toggleSection('experience')}
                className="p-1 rounded hover:text-slate-100 hover:bg-slate-800 transition"
              >
                {expandedSections.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

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

                            <MarkdownTextarea
                              id={`exp-desc-${exp.id}`}
                              label="Description & Bullet Points (Markdown allowed)"
                              rows={3}
                              value={exp.description}
                              onChange={(val) => {
                                const updated = data.experience.map(item => item.id === exp.id ? { ...item, description: val } : item);
                                updateField('experience', updated);
                              }}
                              placeholder="• Developed scalable UI components using **React**&#10;• Led optimization refactors reducing LCP by *35%*"
                            />

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
                className="w-full flex items-center justify-center gap-1 py-2.5 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition shadow-md shadow-indigo-600/10"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            </div>
          )}
        </div>

        {/* EDUCATION PANEL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="w-full flex items-center justify-between p-4 bg-slate-950/40 font-bold border-b border-slate-850">
            <button 
              onClick={() => toggleSection('education')}
              className="flex items-center gap-2 text-slate-200 text-left flex-1"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span className={(data.styles.hiddenSections || []).includes('education') ? "line-through text-slate-500 font-normal italic" : ""}>
                Education
              </span>
            </button>
            <div className="flex items-center gap-2 text-slate-400 ml-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHideSection('education');
                }}
                className="p-1 rounded hover:text-slate-100 hover:bg-slate-800 transition"
                title={(data.styles.hiddenSections || []).includes('education') ? "Show Section" : "Hide Section"}
              >
                {(data.styles.hiddenSections || []).includes('education') ? (
                  <EyeOff className="w-4 h-4 text-rose-400" />
                ) : (
                  <Eye className="w-4 h-4 text-emerald-400" />
                )}
              </button>
              <button 
                onClick={() => toggleSection('education')}
                className="p-1 rounded hover:text-slate-100 hover:bg-slate-800 transition"
              >
                {expandedSections.education ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

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
          <div className="w-full flex items-center justify-between p-4 bg-slate-950/40 font-bold border-b border-slate-850">
            <button 
              onClick={() => toggleSection('skills')}
              className="flex items-center gap-2 text-slate-200 text-left flex-1"
            >
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span className={(data.styles.hiddenSections || []).includes('skills') ? "line-through text-slate-500 font-normal italic" : ""}>
                Skills Categories
              </span>
            </button>
            <div className="flex items-center gap-2 text-slate-400 ml-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHideSection('skills');
                }}
                className="p-1 rounded hover:text-slate-100 hover:bg-slate-800 transition"
                title={(data.styles.hiddenSections || []).includes('skills') ? "Show Section" : "Hide Section"}
              >
                {(data.styles.hiddenSections || []).includes('skills') ? (
                  <EyeOff className="w-4 h-4 text-rose-400" />
                ) : (
                  <Eye className="w-4 h-4 text-emerald-400" />
                )}
              </button>
              <button 
                onClick={() => toggleSection('skills')}
                className="p-1 rounded hover:text-slate-100 hover:bg-slate-800 transition"
              >
                {expandedSections.skills ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

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
          <div className="w-full flex items-center justify-between p-4 bg-slate-950/40 font-bold border-b border-slate-850">
            <button 
              onClick={() => toggleSection('projects')}
              className="flex items-center gap-2 text-slate-200 text-left flex-1"
            >
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              <span className={(data.styles.hiddenSections || []).includes('projects') ? "line-through text-slate-500 font-normal italic" : ""}>
                Projects
              </span>
            </button>
            <div className="flex items-center gap-2 text-slate-400 ml-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHideSection('projects');
                }}
                className="p-1 rounded hover:text-slate-100 hover:bg-slate-800 transition"
                title={(data.styles.hiddenSections || []).includes('projects') ? "Show Section" : "Hide Section"}
              >
                {(data.styles.hiddenSections || []).includes('projects') ? (
                  <EyeOff className="w-4 h-4 text-rose-400" />
                ) : (
                  <Eye className="w-4 h-4 text-emerald-400" />
                )}
              </button>
              <button 
                onClick={() => toggleSection('projects')}
                className="p-1 rounded hover:text-slate-100 hover:bg-slate-800 transition"
              >
                {expandedSections.projects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

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

                            <MarkdownTextarea
                              id={`proj-desc-${proj.id}`}
                              label="Project Description (Markdown allowed)"
                              rows={3}
                              value={proj.description}
                              onChange={(val) => {
                                const updated = data.projects.map(item => item.id === proj.id ? { ...item, description: val } : item);
                                updateField('projects', updated);
                              }}
                              placeholder="Built a client-side exporter with **60fps** render speeds."
                            />

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
        {data.customSections.map((cs) => {
          const isHidden = (data.styles.hiddenSections || []).includes(cs.id);
          return (
            <div key={cs.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="w-full flex items-center justify-between p-4 bg-slate-950/40 font-bold border-b border-slate-850">
                <button 
                  onClick={() => toggleSection(cs.id)}
                  className="flex items-center gap-2 text-slate-200 text-left flex-1"
                >
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span className={isHidden ? "line-through text-slate-500 font-normal italic" : ""}>
                    {cs.title} (Custom)
                  </span>
                </button>
                <div className="flex items-center gap-2 text-slate-400 ml-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHideSection(cs.id);
                    }}
                    className="p-1 rounded hover:text-slate-100 hover:bg-slate-800 transition"
                    title={isHidden ? "Show Section" : "Hide Section"}
                  >
                    {isHidden ? (
                      <EyeOff className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCustomSection(cs.id);
                    }}
                    className="p-1 rounded hover:text-rose-450 hover:bg-slate-800 transition"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4 text-rose-450" />
                  </button>
                  <button 
                    onClick={() => toggleSection(cs.id)}
                    className="p-1 rounded hover:text-slate-100 hover:bg-slate-800 transition"
                  >
                    {expandedSections[cs.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            {expandedSections[cs.id] && (
              <div className="p-4 space-y-4 border-t border-slate-850">
                             {/* Dynamic custom fields manager */}
                <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-xl space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Section Fields Setup:</div>
                  
                  {/* List of existing custom fields */}
                  {cs.fields.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {cs.fields.map(f => (
                        <div key={f.id} className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-850 rounded-lg text-xs text-slate-300">
                          <span className="font-semibold text-indigo-400">[{f.type === 'textarea' ? 'desc' : f.type}]</span>
                          <span>{f.label}</span>
                          <button 
                            type="button"
                            onClick={() => deleteCustomField(cs.id, f.id)}
                            className="text-slate-500 hover:text-rose-400 transition"
                            title="Delete Field"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No custom fields defined yet. Add fields below to build your form!</p>
                  )}

                  {/* Add field form */}
                  <div className="pt-2 border-t border-slate-850/80 flex flex-wrap sm:flex-nowrap items-end gap-2 text-xs">
                    <div className="flex-1 min-w-0 space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold uppercase block">Field Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Project Link, Website"
                        value={newFieldLabels[cs.id] || ''}
                        onChange={(e) => setNewFieldLabels(prev => ({ ...prev, [cs.id]: e.target.value }))}
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="w-full sm:w-44 space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold uppercase block">Field Type</label>
                      <select
                        value={newFieldTypes[cs.id] || 'text'}
                        onChange={(e) => setNewFieldTypes(prev => ({ ...prev, [cs.id]: e.target.value as any }))}
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-350 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="title">Header / Main Title</option>
                        <option value="text">Sub-heading / Normal Text</option>
                        <option value="date">Timeline / Date</option>
                        <option value="textarea">Description (Markdown)</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => addCustomField(cs.id)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shrink-0"
                    >
                      Add Field
                    </button>
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
                                    {f.type === 'textarea' ? (
                                      <MarkdownTextarea
                                        id={`custom-${cs.id}-${item.id}-${f.name}`}
                                        label={f.label}
                                        rows={3}
                                        value={item[f.name] || ''}
                                        onChange={(val) => handleCustomItemChange(cs.id, item.id, f.name, val)}
                                        placeholder="Enter details (Markdown allowed)"
                                      />
                                    ) : (
                                      <>
                                        <label className="text-[11px] text-slate-400 font-semibold block">{f.label}</label>
                                        <input
                                          type="text"
                                          value={item[f.name] || ''}
                                          onChange={(e) => handleCustomItemChange(cs.id, item.id, f.name, e.target.value)}
                                          placeholder={`Enter ${f.label.toLowerCase()}`}
                                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                      </>
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
          );
        })}

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
